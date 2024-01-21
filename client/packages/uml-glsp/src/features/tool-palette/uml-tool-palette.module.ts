/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { bindAsService, configureActionHandler, EnableDefaultToolsAction, FeatureModule, TYPES } from '@eclipse-glsp/client';

import { UmlToolPalette } from './uml-tool-palette.extension';

export const umlToolPaletteModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    bindAsService(context, TYPES.IUIExtension, UmlToolPalette);
    bind(TYPES.IDiagramStartup).toService(UmlToolPalette);
    configureActionHandler(context, EnableDefaultToolsAction.KIND, UmlToolPalette);
});
