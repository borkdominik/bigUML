/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { SocketGlspVscodeServer } from '@eclipse-glsp/vscode-integration/lib/node/quickstart-components/socket-glsp-vscode-server.js';
import { ContainerModule, inject, injectable } from 'inversify';
import * as path from 'path';
import { TYPES } from '../di.types.js';
import { type OutputChannel } from '../vscode/output/output.channel.js';
import { type ServerLauncherOptions } from './launcher.js';
import { osUtils } from './os.js';
import { UMLServerLauncher } from './server-launcher.js';

const GLSP_SERVER_PATH = '../server';
const GLSP_SERVER_VERSION = '0.1.0';
const GLSP_EXECUTABLE = `bigUML-${GLSP_SERVER_VERSION}-all.jar`;
const JAVA_EXECUTABLE = path.join(__dirname, GLSP_SERVER_PATH, GLSP_EXECUTABLE);

export interface GlspServerConfig {
    port: number;
}

export function glspServerModule(config: GlspServerConfig): ContainerModule {
    return new ContainerModule(bind => {
        const launchOptions: ServerLauncherOptions = {
            executable: JAVA_EXECUTABLE,
            additionalArgs: [`--port=${config.port}`],
            logging: process.env.UML_GLSP_SERVER_LOGGING === 'true',
            server: {
                name: 'GLSPServer',
                port: config.port,
                logPrefix: '[GLSP-Server]',
                startUpMessage: 'Startup completed'
            }
        };

        bind(TYPES.GlspServerLaunchOptions).toConstantValue(launchOptions);
        bind(TYPES.GlspServerConfig).toConstantValue(config);

        bind(UMLGLSPServerLauncher).toSelf().inSingletonScope();
        bind(TYPES.GlspServerLauncher).toService(UMLGLSPServerLauncher);
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
export class UMLGLSPServerLauncher extends UMLServerLauncher {
    get isEnabled(): boolean {
        return process.env.UML_GLSP_SERVER_DEBUG !== 'true';
    }

    constructor(
        @inject(TYPES.GlspServerLaunchOptions) options: ServerLauncherOptions,
        @inject(TYPES.OutputChannel) outputChannel: OutputChannel
    ) {
        super(options, outputChannel);
    }

    override async ping(): Promise<void> {
        const server = new SocketGlspVscodeServer({
            clientId: 'ping_1',
            clientName: 'ping',
            connectionOptions: {
                port: this.options.server.port
            }
        });
        await server.start();
        await server.dispose();
    }
}
