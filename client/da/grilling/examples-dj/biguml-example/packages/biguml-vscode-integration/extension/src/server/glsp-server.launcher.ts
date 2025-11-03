/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { SocketGlspVscodeServer } from '@eclipse-glsp/vscode-integration/lib/node/quickstart-components/socket-glsp-vscode-server';
import { ContainerModule, inject, injectable } from 'inversify';
import { TYPES } from '../di.types';
import { OutputChannel } from '../vscode/output/output.channel';
import { UmlServerLauncherOptions } from './launcher';
import { UVServerLauncher } from './server-launcher';

export interface GlspServerConfig {
    port: number;
    host: string;
}

export function glspServerModule(config: GlspServerConfig): ContainerModule {
    return new ContainerModule(bind => {
        const launchOptions: UmlServerLauncherOptions = {
            logging: true,
            server: {
                name: 'GLSPServer',
                port: config.port,
                host: config.host,
                logPrefix: '[GLSP-Server]',
                startUpMessage: 'GLSP Server Startup completed'
            }
        };

        bind(TYPES.GlspServerLaunchOptions).toConstantValue(launchOptions);

        bind(UmlGLSPServerLauncher).toSelf().inSingletonScope();
        bind(TYPES.GlspServerLauncher).toService(UmlGLSPServerLauncher);
        bind(TYPES.ServerLauncher).toService(TYPES.GlspServerLauncher);
        bind(TYPES.Disposable).toService(TYPES.GlspServerLauncher);
    });
}

export function createGLSPServerConfig(): GlspServerConfig {
    return <GlspServerConfig>{
        host: '127.0.0.1',
        port: +(process.env.UML_GLSP_SERVER_PORT ?? 5007)
    };
}

@injectable()
export class UmlGLSPServerLauncher extends UVServerLauncher {
    get isEnabled(): boolean {
        return true;
    }

    constructor(
        @inject(TYPES.GlspServerLaunchOptions) options: UmlServerLauncherOptions,
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
