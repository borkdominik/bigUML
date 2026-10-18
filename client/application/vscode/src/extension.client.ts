/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import '../css/colors.css';

import { VSCodeSettings } from '@borkdominik-biguml/big-vscode';
import { TYPES, type BigGlspVSCodeConnector, type GlspServer, type OnActivate } from '@borkdominik-biguml/big-vscode/vscode';
import { CreateEdgeOperation, CreateNodeOperation, DeleteElementOperation, SaveModelAction } from '@eclipse-glsp/protocol';
import { type Container } from 'inversify';
import * as vscode from 'vscode';
import { createContainer } from './extension.config.js';
import { glspServerReady } from './extension.server.js';

let diContainer: Container | undefined;

export async function activateClient(context: vscode.ExtensionContext): Promise<void> {
    try {
        diContainer = createContainer(context, {
            glspServerConfig: {
                port: 5007
            },
            diagram: {
                diagramType: VSCodeSettings.diagramType,
                name: VSCodeSettings.name
            }
        });

        diContainer.getAll<OnActivate>(TYPES.OnActivate).forEach(service => service.onActivate?.());

        // Wait for the server process to signal that the GLSP port is open.
        // Fall back to 30 s in case no workspace is present or the signal never arrives.
        const timeout = new Promise<void>(resolve => setTimeout(resolve, 30_000));
        void Promise.race([glspServerReady, timeout]).then(() => {
            void diContainer!.get<GlspServer>(TYPES.GlspServer).start();
        });

        vscode.commands.executeCommand('setContext', `${VSCodeSettings.name}.isRunning`, true);

        // Register GLSP operation commands for AI tools to trigger live diagram updates.
        // Returns true if the diagram is open and the operation was dispatched, false otherwise
        // (caller should fall back to a direct file write in that case).
        context.subscriptions.push(
            vscode.commands.registerCommand(
                'biguml.operations.createNode',
                (filePath: string, elementTypeId: string, name: string, x: number, y: number): boolean => {
                    const connector = diContainer?.get<BigGlspVSCodeConnector>(TYPES.GlspVSCodeConnector);
                    if (!connector) return false;
                    const client = findClientForFile(connector, filePath);
                    if (!client) return false;
                    connector.sendActionToServer(client, CreateNodeOperation.create(elementTypeId, { location: { x, y }, args: { name } }));
                    connector.sendActionToServer(client, SaveModelAction.create());
                    return true;
                }
            ),
            vscode.commands.registerCommand('biguml.operations.deleteElement', (filePath: string, elementId: string): boolean => {
                const connector = diContainer?.get<BigGlspVSCodeConnector>(TYPES.GlspVSCodeConnector);
                if (!connector) return false;
                const client = findClientForFile(connector, filePath);
                if (!client) return false;
                connector.sendActionToServer(client, DeleteElementOperation.create([elementId]));
                connector.sendActionToServer(client, SaveModelAction.create());
                return true;
            }),
            vscode.commands.registerCommand(
                'biguml.operations.createEdge',
                (filePath: string, elementTypeId: string, sourceId: string, targetId: string, name?: string): boolean => {
                    const connector = diContainer?.get<BigGlspVSCodeConnector>(TYPES.GlspVSCodeConnector);
                    if (!connector) return false;
                    const client = findClientForFile(connector, filePath);
                    if (!client) return false;
                    const args = name !== undefined ? { name } : undefined;
                    connector.sendActionToServer(
                        client,
                        CreateEdgeOperation.create({ elementTypeId, sourceElementId: sourceId, targetElementId: targetId, args })
                    );
                    connector.sendActionToServer(client, SaveModelAction.create());
                    return true;
                }
            ),
            vscode.commands.registerCommand(
                'biguml.operations.createMember',
                (filePath: string, elementTypeId: string, containerId: string, name: string): boolean => {
                    const connector = diContainer?.get<BigGlspVSCodeConnector>(TYPES.GlspVSCodeConnector);
                    if (!connector) return false;
                    const client = findClientForFile(connector, filePath);
                    if (!client) return false;
                    connector.sendActionToServer(client, CreateNodeOperation.create(elementTypeId, { containerId, args: { name } }));
                    connector.sendActionToServer(client, SaveModelAction.create());
                    return true;
                }
            )
        );
    } catch (error) {
        console.error('Failed to activate the extension:', error);
        vscode.window.showErrorMessage('Failed to activate the extension. Please check the console for details.');
    }
}

export async function deactivateClient(_context: vscode.ExtensionContext): Promise<any> {
    if (diContainer) {
        return Promise.all([]);
    }
}

function findClientForFile(connector: BigGlspVSCodeConnector, filePath: string): string | undefined {
    const wsFolders = vscode.workspace.workspaceFolders;
    if (!wsFolders?.length) return undefined;
    const uri = vscode.Uri.joinPath(wsFolders[0].uri, filePath);
    const document = connector.documents.find(d => d.uri.toString() === uri.toString());
    if (!document) return undefined;
    return connector.clientIdByDocument(document);
}
