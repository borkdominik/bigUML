/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { type ContainerModule } from 'inversify';
import { TYPES } from '../../../vscode/vscode-common.types.js';
import { bindLifecycle } from '../container/bindings.js';
import { VscodeFeatureModule } from '../container/container.js';
import { GlspServer } from './glsp-server.js';

export interface GlspServerConfig {
    port: number;
}

export function glspServerModule(config: GlspServerConfig): ContainerModule {
    return new VscodeFeatureModule(context => {
        context.bind(TYPES.GlspServerConfig).toConstantValue(config);

        bindLifecycle(context, TYPES.GlspServer, GlspServer);
    });
}
