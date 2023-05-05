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

import { osUtils, UmlServerLauncherOptions } from '@borkdominik-biguml/uml-integration';
import { SocketGlspVscodeServer } from '@eclipse-glsp/vscode-integration/lib/quickstart-components/socket-glsp-vscode-server';
import { ContainerModule, inject, injectable } from 'inversify';
import * as path from 'path';
import { TYPES } from '../di.types';
import { OutputChannel } from '../vscode/output/output.channel';
import { UVServerLauncher } from './launcher';

const GLSP_SERVER_PATH = '../server';
const GLSP_SERVER_VERSION = '0.1.0-SNAPSHOT';
const GLSP_EXECUTABLE = `com.eclipsesource.uml.cli-${GLSP_SERVER_VERSION}-standalone.jar`;
const JAVA_EXECUTABLE = path.join(__dirname, GLSP_SERVER_PATH, GLSP_EXECUTABLE);

export interface GlspServerConfig {
    port: number;
}

export function glspServerModule(config: GlspServerConfig): ContainerModule {
    return new ContainerModule(bind => {
        const launchOptions: UmlServerLauncherOptions = {
            executable: JAVA_EXECUTABLE,
            additionalArgs: ['glspserver', `--port=${config.port}`],
            logging: true || process.env.UML_GLSP_SERVER_LOGGING === 'true',
            server: {
                name: 'GLSPServer',
                port: config.port,
                logPrefix: '[GLSP-Server]',
                startUpMessage: 'Startup completed'
            }
        };

        bind(TYPES.GlspServerLaunchOptions).toConstantValue(launchOptions);

        bind(UmlGLSPServerLauncher).toSelf().inSingletonScope();
        bind(TYPES.GlspServerLauncher).toService(UmlGLSPServerLauncher);
        bind(TYPES.ServerLauncher).toService(TYPES.GlspServerLauncher);
        bind(TYPES.Disposable).toService(TYPES.GlspServerLauncher);
    });
}

export async function createGLSPServerConfig(): Promise<GlspServerConfig> {
    return <GlspServerConfig>{
        port: +(process.env.UML_GLSP_SERVER_PORT ?? (await osUtils.freePort()))
    };
}

@injectable()
export class UmlGLSPServerLauncher extends UVServerLauncher {
    get isEnabled(): boolean {
        return process.env.UML_GLSP_SERVER_DEBUG !== 'true';
    }

    constructor(
        @inject(TYPES.GlspServerLaunchOptions) options: UmlServerLauncherOptions,
        @inject(TYPES.OutputChannel) outputChannel: OutputChannel
    ) {
        super(options, outputChannel);
    }

    override async ping(): Promise<void> {
        const server = new SocketGlspVscodeServer({ clientId: 'ping_1', clientName: 'ping', serverPort: this.options.server.port });
        await server.start();
        await server.stop();
    }
}
