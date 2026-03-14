/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { interfaces } from 'inversify';
import { TYPES } from '../../vscode-common.types.js';
import type { BindingContext } from './container.js';

export function ensureBound<T>(
    context: BindingContext,
    serviceIdentifier: interfaces.ServiceIdentifier<T>,
    newable?: interfaces.Newable<T>
): interfaces.BindingInWhenOnSyntax<T> | undefined {
    if (!context.isBound(serviceIdentifier)) {
        if (newable) {
            return context.bind(serviceIdentifier).to(newable);
        }

        return context.bind(serviceIdentifier).toSelf();
    }

    return undefined;
}

export function bindLifecycle(
    context: BindingContext,
    serviceIdentifier: interfaces.ServiceIdentifier<unknown>,
    newable?: interfaces.Newable<unknown>
) {
    ensureBound(context, serviceIdentifier, newable)?.inSingletonScope();
    context.bind(TYPES.RootInitialization).toService(serviceIdentifier);
}
