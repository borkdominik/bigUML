/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { ContainerModule, type interfaces } from 'inversify';

export interface BindingContext {
    bind: interfaces.Bind;
    unbind: interfaces.Unbind;
    isBound: interfaces.IsBound;
    rebind: interfaces.Rebind;
}

export class VscodeFeatureModule extends ContainerModule {
    constructor(load: (context: BindingContext) => void) {
        super((bind, unbind, isBound, rebind) => {
            load({ bind, unbind, isBound, rebind });
        });
    }
}
