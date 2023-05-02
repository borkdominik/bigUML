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
import { ModelServerConfig } from '@borkdominik-biguml/uml-modelserver/lib/config';
import { Container, inject, injectable } from 'inversify';
import * as path from 'path';
import { TYPES, VSCODE_TYPES } from '../di.types';
import { OutputChannel } from '../vscode/output/output.channel';
import { UVServerLauncher } from './uv-server-launcher';

const MODEL_SERVER_PATH = '../server';
const MODEL_SERVER_VERSION = '0.1.0-SNAPSHOT';
const MODEL_EXECUTABLE = `com.eclipsesource.uml.cli-${MODEL_SERVER_VERSION}-standalone.jar`;
const JAVA_EXECUTABLE = path.join(__dirname, MODEL_SERVER_PATH, MODEL_EXECUTABLE);

export async function launchModelServer(container: Container, config: ModelServerConfig): Promise<void> {
    const launchOptions: UmlServerLauncherOptions = {
        executable: JAVA_EXECUTABLE,
        additionalArgs: ['modelserver', `--port=${config.port}`],
        logging: process.env.UML_MODEL_SERVER_LOGGING === 'true',
        server: {
            port: config.port,
            logPrefix: '[Model-Server]',
            startUpMessage: 'Javalin started in'
        }
    };

    container.bind(TYPES.ModelServerLaunchOptions).toConstantValue(launchOptions);
    container.bind(TYPES.ModelServerLauncher).to(ModelServerLauncher).inSingletonScope();
    container.bind(VSCODE_TYPES.Disposable).toService(TYPES.ModelServerLauncher);

    await container.get<ModelServerLauncher>(TYPES.ModelServerLauncher).start();
}

@injectable()
export class ModelServerLauncher extends UVServerLauncher {
    constructor(
        @inject(TYPES.ModelServerLaunchOptions) options: UmlServerLauncherOptions,
        @inject(VSCODE_TYPES.OutputChannel) outputChannel: OutputChannel
    ) {
        super(options, outputChannel);
    }
}
