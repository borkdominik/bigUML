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

import { GlspServerLauncher } from '@eclipse-glsp/vscode-integration/lib/quickstart-components/glsp-server-launcher';
import * as path from 'path';
import * as vscode from 'vscode';

const GLSP_SERVER_PATH = '../server/glsp';
const GLSP_SERVER_VERSION = '0.1.0-SNAPSHOT';
const JAVA_EXECUTABLE = path.join(__dirname, GLSP_SERVER_PATH, `com.eclipsesource.uml.glsp-${GLSP_SERVER_VERSION}-glsp.jar`);

export interface GlspServerConfig {
    port: number;
}

export async function launchGLSPServer(context: vscode.ExtensionContext, config: GlspServerConfig): Promise<void> {
    const serverProcess = new GlspServerLauncher({
        executable: JAVA_EXECUTABLE,
        socketConnectionOptions: { port: config.port },
        additionalArgs: ['--fileLog', 'true', '--logDir', path.join(__dirname, GLSP_SERVER_PATH)],
        logging: false,
        serverType: 'java'
    });
    context.subscriptions.push(serverProcess);
    await serverProcess.start();
}
