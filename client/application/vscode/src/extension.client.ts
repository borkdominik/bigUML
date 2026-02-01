/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import '../css/colors.css';

import { TYPES, type GLSPServer } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { type Container } from 'inversify';
import * as vscode from 'vscode';
import { createContainer } from './extension.config.js';
import { VSCodeSettings } from './language.js';

let diContainer: Container | undefined;

export async function activateClient(context: vscode.ExtensionContext): Promise<void> {
    diContainer = createContainer(context, {
        glspServerConfig: {
            port: 5007
        },
        diagram: {
            diagramType: VSCodeSettings.diagramType,
            name: VSCodeSettings.name
        }
    });

    diContainer.getAll<any>(TYPES.RootInitialization);
    // await diContainer.get<ServerManager>(TYPES.ServerManager).start();

    setTimeout(() => {
        diContainer!.get<GLSPServer>(TYPES.GLSPServer).start();
    }, 2000);

    vscode.commands.executeCommand('setContext', `${VSCodeSettings.name}.isRunning`, true);
}

export async function deactivateClient(_context: vscode.ExtensionContext): Promise<any> {
    if (diContainer) {
        return Promise.all([]);
    }
}
