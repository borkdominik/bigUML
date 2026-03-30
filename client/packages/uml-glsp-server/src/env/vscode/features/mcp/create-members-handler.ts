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

import { isParameter } from '@borkdominik-biguml/uml-model-server/grammar';
import { ApplyLabelEditOperation, ClientSessionManager, CreateNodeOperation, Logger, ModelState } from '@eclipse-glsp/server';
import { createToolResult, type GLSPMcpServer, McpIdAliasService, type McpToolHandler } from '@eclipse-glsp/server-mcp';
import { type CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { inject, injectable } from 'inversify';
import * as z from 'zod/v4';
import { ClassDiagramNodeTypes, CommonModelTypes, UpdateOperation } from '../../../common/index.js';
import { type DiagramModelState } from '../model/diagram-model-state.js';

/**
 * Creates one or multiple new members in the given session's model.
 */
@injectable()
export class CreateMembersMcpToolHandler implements McpToolHandler {
    @inject(Logger)
    protected logger: Logger;

    @inject(ClientSessionManager)
    protected clientSessionManager: ClientSessionManager;

    registerTool(server: GLSPMcpServer): void {
        server.registerTool(
            'create-members',
            {
                description:
                    'Create one or multiple new member elements in the diagram for specified classifier nodes. ' +
                    'This operation modifies the diagram state and requires user approval. ' +
                    'First query element-types to discover valid element type IDs.',
                inputSchema: {
                    sessionId: z.string().describe('Session ID where the members should be created'),
                    members: z
                        .array(
                            z.object({
                                elementTypeId: z.string().describe('Element type ID. Use element-types resource to discover valid IDs.'),
                                name: z.string().describe('Name of the member.'),
                                containerId: z.string().describe('ID of the container classifier node.'),
                                propertyDetails: z
                                    .object({
                                        propertyTypeId: z
                                            .string()
                                            .describe('ID of a node that qualifies as data type to use as type for this UML property.'),
                                        visibility: z
                                            .enum(['PUBLIC', 'PRIVATE', 'PROTECTED', 'PACKAGE'])
                                            .describe('Visibility of this UML property.')
                                    })
                                    .optional()
                                    .describe('Details for a UML property member.'),
                                operationDetails: z
                                    .object({
                                        returnTypeId: z
                                            .string()
                                            .describe(
                                                'ID of a node that qualifies as data type to use as return type for this UML operation.'
                                            ),
                                        visibility: z
                                            .enum(['PUBLIC', 'PRIVATE', 'PROTECTED', 'PACKAGE'])
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
                                            .min(0)
                                            .describe('List of UML parameters of this UML operation.')
                                    })
                                    .optional()
                                    .describe('Details for a UML operation member.')
                            })
                        )
                        .min(1)
                        .describe('Array of members to create. Must include at least one element.')
                }
            },
            params => this.handle(params)
        );
    }

    async handle({
        sessionId,
        members
    }: {
        sessionId: string;
        members: {
            elementTypeId: string;
            name: string;
            containerId: string;
            propertyDetails?: {
                propertyTypeId: string;
                visibility: string;
            };
            operationDetails?: {
                returnTypeId: string;
                visibility: string;
                parameterList: { name: string; parameterTypeId: string }[];
            };
        }[];
    }): Promise<CallToolResult> {
        this.logger.info(`'create-members' invoked for session '${sessionId}' with ${members.length} nodes`);

        if (!sessionId) {
            return createToolResult('No session id provided.', true);
        }
        if (!members || !members.length) {
            return createToolResult('No members provided.', true);
        }

        const session = this.clientSessionManager.getSession(sessionId);
        if (!session) {
            return createToolResult('Session not found', true);
        }

        const modelState = session.container.get<DiagramModelState>(ModelState);
        if (modelState.isReadonly) {
            return createToolResult('Model is read-only', true);
        }

        const mcpIdAliasService = session.container.get<McpIdAliasService>(McpIdAliasService);

        const errors: string[] = [];
        const successIds: string[] = [];
        let dispatchedOperations = 0;
        for (const member of members) {
            const { elementTypeId, name, operationDetails, propertyDetails } = member;
            const containerId = mcpIdAliasService.lookup(sessionId, member.containerId);

            const beforeIds = modelState.index.allIds();

            // Each member element is still technically a node and is created as such
            const operation = CreateNodeOperation.create(elementTypeId, { containerId });
            await session.actionDispatcher.dispatch(operation);
            dispatchedOperations++;

            const afterIds = modelState.index.allIds();

            const newIds = afterIds.filter(id => !beforeIds.includes(id));
            const newElements = newIds.map(id => modelState.index.find(id)).filter(element => element?.type === elementTypeId);
            const newElementId = newElements.length > 0 ? newElements[0]?.id : undefined;
            if (newElements.length > 1) {
                this.logger.warn('More than 1 new element created');
            }

            if (!newElementId) {
                errors.push(`Member creation likely failed because no new element ID was found for input: ${JSON.stringify(member)}`);
                continue;
            }

            // The element was created but not yet indexed by the semantic tree
            // Thus, we must wait
            while (!modelState.index.findIdElement(newElementId)) {
                await new Promise(resolve => setTimeout(resolve, 10));
            }

            if (elementTypeId === ClassDiagramNodeTypes.ENUMERATION_LITERAL) {
                // Enumeration Literal has the label directly available and the label can be set directly as well
                const newElementLabelId = newElements[0]!.children.find(child => child.type === CommonModelTypes.LABEL_NAME)?.id;
                if (newElementLabelId && name) {
                    const editLabelOperation = ApplyLabelEditOperation.create({ labelId: newElementLabelId, text: name });
                    await session.actionDispatcher.dispatch(editLabelOperation);
                    dispatchedOperations++;
                }
            } else if (elementTypeId === ClassDiagramNodeTypes.PROPERTY && propertyDetails) {
                // The property's label/name and other attributes have to be set using `UpdateOperation`
                propertyDetails.propertyTypeId = mcpIdAliasService.lookup(sessionId, propertyDetails.propertyTypeId);

                // There seems to be some kind of hard check against the string "name", which causes the model state index to reset
                const escapedName = name === 'name' ? 'name_' : name;
                await session.actionDispatcher.dispatch(UpdateOperation.create(newElementId, 'name', escapedName));
                dispatchedOperations++;
                await session.actionDispatcher.dispatch(
                    UpdateOperation.create(newElementId, 'propertyType', propertyDetails.propertyTypeId + '_refValue')
                );
                dispatchedOperations++;
                await session.actionDispatcher.dispatch(UpdateOperation.create(newElementId, 'visibility', propertyDetails.visibility));
                dispatchedOperations++;
            } else if (elementTypeId === ClassDiagramNodeTypes.OPERATION && operationDetails) {
                // The operation's label/name and other attributes have to be set using `UpdateOperation`
                operationDetails.returnTypeId = mcpIdAliasService.lookup(sessionId, operationDetails.returnTypeId);

                // There seems to be some kind of hard check against the string "name", which causes the model state index to reset
                const escapedName = name === 'name' ? 'name_' : name;
                await session.actionDispatcher.dispatch(UpdateOperation.create(newElementId, 'name', escapedName));
                dispatchedOperations++;
                await session.actionDispatcher.dispatch(
                    UpdateOperation.create(newElementId, 'returnType', operationDetails.returnTypeId + '_refValue')
                );
                dispatchedOperations++;
                await session.actionDispatcher.dispatch(UpdateOperation.create(newElementId, 'visibility', operationDetails.visibility));
                dispatchedOperations++;

                for (const parameter of operationDetails.parameterList) {
                    const beforeIdsParam: string[] = modelState.index.allSemanticIds();

                    const operation = CreateNodeOperation.create(ClassDiagramNodeTypes.PARAMETER, { containerId: newElementId });
                    await session.actionDispatcher.dispatch(operation);
                    dispatchedOperations++;

                    // There seems to some issue with an extremely short window of stale data that causes a weird issue
                    // It's not really testable because any logging or debugging delays the execution and thus fixes the issue
                    // Therefore, a tiny delay is added to prevent this issue
                    await new Promise(resolve => setTimeout(resolve, 10));

                    const afterIdsParam: string[] = modelState.index.allSemanticIds();

                    const newIdsParam = afterIdsParam.filter(id => !beforeIdsParam.includes(id));
                    const newElementsParam = newIdsParam
                        .map(id => modelState.index.findSemanticElement(id, isParameter))
                        .filter(element => element);
                    const newElementIdParam = newElementsParam.length > 0 ? newElementsParam[0]?.__id : undefined;
                    if (newElementsParam.length > 1) {
                        this.logger.warn('More than 1 new element created');
                    }

                    if (!newElementIdParam) {
                        errors.push(
                            `Member creation likely failed because no new element ID was found for input: ${JSON.stringify(parameter)}`
                        );
                        continue;
                    }

                    parameter.parameterTypeId = mcpIdAliasService.lookup(sessionId, parameter.parameterTypeId);

                    const escapedName = parameter.name === 'name' ? 'name_' : parameter.name;
                    await session.actionDispatcher.dispatch(UpdateOperation.create(newElementIdParam, 'name', escapedName));
                    dispatchedOperations++;
                    await session.actionDispatcher.dispatch(
                        UpdateOperation.create(newElementIdParam, 'parameterType', parameter.parameterTypeId + '_refValue')
                    );
                    dispatchedOperations++;
                }
            }

            successIds.push(mcpIdAliasService.alias(sessionId, newElementId));
        }

        let failureStr = '';
        if (errors.length) {
            const failureListStr = errors.map(error => `- ${error}\n`);
            failureStr = `\nThe following errors occured:\n${failureListStr}`;
        }

        const successListStr = successIds.map(successId => `- ${successId}`).join('\n');
        return createToolResult(
            `Successfully created ${successIds.length} member(s) (in ${dispatchedOperations} commands) ` +
                `with the element IDs:\n${successListStr}${failureStr}`,
            false
        );
    }
}
