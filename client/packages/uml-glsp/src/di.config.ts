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
    configureActionHandler,
    configureDefaultModelElements,
    configureLayout,
    configureModelElement,
    edgeEditToolModule,
    EditLabelUI,
    GCompartmentView,
    GGraph,
    GLSPActionDispatcher,
    initializeDiagramContainer,
    LogLevel,
    toolPaletteModule,
    TYPES
} from '@eclipse-glsp/client';
import { bindOrRebind, ContainerConfiguration, DefaultTypes, SetViewportAction } from '@eclipse-glsp/protocol';
import { Container, ContainerModule } from 'inversify';
import { UMLActionDispatcher } from './base/action-dispatcher';
import { umlFeedbackModule } from './base/feedback/feedback-module';
import { FixedLogger } from './base/fixed-logger';
import { UML_TYPES } from './di.types';
import { GraphGridActionHandler, ShowGridAction, UmlGridSnapper } from './features/bounds/grid-snapper';
import { UmlLayouterExt } from './features/bounds/index';
import { UmlFreeFormLayouter } from './features/bounds/layout/uml-freeform.layout';
import { CustomCopyPasteHandler, LastContainableElementTracker } from './features/copy-paste/copy-paste';
import { EditLabelUIAutocomplete } from './features/edit-label';
import { SVGIdCreatorService, UmlCompartment } from './features/graph/index';
import { UmlGraphProjectionView } from './features/graph/views/uml-graph-projection.view';
import { initializationModule, IOnceModelInitialized } from './features/initialization/di.config';
import { umlOutlineModule } from './features/outline/di.config';
import { CompartmentSelectionFeedback } from './features/processors/feedback.postprocessor';
import propertyPaletteModule from './features/property-palette/di.config';
import { themeModule } from './features/theme/di.config';
import umlToolPaletteModule from './features/tool-palette/di.config';
import { umlEdgeEditToolModule } from './features/tools/edge-edit/uml-edge-edit-module';
import { umlToolManagerModule } from './features/tools/tool-manager/tool-manager-module';
import { umlDiagramModules } from './uml/index';

export const coreDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    // Default
    bindOrRebind(context, TYPES.ILogger).to(FixedLogger).inSingletonScope();
    bindOrRebind(context, TYPES.LogLevel).toConstantValue(LogLevel.info);
    rebind(GLSPActionDispatcher).to(UMLActionDispatcher).inSingletonScope();

    // Grid
    bind(TYPES.ISnapper).to(UmlGridSnapper);
    bind(GraphGridActionHandler).toSelf().inSingletonScope();
    bind(UML_TYPES.IOnceModelInitialized).toService(GraphGridActionHandler);
    configureActionHandler({ bind, isBound }, ShowGridAction.KIND, GraphGridActionHandler);
    configureActionHandler({ bind, isBound }, SetViewportAction.KIND, GraphGridActionHandler);

    // Features - Copy Paste
    rebind(TYPES.ICopyPasteHandler).to(CustomCopyPasteHandler);
    rebind(EditLabelUI).to(EditLabelUIAutocomplete);

    bind(LastContainableElementTracker).toSelf().inSingletonScope();
    bind(TYPES.MouseListener).toService(LastContainableElementTracker);
    bind(TYPES.IVNodePostprocessor).to(CompartmentSelectionFeedback);
    bind(SVGIdCreatorService).toSelf().inSingletonScope();

    configureLayout({ bind, isBound }, UmlFreeFormLayouter.KIND, UmlFreeFormLayouter);

    rebind(TYPES.Layouter).to(UmlLayouterExt);

    configureDefaultModelElements(context);

    configureModelElement(context, DefaultTypes.GRAPH, GGraph, UmlGraphProjectionView);
    configureModelElement(context, DefaultTypes.COMPARTMENT, UmlCompartment, GCompartmentView);
});

export function createUmlDiagramContainer(...containerConfiguration: ContainerConfiguration): Container {
    const container = initializeUmlDiagramContainer(new Container(), ...containerConfiguration);
    onceModelInitialized(container);
    return container;
}

export function initializeUmlDiagramContainer(container: Container, ...containerConfiguration: ContainerConfiguration): Container {
    return initializeDiagramContainer(
        container,
        coreDiagramModule,
        initializationModule,
        themeModule,
        umlFeedbackModule,
        umlToolManagerModule,
        umlOutlineModule,
        propertyPaletteModule,
        ...umlDiagramModules,
        { add: umlToolPaletteModule, remove: toolPaletteModule },
        { add: umlEdgeEditToolModule, remove: edgeEditToolModule },
        ...containerConfiguration
    );
}

function onceModelInitialized(container: Container): void {
    const actionDispatcher = container.get<GLSPActionDispatcher>(TYPES.IActionDispatcher);

    actionDispatcher.onceModelInitialized().then(() => {
        container.getAll<IOnceModelInitialized>(UML_TYPES.IOnceModelInitialized).forEach(t => t.onceModelInitialized());
    });
}
