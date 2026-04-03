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

import { type GShapeElement, ModelState } from '@eclipse-glsp/server';
import { createToolResult, type GLSPMcpServer, McpIdAliasService, ModifyEdgesMcpToolHandler } from '@eclipse-glsp/server-mcp';
import { type CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { injectable } from 'inversify';
import * as z from 'zod/v4';
import { UpdateOperation } from '../../../common/index.js';

@injectable()
export class UmlModifyEdgesMcpToolHandler extends ModifyEdgesMcpToolHandler {
    override registerTool(server: GLSPMcpServer): void {
        server.registerTool(
            'modify-edges',
            {
                description:
                    'Modify one or more associative edge elements in the diagram. ' +
                    'This operation modifies the diagram state and requires user approval.',
                inputSchema: {
                    sessionId: z.string().describe('Session ID in which the node should be modified'),
                    changes: z
                        .array(
                            z.object({
                                elementId: z.string().describe('Element ID that should be modified.'),
                                sourceMultiplicity: z
                                    // for some reason are neither numbers nor . allowed in label strings, which means we need alternatives
                                    .enum(['O--I', 'I', 'I--*', '*'])
                                    .optional()
                                    .describe('Source multiplicity for associative relationships'),
                                targetMultiplicity: z
                                    .enum(['O--I', 'I', 'I--*', '*'])
                                    .optional()
                                    .describe('Target multiplicity for associative relationships')
                            })
                        )
                        .min(1)
                        .describe(
                            'Array of change objects containing an element ID and their intended changes. Must include at least one change.'
                        )
                }
            },
            params => this.handle(params)
        );
    }

    override async handle({
        sessionId,
        changes
    }: {
        sessionId: string;
        changes: { elementId: string; sourceMultiplicity?: string; targetMultiplicity?: string }[];
    }): Promise<CallToolResult> {
        this.logger.info(`'modify-nodes' invoked for session '${sessionId}' with ${changes.length} changes`);

        if (!sessionId) {
            return createToolResult('No session id provided.', true);
        }
        if (!changes || !changes.length) {
            return createToolResult('No changes provided.', true);
        }

        const session = this.clientSessionManager.getSession(sessionId);
        if (!session) {
            return createToolResult('No active session found for this session id.', true);
        }

        const modelState = session.container.get<ModelState>(ModelState);
        if (modelState.isReadonly) {
            return createToolResult('Model is read-only', true);
        }

        const mcpIdAliasService = session.container.get<McpIdAliasService>(McpIdAliasService);

        // Map the list of changes to their underlying element
        const elements: [(typeof changes)[number], GShapeElement][] = changes.map(change => [
            change,
            modelState.index.find(mcpIdAliasService.lookup(sessionId, change.elementId)) as GShapeElement
        ]);

        // If any element could not be resolved, do not proceed
        // As compared to the create operations, changes can be done in bulk, i.e., in a single transaction
        const undefinedElements = elements.filter(([, element]) => !element).map(([change]) => change.elementId);
        if (undefinedElements.length) {
            return createToolResult(`No edges found for the following element ids: ${undefinedElements}`, true);
        }

        // Do all dispatches in parallel, as they should not interfere with each other
        const promises: Promise<void>[] = [];
        const errors: string[] = [];
        elements.forEach(([change]) => {
            const { sourceMultiplicity, targetMultiplicity } = change;
            const elementId = mcpIdAliasService.lookup(sessionId, change.elementId);

            if (sourceMultiplicity) {
                const multiplicityOperation = UpdateOperation.create(elementId, 'sourceMultiplicity', sourceMultiplicity);
                promises.push(session.actionDispatcher.dispatch(multiplicityOperation));
            }
            if (targetMultiplicity) {
                const multiplicityOperation = UpdateOperation.create(elementId, 'targetMultiplicity', targetMultiplicity);
                promises.push(session.actionDispatcher.dispatch(multiplicityOperation));
            }
        });

        // Wait for all dispatches to finish before notifying the caller
        await Promise.all(promises);

        // Create a failure string if any errors occurred
        let failureStr = '';
        if (errors.length) {
            const failureListStr = errors.map(error => `- ${error}\n`);
            failureStr = `\nThe following errors occured:\n${failureListStr}`;
        }

        return createToolResult(
            `Succesfully modified ${changes.length - errors.length} edge(s) (in ${promises.length} commands)${failureStr}`,
            false
        );
    }
}
