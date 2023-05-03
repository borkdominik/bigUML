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
import { ModelServerConfig } from '@borkdominik-biguml/uml-modelserver/lib/config';
import { ContainerModule, inject, injectable } from 'inversify';
import * as path from 'path';
import { TYPES, VSCODE_TYPES } from '../di.types';
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
        bind(VSCODE_TYPES.Disposable).toService(TYPES.ModelServerLauncher);
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
        @inject(VSCODE_TYPES.OutputChannel) outputChannel: OutputChannel
    ) {
        super(options, outputChannel);
    }
}
