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
import * as config from '../../server-config.json';

export const DEFAULT_SERVER_PORT = '5007';
const { version, isSnapShot } = config;
const JAVA_EXECUTABLE = path.join(__dirname, `../server/org.eclipse.glsp.example.uml-${version}${isSnapShot ? '-SNAPSHOT' : ''}-glsp.jar`);

export async function launchServer(context: vscode.ExtensionContext): Promise<void> {
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
