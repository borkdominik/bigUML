/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { TYPES } from '../../vscode-common.types.js';
import { VscodeFeatureModule } from '../container/container.js';
import { DisposableManager } from './disposable.manager.js';

export const disposableModule = new VscodeFeatureModule(context => {
    context.bind(TYPES.OnActivate).to(DisposableManager).inSingletonScope();
});
