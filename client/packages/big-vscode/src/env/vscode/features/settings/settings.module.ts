/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { TYPES } from '../../vscode-common.types.js';
import { bindLifecycle } from '../container/bindings.js';
import { FeatureModule } from '../container/container.js';
import { Settings } from './settings.js';

export const settingsModule = new FeatureModule(context => {
    bindLifecycle(context, TYPES.Settings, Settings);
});
