/********************************************************************************
 * Copyright (c) 2026 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { isOperation, isParameter } from '@borkdominik-biguml/uml-model-server/grammar';
import {
    ApplyLabelEditOperation,
    ClientSessionManager,
    CreateNodeOperation,
    DeleteElementOperation,
    type GModelElement,
    Logger,
    ModelState
} from '@eclipse-glsp/server';
import { createToolResult, type GLSPMcpServer, McpIdAliasService, type McpToolHandler } from '@eclipse-glsp/server-mcp';
import { type CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { inject, injectable } from 'inversify';
import * as z from 'zod/v4';
import { ClassDiagramNodeTypes, CommonModelTypes, UpdateOperation } from '../../../common/index.js';
import { type DiagramModelIndex } from '../model/diagram-model-index.js';

/**
 * Modifies one or multiple new members in the given session's model.
 */
@injectable()
export class ModifyMembersMcpToolHandler implements McpToolHandler {
    @inject(Logger)
    protected logger: Logger;

    @inject(ClientSessionManager)
    protected clientSessionManager: ClientSessionManager;

    registerTool(server: GLSPMcpServer): void {
        server.registerTool(
            'modify-members',
            {
                description:
                    'Modify one or multiple existing member elements in the diagram. ' +
                    'This operation modifies the diagram state and requires user approval.',
                inputSchema: {
                    sessionId: z.string().describe('Session ID where the members should be modified'),
                    changes: z
                        .array(
                            z.object({
                                elementId: z.string().describe('Element ID that should be modified.'),
                                name: z.string().optional().describe('New name of the member.'),
                                propertyDetails: z
                                    .object({
                                        propertyTypeId: z
                                            .string()
                                            .optional()
                                            .describe('ID of a node that qualifies as data type to use as type for this UML property.'),
                                        visibility: z
                                            .enum(['PUBLIC', 'PRIVATE', 'PROTECTED', 'PACKAGE'])
                                            .optional()
                                            .describe('Visibility of this UML property.')
                                    })
                                    .optional()
                                    .describe('Details for a UML property member.'),
                                operationDetails: z
                                    .object({
                                        returnTypeId: z
                                            .string()
                                            .optional()
                                            .describe(
                                                'ID of a node that qualifies as data type to use as return type for this UML operation.'
                                            ),
                                        visibility: z
                                            .enum(['PUBLIC', 'PRIVATE', 'PROTECTED', 'PACKAGE'])
                                            .optional()
                                            .describe('Visibility of this UML operation.'),
                                        parameterList: z
                                            .array(
                                                z.object({
                                                    name: z.string().describe('Name of this UML parameter.'),
                                                    parameterTypeId: z
                                                        .string()
                                                        .describe(
                                                            'ID of a node that qualifies as data type to use as type for this UML parameter.'
                                                        )
                                                })
                                            )
                                            .optional()
                                            .describe('List of UML parameters of this UML operation.')
                                    })
                                    .optional()
                                    .describe('Details for a UML operation member.')
                            })
                        )
                        .min(1)
                        .describe('Array of changes. Must include at least one element.')
                }
            },
            params => this.handle(params)
        );
    }

    async handle({
        sessionId,
        changes
    }: {
        sessionId: string;
        changes: {
            elementId: string;
            name?: string;
            propertyDetails?: {
                propertyTypeId?: string;
                visibility?: string;
            };
            operationDetails?: {
                returnTypeId?: string;
                visibility?: string;
                parameterList?: { name: string; parameterTypeId: string }[];
            };
        }[];
    }): Promise<CallToolResult> {
        this.logger.info(`'modify-members' invoked for session '${sessionId}' with ${changes.length} changes`);

        if (!sessionId) {
            return createToolResult('No session id provided.', true);
        }
        if (!changes || !changes.length) {
            return createToolResult('No changes provided.', true);
        }

        const session = this.clientSessionManager.getSession(sessionId);
        if (!session) {
            return createToolResult('Session not found', true);
        }

        const modelState = session.container.get<ModelState>(ModelState);
        if (modelState.isReadonly) {
            return createToolResult('Model is read-only', true);
        }

        const mcpIdAliasService = session.container.get<McpIdAliasService>(McpIdAliasService);

        const elements: [(typeof changes)[number], GModelElement | undefined][] = changes.map(change => [
            change,
            modelState.index.find(mcpIdAliasService.lookup(sessionId, change.elementId)) as GModelElement | undefined
        ]);

        const undefinedElements = elements.filter(([_change, element]) => !element).map(([change]) => change.elementId);
        if (undefinedElements.length) {
            return createToolResult(`No nodes found for the following element ids: ${undefinedElements}`, true);
        }

        let dispatchedOperations = 0;

        for (const [change, element] of elements) {
            const { name, operationDetails, propertyDetails } = change;
            const elementId = element!.id;

            if (element!.type === ClassDiagramNodeTypes.ENUMERATION_LITERAL) {
                const elementLabelId = element!.children.find(child => child.type === CommonModelTypes.LABEL_NAME)?.id;
                if (elementLabelId && name) {
                    const editLabelOperation = ApplyLabelEditOperation.create({ labelId: elementLabelId, text: name });
                    await session.actionDispatcher.dispatch(editLabelOperation);
                    dispatchedOperations++;
                }
            } else if (element!.type === ClassDiagramNodeTypes.PROPERTY && propertyDetails) {
                propertyDetails.propertyTypeId = propertyDetails.propertyTypeId
                    ? mcpIdAliasService.lookup(sessionId, propertyDetails.propertyTypeId)
                    : undefined;

                if (name !== undefined) {
                    await session.actionDispatcher.dispatch(UpdateOperation.create(elementId, 'name', name));
                    dispatchedOperations++;
                }
                if (propertyDetails.propertyTypeId !== undefined) {
                    await session.actionDispatcher.dispatch(
                        UpdateOperation.create(elementId, 'propertyType', propertyDetails.propertyTypeId + '_refValue')
                    );
                    dispatchedOperations++;
                }
                if (propertyDetails.visibility !== undefined) {
                    await session.actionDispatcher.dispatch(UpdateOperation.create(elementId, 'visibility', propertyDetails.visibility));
                    dispatchedOperations++;
                }
            } else if (element!.type === ClassDiagramNodeTypes.OPERATION && operationDetails) {
                operationDetails.returnTypeId = operationDetails.returnTypeId
                    ? mcpIdAliasService.lookup(sessionId, operationDetails.returnTypeId)
                    : undefined;

                if (name !== undefined) {
                    await session.actionDispatcher.dispatch(UpdateOperation.create(elementId, 'name', name));
                    dispatchedOperations++;
                }
                if (operationDetails.returnTypeId !== undefined) {
                    await session.actionDispatcher.dispatch(
                        UpdateOperation.create(elementId, 'propertyType', operationDetails.returnTypeId + '_refValue')
                    );
                    dispatchedOperations++;
                }
                if (operationDetails.visibility !== undefined) {
                    await session.actionDispatcher.dispatch(UpdateOperation.create(elementId, 'visibility', operationDetails.visibility));
                    dispatchedOperations++;
                }

                if (operationDetails.parameterList) {
                    const parameterIds =
                        (modelState.index as DiagramModelIndex)
                            .findSemanticElement(elementId, isOperation)
                            ?.parameters.map(param => param?.__id) ?? [];
                    await session.actionDispatcher.dispatch(DeleteElementOperation.create(parameterIds));
                    dispatchedOperations++;

                    for (const parameter of operationDetails.parameterList) {
                        const beforeIdsParam: string[] = Array.from((modelState.index as any).idToSemanticNode.keys());

                        const operation = CreateNodeOperation.create(ClassDiagramNodeTypes.PARAMETER, { containerId: elementId });
                        await session.actionDispatcher.dispatch(operation);
                        dispatchedOperations++;

                        // There seems to some issue with an extremely short window of stale data that causes a weird issue
                        // It's not really testable because any logging or debugging delays the execution and thus fixes the issue
                        // Therefore, a tiny delay is added to prevent this issue
                        await new Promise(resolve => setTimeout(resolve, 10));

                        const afterIdsParam: string[] = Array.from((modelState.index as any).idToSemanticNode.keys());

                        const newIdsParam = afterIdsParam.filter(id => !beforeIdsParam.includes(id));
                        const newElementsParam = newIdsParam
                            .map(id => (modelState.index as DiagramModelIndex).findSemanticElement(id, isParameter))
                            .filter(element => element);
                        const newElementIdParam = newElementsParam.length > 0 ? newElementsParam[0]?.__id : undefined;
                        if (newElementsParam.length > 1) {
                            this.logger.warn('More than 1 new element created');
                        }

                        if (!newElementIdParam) {
                            this.logger.warn(`Parameter creation failed for input: ${JSON.stringify(parameter)}`);
                            continue;
                        }

                        parameter.parameterTypeId = mcpIdAliasService.lookup(sessionId, parameter.parameterTypeId);

                        await session.actionDispatcher.dispatch(UpdateOperation.create(newElementIdParam, 'name', parameter.name));
                        dispatchedOperations++;
                        await session.actionDispatcher.dispatch(
                            UpdateOperation.create(newElementIdParam, 'parameterType', parameter.parameterTypeId + '_refValue')
                        );
                        dispatchedOperations++;
                    }
                }
            }
        }

        return createToolResult(`Succesfully modified ${changes.length} node(s) (in ${dispatchedOperations} commands)`, false);
    }
}
