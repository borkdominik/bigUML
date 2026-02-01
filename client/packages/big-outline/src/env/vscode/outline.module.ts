/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { TYPES } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { ContainerModule } from 'inversify';
import { OutlineTreeProvider, OutlineViewId } from './outline-tree.provider.js';

export function outlineModule(viewId: string) {
    return new ContainerModule(bind => {
        bind(OutlineViewId).toConstantValue(viewId);
        bind(OutlineTreeProvider).toSelf().inSingletonScope();
        bind(TYPES.Outline).to(OutlineTreeProvider);
        bind(TYPES.Disposable).toService(OutlineTreeProvider);
        bind(TYPES.RootInitialization).toService(OutlineTreeProvider);

        // bind(ExperimentalOutlineActionHandler).toSelf().inSingletonScope();
        // bind(TYPES.Disposable).toService(ExperimentalOutlineActionHandler);
        // bind(TYPES.RootInitialization).toService(ExperimentalOutlineActionHandler);
    });
}
