/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { configureActionHandler, FeatureModule, SelectAction, TYPES } from '@eclipse-glsp/client';
import { TextInputPaletteHandler } from './text-input-palette.handler';

export const umlTextInputPaletteModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    bind(TextInputPaletteHandler).toSelf().inSingletonScope();
    bind(TYPES.IGModelRootListener).toService(TextInputPaletteHandler);
    configureActionHandler(context, SelectAction.KIND, TextInputPaletteHandler);
});
