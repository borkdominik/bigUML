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

import { ModelServerConfig } from '@borkdominik-biguml/uml-modelserver/lib/config';
import * as path from 'path';
import * as vscode from 'vscode';
import { ModelServerLauncher } from './modelserver-launcher';

const MODEL_SERVER_PATH = '../server/modelserver';
const MODEL_SERVER_VERSION = '0.1.0-SNAPSHOT';
const JAVA_EXECUTABLE = path.join(__dirname, MODEL_SERVER_PATH, `com.eclipsesource.uml.modelserver-${MODEL_SERVER_VERSION}-standalone.jar`);

export async function launchModelServer(context: vscode.ExtensionContext, config: ModelServerConfig): Promise<void> {
    const serverProcess = new ModelServerLauncher({
        executable: JAVA_EXECUTABLE,
        socketConnectionOptions: { port: config.port },
        additionalArgs: [],
        logging: false,
        serverType: 'java'
    });
    context.subscriptions.push(serverProcess);
    await serverProcess.start();
}
