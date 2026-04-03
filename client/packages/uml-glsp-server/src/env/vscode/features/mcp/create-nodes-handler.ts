/********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
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

import { ApplyLabelEditOperation, CreateNodeOperation, DefaultTypes, ModelState, type GModelElement } from '@eclipse-glsp/server';
import { CreateNodesMcpToolHandler, createToolResult, McpIdAliasService } from '@eclipse-glsp/server-mcp';
import { type CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { injectable } from 'inversify';
import { ClassDiagramNodeTypes, CommonModelTypes } from '../../../common/index.js';

@injectable()
export class UmlCreateNodesMcpToolHandler extends CreateNodesMcpToolHandler {
    override async handle({
        sessionId,
        nodes
    }: {
        sessionId: string;
        nodes: {
            elementTypeId: string;
            position: { x: number; y: number };
            text?: string;
            containerId?: string;
            args?: Record<string, any>;
        }[];
    }): Promise<CallToolResult> {
        this.logger.info(`'create-nodes' invoked for session '${sessionId}' with ${nodes.length} nodes`);

        if (!sessionId) {
            return createToolResult('No session id provided.', true);
        }
        if (!nodes || !nodes.length) {
            return createToolResult('No nodes provided.', true);
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

        const errors: string[] = [];
        const successIds: string[] = [];
        let dispatchedOperations = 0;
        // Since we need sequential handling of the created elements, we can't call all in parallel
        for (const node of nodes) {
            const { elementTypeId, position, text, args } = node;
            const containerId = node.containerId ? mcpIdAliasService.lookup(sessionId, node.containerId) : undefined;

            // Snapshot element IDs before operation
            const beforeIds = modelState.index.allIds();

            // Using the name "position" instead of "location", as this is the name in the element's properties
            // This just ensures that the AI sees a coherent API with common naming
            // Here in the code, we can just reassign anyway
            const operation = CreateNodeOperation.create(elementTypeId, { location: position, containerId, args });
            // Wait for the operation to be handled so the new ID is present
            await session.actionDispatcher.dispatch(operation);
            dispatchedOperations++;

            // Snapshot element IDs after operation
            const afterIds = modelState.index.allIds();

            // Find new element ID by filtering only the newly added ones,...
            const newIds = afterIds.filter(id => !beforeIds.includes(id));
            // ...find the new elements that are of the same type as the created element,
            const newElements = newIds
                .map(id => modelState.index.find(id))
                .filter(element => {
                    // Need special handling for abstract class
                    if (elementTypeId === ClassDiagramNodeTypes.ABSTRACT_CLASS) {
                        return element?.type === ClassDiagramNodeTypes.CLASS;
                    }
                    return element?.type === elementTypeId;
                });
            // ...and in case that multiple exist (which should never be the case),
            // assume that the first new element represents the actually relevant element
            const newElementId = newElements.length > 0 ? newElements[0]?.id : undefined;
            // Log a warning in case that multiple elements of the same type were created
            if (newElements.length > 1) {
                this.logger.warn('More than 1 new element created');
            }

            // We can't directly know whether an operation failed, because there are no
            // direct responses, but if we see no new ID, we can assume it failed
            if (!newElementId) {
                errors.push(`Node creation likely failed because no new element ID was found for input: ${JSON.stringify(node)}`);
                continue;
            }

            const newElementLabelId = this.getCorrespondingLabelId(modelState.index.get(newElementId));
            // If it is indeed labeled (and we actually want to set the label)...
            if (newElementLabelId && text) {
                // ...then use an already existing operation to set the label
                const editLabelOperation = ApplyLabelEditOperation.create({ labelId: newElementLabelId, text });
                await session.actionDispatcher.dispatch(editLabelOperation);
                dispatchedOperations++;
            }

            successIds.push(mcpIdAliasService.alias(sessionId, newElementId));
        }

        // Create a failure string if any errors occurred
        let failureStr = '';
        if (errors.length) {
            const failureListStr = errors.map(error => `- ${error}\n`);
            failureStr = `\nThe following errors occured:\n${failureListStr}`;
        }

        const successListStr = successIds.map(successId => `- ${successId}`).join('\n');
        // Even if every input given yields an error, the MCP call was still successful technically (even if not semantically)
        // Otherwise, we would need some kind of transaction to rollback successful creations, which would be a great technical challenge
        return createToolResult(
            `Successfully created ${successIds.length} node(s) (in ${dispatchedOperations} commands) ` +
                `with the element IDs:\n${successListStr}${failureStr}`,
            false
        );
    }

    override getCorrespondingLabelId(element: GModelElement): string | undefined {
        // First, try to find a direct label child -> e.g., enumeration literals
        const directLabel = element.children.find(child => child.type === CommonModelTypes.LABEL_NAME)?.id;
        if (directLabel) {
            return directLabel;
        }

        // Otherwise, first check whether the element uses a header -> this applies to most class-like elements
        const compHeaderLabel = element.children
            .find(child => child.type === DefaultTypes.COMPARTMENT_HEADER)
            ?.children.find(child => child.type === CommonModelTypes.LABEL_NAME)?.id;
        if (compHeaderLabel) {
            return compHeaderLabel;
        }

        return undefined;
    }
}
