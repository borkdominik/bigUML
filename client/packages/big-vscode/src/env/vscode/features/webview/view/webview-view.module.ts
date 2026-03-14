/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { ContainerModule } from 'inversify';
import { TYPES } from '../../../vscode-common.types.js';
import { WebviewViewManager } from './webview-view.manager.js';

export const webviewViewModule = new ContainerModule(bind => {
    bind(TYPES.WebviewViewManager).to(WebviewViewManager).inSingletonScope();
    bind(TYPES.RootInitialization).toService(TYPES.WebviewViewManager);
});
