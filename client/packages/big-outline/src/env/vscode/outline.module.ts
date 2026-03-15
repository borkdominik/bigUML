/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { bindLifecycle, TYPES, VscodeFeatureModule } from '@borkdominik-biguml/big-vscode/vscode';
import { OutlineTreeProvider, OutlineViewId } from './outline.tree-provider.js';

export function outlineModule(viewId: string) {
    return new VscodeFeatureModule(context => {
        context.bind(OutlineViewId).toConstantValue(viewId);
        bindLifecycle(context, TYPES.Outline, OutlineTreeProvider);
    });
}
