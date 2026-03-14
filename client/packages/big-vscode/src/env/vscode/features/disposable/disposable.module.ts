/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { bindLifecycle } from '../container/bindings.js';
import { FeatureModule } from '../container/container.js';
import { DisposableManager } from './disposable.manager.js';

export const disposableModule = new FeatureModule(context => {
    bindLifecycle(context, DisposableManager);
});
