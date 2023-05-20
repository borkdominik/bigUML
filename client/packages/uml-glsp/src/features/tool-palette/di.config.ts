/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { configureActionHandler, EnableDefaultToolsAction, EnableToolPaletteAction, TYPES } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';

import { UmlToolPalette } from './tool-palette.extension';

const umlToolPaletteModule = new ContainerModule((bind, _unbind, isBound) => {
    bind(UmlToolPalette).toSelf().inSingletonScope();
    bind(TYPES.IUIExtension).toService(UmlToolPalette);
    configureActionHandler({ bind, isBound }, EnableToolPaletteAction.KIND, UmlToolPalette);
    configureActionHandler({ bind, isBound }, EnableDefaultToolsAction.KIND, UmlToolPalette);
});

export default umlToolPaletteModule;
