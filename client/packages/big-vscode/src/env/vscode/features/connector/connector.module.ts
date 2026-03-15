/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { TYPES } from '../../vscode-common.types.js';
import { bindLifecycle } from '../container/bindings.js';
import { VscodeFeatureModule } from '../container/container.js';
import { ConnectionManager } from './connection-manager.js';
import { BIGGLSPVSCodeConnector } from './glsp-vscode-connector.js';
import { SelectionService } from './selection-service.js';

export const connectorModule = new VscodeFeatureModule(context => {
    bindLifecycle(context, TYPES.GLSPVSCodeConnector, BIGGLSPVSCodeConnector);

    context.bind(TYPES.ConnectionManager).to(ConnectionManager).inSingletonScope();
    context.bind(TYPES.SelectionService).to(SelectionService).inSingletonScope();
});
