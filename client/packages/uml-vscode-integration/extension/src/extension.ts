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

import { GlspVscodeConnector } from '@eclipse-glsp/vscode-integration';
import { configureDefaultCommands } from '@eclipse-glsp/vscode-integration/lib/quickstart-components';
import * as vscode from 'vscode';
import { createContainer } from './di.config';
import { TYPES, VSCODE_TYPES } from './di.types';
import { UVGlspServer } from './glsp/connection/uv-glsp-server';
import { launchGLSPServer } from './glsp/launcher/launcher';
import { VSCodeSettings } from './language';
import { launchModelServer } from './modelserver/launcher/launcher';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    const container = createContainer(context);
    if (process.env.UML_MODEL_SERVER_DEBUG !== 'true') {
        await launchModelServer(context);
    }

    if (process.env.UML_GLSP_SERVER_DEBUG !== 'true') {
        await launchGLSPServer(context);
    }

    configureDefaultCommands({
        extensionContext: context,
        connector: container.get<GlspVscodeConnector>(TYPES.Connector),
        diagramPrefix: VSCodeSettings.commands.prefix
    });

    container.getAll<any>(VSCODE_TYPES.Watcher);
    container.get<any>(VSCODE_TYPES.EditorProvider);
    container.get<any>(VSCODE_TYPES.CommandManager);
    container.get<any>(VSCODE_TYPES.DisposableManager);
    container.get<UVGlspServer>(TYPES.GlspServer).start();
}
