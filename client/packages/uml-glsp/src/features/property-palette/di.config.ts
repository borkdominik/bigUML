/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import '@eclipsesource/uml-glsp/css/extensions/property-palette.css';

import { configureActionHandler, SelectAction, SetDirtyStateAction, TYPES } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';

import { EDITOR_PANEL_TYPES } from '../editor-panel/di.types';
import { PropertyPalette } from './property-palette.extension';

const propertyPaletteModule = new ContainerModule((bind, _unbind, isBound, rebind) => {
    const context = { bind, _unbind, isBound, rebind };

    bind(PropertyPalette).toSelf().inSingletonScope();
    bind(EDITOR_PANEL_TYPES.Child).toService(PropertyPalette);
    bind(TYPES.SModelRootListener).toService(PropertyPalette);

    configureActionHandler(context, SelectAction.KIND, PropertyPalette);
    configureActionHandler(context, SetDirtyStateAction.KIND, PropertyPalette);
});

export default propertyPaletteModule;
