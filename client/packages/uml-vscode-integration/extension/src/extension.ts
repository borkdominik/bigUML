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
import { createContainer } from './di.config';
import { TYPES } from './di.types';
import { UMLGLSPConnector } from './glsp/uml-glsp-connector';
import { UMLGLSPServer } from './glsp/uml-glsp-server';
import { VSCodeSettings } from './language';
import { createGLSPServerConfig, ServerManager } from './server';
import { configureDefaultCommands } from './vscode/command/default-commands';

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

export async function deactivate(context: vscode.ExtensionContext): Promise<any> {
    if (diContainer) {
        return Promise.all([diContainer.get<ServerManager>(TYPES.ServerManager).stop()]);
    }
}
