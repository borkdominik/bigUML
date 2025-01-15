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

import '../css/style.css';

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
import {
    keyboardToolPaletteModule
} from '@eclipse-glsp/client/lib/features/accessibility/keyboard-tool-palette/keyboard-tool-palette-module';
import { bindOrRebind, ContainerConfiguration } from '@eclipse-glsp/protocol';
import { Container } from 'inversify';
import { umlBaseModule } from './base/uml-base.module';
import {
    umlElementNavigationModule,
    umlFallbackActionModule,
    umlKeyboardControlToolsModule,
    umlResizeElementModule,
    umlSearchPaletteModule
} from './features/accessibility/uml-accessibility.module';
import { umlBoundsModule } from './features/bounds/uml-bounds.module';
import { umlCopyPasteModule } from './features/copy-paste/uml-copy-paste.module';
import { umlEditModule } from './features/edit/uml-edit.module';
import { umlTypeHintsModule } from './features/hints/uml-type-hints.module';
import { umlLoadingModule } from './features/loading/uml-loading.module'; 
// import { umlMinimapModule } from './features/minimap/uml-minimap.module'; todo enable minimap when delete bug is fixed
import { umlOutlineModule } from './features/outline/uml-outline.module';
import { umlPropertyPaletteModule } from './features/property-palette/uml-property-palette.module';
import { umlTextInputPaletteModule } from './features/text-input/uml-text-input-palette.module';
import { umlThemeModule } from './features/theme/uml-theme.module';
import { umlToolPaletteModule } from './features/tool-palette/uml-tool-palette.module';
import { umlEdgeEditToolModule } from './features/tools/edge-edit/uml-edge-edit-module';
import { umlToolManagerModule } from './features/tools/tool-manager/uml-tool-manager.module';
import { umlDiagramModules } from './uml/index';
import { umlBaseViewsModule } from './views/uml-base-views.module';

export function createUMLDiagramContainer(...containerConfiguration: ContainerConfiguration): Container {
    const container = initializeUMLDiagramContainer(new Container(), ...containerConfiguration);
    bindOrRebind(container, TYPES.LogLevel).toConstantValue(LogLevel.info);
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
        umlOutlineModule,
//        umlMinimapModule, todo enable when delete bug is fixed
        umlPropertyPaletteModule,
        umlTextInputPaletteModule,
        umlTypeHintsModule,
        { add: umlToolPaletteModule, remove: toolPaletteModule },
        umlEdgeEditToolModule,
        ...umlDiagramModules,
        ...containerConfiguration
    );
}
