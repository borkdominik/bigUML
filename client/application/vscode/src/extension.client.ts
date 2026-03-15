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
import { TYPES, type GLSPServer, type OnActivate } from '@borkdominik-biguml/big-vscode/vscode';
import { type Container } from 'inversify';
import * as vscode from 'vscode';
import { createContainer } from './extension.config.js';

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

        setTimeout(() => {
            diContainer!.get<GLSPServer>(TYPES.GLSPServer).start();
        }, 2000);

        vscode.commands.executeCommand('setContext', `${VSCodeSettings.name}.isRunning`, true);
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
