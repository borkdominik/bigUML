/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { TheiaModelServerClientV2 } from '@eclipse-emfcloud/modelserver-theia';
import { LaunchOptions } from '@eclipse-emfcloud/modelserver-theia/lib/node';
import { ContainerContext } from '@eclipse-glsp/theia-integration';
import { getPort, GLSPServerContribution } from '@eclipse-glsp/theia-integration/lib/node';
import { ContainerModule, injectable } from 'inversify';

import { UTBackendModelServerClient } from './ut-modelserver.client';
import { UTServerContribution } from './ut-server.contribution';

const PORT_ARG_KEY = 'UML_MODELSERVER_PORT';

@injectable()
export class UTModelServerLaunchOptions implements LaunchOptions {
    baseURL = 'api/v2/';
    serverPort = getPort(PORT_ARG_KEY);
    hostname = 'localhost';
}

export default new ContainerModule((bind, unbind, isBound, rebind) => {
    const context: ContainerContext = { bind, unbind, isBound, rebind };

    if (context.isBound(LaunchOptions)) {
        context.rebind(LaunchOptions).to(UTModelServerLaunchOptions).inSingletonScope();
    } else {
        context.bind(LaunchOptions).to(UTModelServerLaunchOptions).inSingletonScope();
    }

    context.bind(UTBackendModelServerClient).toSelf().inSingletonScope();
    context.rebind(TheiaModelServerClientV2).toService(UTBackendModelServerClient);

    context.bind(UTServerContribution).toSelf().inSingletonScope();
    context.bind(GLSPServerContribution).toService(UTServerContribution);
});
