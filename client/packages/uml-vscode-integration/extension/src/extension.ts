/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
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
import '../css/colors.css';

import { Container } from 'inversify';
import * as vscode from 'vscode';
import { createContainer } from './di.config';
import { TYPES, VSCODE_TYPES } from './di.types';
import { UVGlspConnector } from './glsp/uv-glsp-connector';
import { UVGlspServer } from './glsp/uv-glsp-server';
import { VSCodeSettings } from './language';
import { createGLSPServerConfig, createModelServerConfig, ServerLauncherManager } from './server';
import { configureDefaultCommands } from './vscode/command/default-commands';

let diContainer: Container | undefined;

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    const glspServerConfig = await createGLSPServerConfig();
    const modelServerConfig = await createModelServerConfig();

    diContainer = createContainer(context, {
        glspServerConfig,
        modelServerConfig
    });

    configureDefaultCommands({
        extensionContext: context,
        connector: diContainer.get<UVGlspConnector>(TYPES.Connector),
        diagramPrefix: VSCodeSettings.commands.prefix
    });

    // Start
    await diContainer.get<ServerLauncherManager>(TYPES.ServerLauncherManager).start();

    diContainer.getAll<any>(VSCODE_TYPES.Watcher);
    diContainer.get<any>(VSCODE_TYPES.EditorProvider);
    diContainer.get<any>(VSCODE_TYPES.CommandManager);
    diContainer.get<any>(VSCODE_TYPES.DisposableManager);

    diContainer.get<UVGlspServer>(TYPES.GlspServer).start();
}

export async function deactivate(context: vscode.ExtensionContext): Promise<any> {
    if (diContainer) {
        return Promise.all([diContainer.get<ServerLauncherManager>(TYPES.ServerLauncherManager).stop()]);
    }
}
