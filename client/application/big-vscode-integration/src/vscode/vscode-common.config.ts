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
import { baseModule } from './base/base.module.js';
import { actionModule } from './features/action/action.module.js';
import { commandModule } from './features/command/command.module.js';
import { connectorModule } from './features/connector/connector.module.js';
import type { GLSPDiagramSettings } from './features/glsp/settings.js';
import { experimentalServerModule } from './features/index.js';
import { outputModule } from './features/output/output.module.js';
import { webviewModule } from './features/webview/webview.module.js';
import { TYPES } from './vscode-common.types.js';

export function createVSCodeCommonContainer(
    extensionContext: vscode.ExtensionContext,
    options: {
        diagram: GLSPDiagramSettings;
    }
): Container {
    const container = new Container({
        skipBaseClassChecks: true
    });

    container.bind(TYPES.ExtensionContext).toConstantValue(extensionContext);
    container.bind(TYPES.GLSPDiagramSettings).toConstantValue(options.diagram);

    container.load(baseModule, actionModule, commandModule, connectorModule, outputModule, webviewModule, experimentalServerModule);

    return container;
}
