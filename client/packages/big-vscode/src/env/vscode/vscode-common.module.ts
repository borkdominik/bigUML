/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Container } from 'inversify';
import type * as vscode from 'vscode';
import { actionModule } from './features/action/action.module.js';
import { commandModule } from './features/command/command.module.js';
import { connectorModule } from './features/connector/connector.module.js';
import { disposableModule } from './features/disposable/disposable.module.js';
import type { GlspDiagramSettings } from './features/glsp/settings.js';
import { glspModule, webviewEditorModule, webviewViewModule } from './features/index.js';
import { outputModule } from './features/output/output.module.js';
import { glspServerModule, type GlspServerConfig } from './features/server/glsp-server.module.js';
import { ideServerModule } from './features/server/ide-server.module.js';
import { webviewModule } from './features/webview/webview.module.js';
import { TYPES } from './vscode-common.types.js';

export function vscodeModule(
    extensionContext: vscode.ExtensionContext,
    options: {
        glspServerConfig: GlspServerConfig;
        diagram: GlspDiagramSettings;
    }
): Container {
    const container = new Container({
        skipBaseClassChecks: true
    });

    container.bind(TYPES.ExtensionContext).toConstantValue(extensionContext);
    container.bind(TYPES.GlspDiagramSettings).toConstantValue(options.diagram);

    container.load(
        disposableModule,
        actionModule,
        commandModule,
        connectorModule,
        outputModule,
        webviewModule,
        webviewEditorModule,
        webviewViewModule,
        glspModule,
        glspServerModule(options.glspServerConfig),
        ideServerModule
    );

    return container;
}
