/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { ContainerModule } from 'inversify';
import * as path from 'path';
import { TYPES } from '../../../vscode/vscode-common.types.js';
import { GLSPServer } from './glsp-server.js';
import { GLSPServerLauncher } from './glsp-server.launcher.js';
import type { ServerLauncherOptions } from './launcher/launcher.js';
import { osUtils } from './launcher/os.js';

const GLSP_SERVER_PATH = '../server';
const GLSP_SERVER_VERSION = '0.1.0';
const GLSP_EXECUTABLE = `bigUML-${GLSP_SERVER_VERSION}-all.jar`;
const JAVA_EXECUTABLE = path.join(__dirname, GLSP_SERVER_PATH, GLSP_EXECUTABLE);

export interface GLSPServerConfig {
    port: number;
}

export function glspServerModule(config: GLSPServerConfig): ContainerModule {
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

        bind(TYPES.GLSPServerLaunchOptions).toConstantValue(launchOptions);
        bind(TYPES.GLSPServerConfig).toConstantValue(config);

        bind(GLSPServerLauncher).toSelf().inSingletonScope();
        bind(TYPES.GLSPServerLauncher).toService(GLSPServerLauncher);
        bind(TYPES.ServerLauncher).toService(TYPES.GLSPServerLauncher);
        bind(TYPES.Disposable).toService(TYPES.GLSPServerLauncher);

        bind(GLSPServer).toSelf().inSingletonScope();
        bind(TYPES.GLSPServer).toService(GLSPServer);
        bind(TYPES.Disposable).toService(TYPES.GLSPServer);
    });
}

export async function createGLSPServerConfig(): Promise<GLSPServerConfig> {
    return <GLSPServerConfig>{
        port: +(process.env.UML_GLSP_SERVER_PORT ?? (await osUtils.freePort()))
    };
}
