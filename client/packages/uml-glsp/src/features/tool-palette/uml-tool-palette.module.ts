/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { bindOrRebind, FeatureModule } from '@eclipse-glsp/client';
import { KeyboardToolPalette } from '@eclipse-glsp/client/lib/features/accessibility/keyboard-tool-palette/keyboard-tool-palette';
import { keyboardToolPaletteModule } from '@eclipse-glsp/client/lib/features/accessibility/keyboard-tool-palette/keyboard-tool-palette-module';
import { UMLToolPalette } from './uml-tool-palette.extension';

export const umlToolPaletteModule = new FeatureModule(
    (bind, unbind, isBound, rebind) => {
        const context = { bind, unbind, isBound, rebind };
        bindOrRebind(context, KeyboardToolPalette).to(UMLToolPalette).inSingletonScope();
    },
    {
        requires: keyboardToolPaletteModule
    }
);
