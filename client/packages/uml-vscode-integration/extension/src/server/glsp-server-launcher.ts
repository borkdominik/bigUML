/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
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

import { UmlServerLauncherOptions } from '@borkdominik-biguml/uml-integration';
import { Container, inject, injectable } from 'inversify';
import * as path from 'path';
import { TYPES, VSCODE_TYPES } from '../di.types';
import { OutputChannel } from '../vscode/output/output.channel';
import { UVServerLauncher } from './uv-server-launcher';

const GLSP_SERVER_PATH = '../server';
const GLSP_SERVER_VERSION = '0.1.0-SNAPSHOT';
const GLSP_EXECUTABLE = `com.eclipsesource.uml.cli-${GLSP_SERVER_VERSION}-standalone.jar`;
const JAVA_EXECUTABLE = path.join(__dirname, GLSP_SERVER_PATH, GLSP_EXECUTABLE);

export interface GlspServerConfig {
    port: number;
}

export async function launchGLSPServer(container: Container, config: GlspServerConfig): Promise<void> {
    const launchOptions: UmlServerLauncherOptions = {
        executable: JAVA_EXECUTABLE,
        additionalArgs: ['glspserver', `--port=${config.port}`],
        logging: process.env.UML_GLSP_SERVER_LOGGING === 'true',
        server: {
            port: config.port,
            logPrefix: '[GLSP-Server]',
            startUpMessage: 'Startup completed'
        }
    };

    container.bind(TYPES.GlspServerLaunchOptions).toConstantValue(launchOptions);
    container.bind(TYPES.GlspServerLauncher).to(UmlGLSPServerLauncher).inSingletonScope();
    container.bind(VSCODE_TYPES.Disposable).toService(TYPES.GlspServerLauncher);

    await container.get<UmlGLSPServerLauncher>(TYPES.GlspServerLauncher).start();
}

@injectable()
export class UmlGLSPServerLauncher extends UVServerLauncher {
    constructor(
        @inject(TYPES.GlspServerLaunchOptions) options: UmlServerLauncherOptions,
        @inject(VSCODE_TYPES.OutputChannel) outputChannel: OutputChannel
    ) {
        super(options, outputChannel);
    }
}
