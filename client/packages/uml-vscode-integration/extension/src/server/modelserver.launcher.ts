/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { osUtils, UmlServerLauncherOptions } from '@borkdominik-biguml/uml-integration';
import { ModelServerConfig } from '@borkdominik-biguml/uml-modelserver/lib/config';
import { ContainerModule, inject, injectable } from 'inversify';
import * as path from 'path';
import { TYPES } from '../di.types';
import { OutputChannel } from '../vscode/output/output.channel';
import { UVServerLauncher } from './launcher';

const MODEL_SERVER_PATH = '../server';
const MODEL_SERVER_VERSION = '0.1.0-SNAPSHOT';
const MODEL_EXECUTABLE = `com.eclipsesource.uml.cli-${MODEL_SERVER_VERSION}-standalone.jar`;
const JAVA_EXECUTABLE = path.join(__dirname, MODEL_SERVER_PATH, MODEL_EXECUTABLE);

export function modelServerModule(config: ModelServerConfig): ContainerModule {
    return new ContainerModule(bind => {
        const launchOptions: UmlServerLauncherOptions = {
            executable: JAVA_EXECUTABLE,
            additionalArgs: ['modelserver', `--port=${config.port}`],
            logging: process.env.UML_MODEL_SERVER_LOGGING === 'true',
            server: {
                name: 'ModelServer',
                port: config.port,
                logPrefix: '[Model-Server]',
                startUpMessage: 'Javalin started in'
            }
        };

        bind(TYPES.ModelServerLaunchOptions).toConstantValue(launchOptions);

        bind(UmlModelServerLauncher).toSelf().inSingletonScope();
        bind(TYPES.ModelServerLauncher).toService(UmlModelServerLauncher);
        bind(TYPES.ServerLauncher).toService(TYPES.ModelServerLauncher);
        bind(TYPES.Disposable).toService(TYPES.ModelServerLauncher);
    });
}

export async function createModelServerConfig(): Promise<ModelServerConfig> {
    const modelServerRoute = '/api/v2/';
    const modelServerPort = +(process.env.UML_MODEL_SERVER_PORT ?? (await osUtils.freePort()));
    return <ModelServerConfig>{
        port: modelServerPort,
        route: modelServerRoute,
        url: `http://localhost:${modelServerPort}${modelServerRoute}`
    };
}

@injectable()
export class UmlModelServerLauncher extends UVServerLauncher {
    get isEnabled(): boolean {
        return process.env.UML_MODEL_SERVER_DEBUG !== 'true';
    }

    constructor(
        @inject(TYPES.ModelServerLaunchOptions) options: UmlServerLauncherOptions,
        @inject(TYPES.OutputChannel) outputChannel: OutputChannel
    ) {
        super(options, outputChannel);
    }
}
