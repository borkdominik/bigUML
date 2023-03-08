/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
import { TheiaModelServerClientV2 } from '@eclipse-emfcloud/modelserver-theia';
import { LaunchOptions } from '@eclipse-emfcloud/modelserver-theia/lib/node';
import { GLSPServerContribution } from '@eclipse-glsp/theia-integration/lib/node';
import { ContainerModule, injectable } from 'inversify';
import { join, resolve } from 'path';

import { findEquinoxLauncher } from './equinox';
import { UTBackendModelServerClient } from './ut-modelserver.client';
import { UTServerContribution } from './ut-server.contribution';

@injectable()
export class UTModelServerLaunchOptions implements LaunchOptions {
    baseURL = 'api/v2/';
    serverPort = 8081;
    hostname = 'localhost';
    jarPath = findEquinoxLauncher(join(__dirname, '..', '..', 'build', 'com.eclipsesource.uml.modelserver.product-0.1.0'));
    additionalArgs = [`-r=${resolve(join(__dirname, '..', '..', '..', '..', 'workspace'))}`];
}

export default new ContainerModule((bind, _unbind, isBound, rebind) => {
    /*
    if (isBound(LaunchOptions)) {
        rebind(LaunchOptions).to(UTModelServerLaunchOptions).inSingletonScope();
    } else {
        bind(LaunchOptions).to(UTModelServerLaunchOptions).inSingletonScope();
    }
    */

    bind(UTBackendModelServerClient).toSelf().inSingletonScope();
    rebind(TheiaModelServerClientV2).toService(UTBackendModelServerClient);

    bind(UTServerContribution).toSelf().inSingletonScope();
    bind(GLSPServerContribution).toService(UTServerContribution);
});
