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

import { NavigateAction } from '@eclipse-glsp/vscode-integration';
import { configureDefaultCommands, GlspServerLauncher } from '@eclipse-glsp/vscode-integration/lib/quickstart-components';
import * as path from 'path';
import * as process from 'process';
import 'reflect-metadata';
import * as vscode from 'vscode';
import * as config from './server-config.json';
import { UmlVscodeConnector } from './vscode/connection/uml-vscode-connector';
import { UmlVscodeServer } from './vscode/connection/uml-vscode-server';
import UmlEditorProvider from './vscode/editor/uml-editor-provider';

const DEFAULT_SERVER_PORT = '5007';
const { version, isSnapShot } = config;
const JAVA_EXECUTABLE = path.join(__dirname, `../server/org.eclipse.glsp.example.uml-${version}${isSnapShot ? '-SNAPSHOT' : ''}-glsp.jar`);

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    // Start server process using quickstart component
    if (process.env.GLSP_SERVER_DEBUG !== 'true') {
        const serverProcess = new GlspServerLauncher({
            executable: JAVA_EXECUTABLE,
            socketConnectionOptions: { port: JSON.parse(process.env.GLSP_SERVER_PORT || DEFAULT_SERVER_PORT) },
            additionalArgs: ['--fileLog', 'true', '--logDir', path.join(__dirname, '../server')],
            logging: true,
            serverType: 'java'
        });
        context.subscriptions.push(serverProcess);
        await serverProcess.start();
    }

    // Wrap server with quickstart component
    const umlServer = new UmlVscodeServer({
        clientId: 'glsp.uml',
        clientName: 'uml',
        serverPort: JSON.parse(process.env.GLSP_SERVER_PORT || DEFAULT_SERVER_PORT)
    });

    // Initialize GLSP-VSCode connector with server wrapper
    const glspVscodeConnector = new UmlVscodeConnector({
        server: umlServer,
        logging: false
    });

    const customEditorProvider = vscode.window.registerCustomEditorProvider(
        'uml.glspDiagram',
        new UmlEditorProvider(context, glspVscodeConnector),
        {
            webviewOptions: { retainContextWhenHidden: true },
            supportsMultipleEditorsPerDocument: false
        }
    );

    context.subscriptions.push(umlServer, glspVscodeConnector, customEditorProvider);
    umlServer.start();

    configureDefaultCommands({ extensionContext: context, connector: glspVscodeConnector, diagramPrefix: 'uml' });

    context.subscriptions.push(
        vscode.commands.registerCommand('uml.goToNextNode', () => {
            glspVscodeConnector.sendActionToActiveClient(NavigateAction.create('next'));
        }),
        vscode.commands.registerCommand('uml.goToPreviousNode', () => {
            glspVscodeConnector.sendActionToActiveClient(NavigateAction.create('previous'));
        }),
        vscode.commands.registerCommand('uml.showDocumentation', () => {
            glspVscodeConnector.sendActionToActiveClient(NavigateAction.create('documentation'));
        })
    );
}
