/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import 'balloon-css/balloon.min.css';

import 'sprotty/css/sprotty.css';

import 'sprotty/css/edit-label.css';

import '@eclipse-glsp/client/css/glsp-sprotty.css';

import '../../css/style.css';

import {
    glspFocusTrackerModule,
    glspToastModule,
    initializeDiagramContainer,
    LogLevel,
    moveZoomModule,
    toolPaletteModule,
    TYPES,
    viewKeyToolsModule
} from '@eclipse-glsp/client';
import { keyboardToolPaletteModule } from '@eclipse-glsp/client/lib/features/accessibility/keyboard-tool-palette/keyboard-tool-palette-module.js';
import { bindOrRebind, type ContainerConfiguration } from '@eclipse-glsp/protocol';
import { Container } from 'inversify';
import { umlBaseModule } from './base/uml-base.module.js';
import {
    umlElementNavigationModule,
    umlFallbackActionModule,
    umlKeyboardControlToolsModule,
    umlResizeElementModule,
    umlSearchPaletteModule
} from './features/accessibility/uml-accessibility.module.js';
import { umlBoundsModule } from './features/bounds/uml-bounds.module.js';
import { umlCopyPasteModule } from './features/copy-paste/uml-copy-paste.module.js';
import { umlEditModule } from './features/edit/uml-edit.module.js';
import { umlTypeHintsModule } from './features/hints/uml-type-hints.module.js';
import { umlLoadingModule } from './features/loading/uml-loading.module.js';
import { umlThemeModule } from './features/theme/uml-theme.module.js';
import { umlToolPaletteModule } from './features/tool-palette/uml-tool-palette.module.js';
import { umlEdgeEditToolModule } from './features/tools/edge-edit/uml-edge-edit-module.js';
import { umlToolManagerModule } from './features/tools/tool-manager/uml-tool-manager.module.js';
import { umlDiagramModules } from './uml/index.js';
import { umlBaseViewsModule } from './views/uml-base-views.module.js';

export function createUMLDiagramContainer(...containerConfiguration: ContainerConfiguration): Container {
    const container = initializeUMLDiagramContainer(new Container(), ...containerConfiguration);
    bindOrRebind(container, TYPES.LogLevel).toConstantValue(LogLevel.log);
    return container;
}

export function initializeUMLDiagramContainer(container: Container, ...containerConfiguration: ContainerConfiguration): Container {
    const accessibility: ContainerConfiguration = [
        glspToastModule,
        glspFocusTrackerModule,
        moveZoomModule,
        viewKeyToolsModule,
        keyboardToolPaletteModule,
        umlResizeElementModule,
        umlSearchPaletteModule,
        umlKeyboardControlToolsModule,
        umlElementNavigationModule
    ];

    return initializeDiagramContainer(
        container,
        // GLSP
        ...accessibility,
        // UML
        umlBaseModule,
        umlBaseViewsModule,
        umlFallbackActionModule,
        umlBoundsModule,
        umlCopyPasteModule,
        umlEditModule,
        umlLoadingModule,
        umlThemeModule,
        umlToolManagerModule,
        umlTypeHintsModule,
        { add: umlToolPaletteModule, remove: toolPaletteModule },
        umlEdgeEditToolModule,
        ...umlDiagramModules,
        ...containerConfiguration
    );
}
