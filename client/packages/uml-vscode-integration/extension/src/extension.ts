/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import '../css/colors.css';

import { Container } from 'inversify';
import * as vscode from 'vscode';
import { createContainer } from './di.config.js';
import { TYPES } from './di.types.js';
import { UMLGLSPConnector } from './glsp/uml-glsp-connector.js';
import { UMLGLSPServer } from './glsp/uml-glsp-server.js';
import { VSCodeSettings } from './language.js';
import { createGLSPServerConfig, ServerManager } from './server/index.js';
import { configureDefaultCommands } from './vscode/command/default-commands.js';

let diContainer: Container | undefined;

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    const glspServerConfig = await createGLSPServerConfig();

    diContainer = createContainer(context, {
        glspServerConfig
    });

    configureDefaultCommands({
        extensionContext: context,
        connector: diContainer.get<UMLGLSPConnector>(TYPES.Connector),
        diagramPrefix: VSCodeSettings.commands.prefix
    });

    diContainer.getAll<any>(TYPES.RootInitialization);
    await diContainer.get<ServerManager>(TYPES.ServerManager).start();
    diContainer.get<UMLGLSPServer>(TYPES.GlspServer).start();

    vscode.commands.executeCommand('setContext', `${VSCodeSettings.name}.isRunning`, true);
}

export async function deactivate(_context: vscode.ExtensionContext): Promise<any> {
    if (diContainer) {
        return Promise.all([diContainer.get<ServerManager>(TYPES.ServerManager).stop()]);
    }
}
