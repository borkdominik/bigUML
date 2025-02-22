/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { ContainerModule } from 'inversify';
import { TYPES } from '../../vscode-common.types.js';
import { BIGGLSPVSCodeConnector } from './glsp-vscode.connector.js';

export const connectorModule = new ContainerModule(bind => {
    bind(BIGGLSPVSCodeConnector).toSelf().inSingletonScope();
    bind(TYPES.GLSPVSCodeConnector).toService(BIGGLSPVSCodeConnector);
    bind(TYPES.Disposable).toService(BIGGLSPVSCodeConnector);
});
