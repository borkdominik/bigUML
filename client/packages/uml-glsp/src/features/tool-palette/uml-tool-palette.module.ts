/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { bindOrRebind, FeatureModule, ToolPalette, toolPaletteModule } from '@eclipse-glsp/client';
import { UmlToolPalette } from './uml-tool-palette.extension';

export const umlToolPaletteModule = new FeatureModule(
    (bind, unbind, isBound, rebind) => {
        const context = { bind, unbind, isBound, rebind };
        bindOrRebind(context, ToolPalette).to(UmlToolPalette).inSingletonScope();
    },
    {
        requires: toolPaletteModule
    }
);
