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
    configureDefaultModelElements,
    configureLayout,
    configureModelElement,
    configureViewerOptions,
    createDiagramContainer,
    EditLabelUI,
    GLSPActionDispatcher,
    GLSPGraph,
    GridSnapper,
    LogLevel,
    overrideViewerOptions,
    toolFeedbackModule,
    toolsModule,
    TYPES
} from '@eclipse-glsp/client';
import toolPaletteModule from '@eclipse-glsp/client/lib/features/tool-palette/di.config';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import { Container, ContainerModule } from 'inversify';
import { UMLActionDispatcher } from './base/action-dispatcher';
import { FixedLogger } from './common/fixed-logger';
import { UML_TYPES } from './di.types';
import { UmlLifelineAnchor } from './features/change-bounds/uml-custom-lifeline-anchor';
import { UmlMovementRestrictor } from './features/change-bounds/uml-movement-restrictor';
import { UmlSelectionService } from './features/change-bounds/uml-selection-service';
import { CustomCopyPasteHandler, LastContainableElementTracker } from './features/copy-paste/copy-paste';
import { EditLabelUIAutocomplete } from './features/edit-label';
import { initializationModule, IOnceModelInitialized } from './features/initialization/di.config';
import { umlOutlineModule } from './features/outline/di.config';
import propertyPaletteModule from './features/property-palette/di.config';
import { UmlPolylineEdgeRouter } from './features/routing/uml-polyline-routing';
import { themeModule } from './features/theme/di.config';
import { umlToolFeedbackModule } from './features/tool-feedback/di.config';
import umlToolPaletteModule from './features/tool-palette/di.config';
import { umlToolsModule } from './features/tools/di.config';
import { UmlFreeFormLayouter } from './graph/layout/uml-freeform.layout';
import { SVGIdCreatorService } from './graph/svg-id-creator.service';
import { UmlGraphProjectionView } from './graph/uml-graph-projection.view';
import { umlDiagramModules } from './uml/index';

export default function createContainer(widgetId: string): Container {
    const coreDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
        const context = { bind, unbind, isBound, rebind };

        rebind(TYPES.ILogger).to(FixedLogger).inSingletonScope();
        rebind(TYPES.LogLevel).toConstantValue(LogLevel.info);
        rebind(GLSPActionDispatcher).to(UMLActionDispatcher).inSingletonScope();

        bind(TYPES.ISnapper).to(GridSnapper);
        rebind(TYPES.ICopyPasteHandler).to(CustomCopyPasteHandler);

        rebind(TYPES.IEdgeRouter).to(UmlPolylineEdgeRouter);

        rebind(EditLabelUI).to(EditLabelUIAutocomplete);

        bind(LastContainableElementTracker).toSelf().inSingletonScope();
        bind(TYPES.MouseListener).toService(LastContainableElementTracker);
        // bind(TYPES.IVNodePostprocessor).to(IconLabelCompartmentSelectionFeedback);
        bind(SVGIdCreatorService).toSelf().inSingletonScope();

        configureLayout({ bind, isBound }, UmlFreeFormLayouter.KIND, UmlFreeFormLayouter);
        bind(TYPES.IMovementRestrictor).to(UmlMovementRestrictor).inSingletonScope();

        bind(UmlSelectionService).toSelf().inSingletonScope();
        rebind(TYPES.SelectionService).toService(UmlSelectionService);

        bind(TYPES.IAnchorComputer).to(UmlLifelineAnchor);

        configureDefaultModelElements(context);

        configureModelElement(context, DefaultTypes.GRAPH, GLSPGraph, UmlGraphProjectionView);

        configureViewerOptions(context, {
            needsClientLayout: true,
            baseDiv: widgetId
        });
    });

    const container = createDiagramContainer(
        { exclude: toolPaletteModule },
        { exclude: toolFeedbackModule },
        { exclude: toolsModule },
        coreDiagramModule,
        initializationModule,
        themeModule,
        umlToolPaletteModule,
        umlToolFeedbackModule,
        umlToolsModule,
        umlOutlineModule,
        propertyPaletteModule,
        ...umlDiagramModules
    );

    overrideViewerOptions(container, {
        baseDiv: widgetId,
        hiddenDiv: widgetId + '_hidden'
    });
    onceModelInitialized(container);

    return container;
}

function onceModelInitialized(container: Container): void {
    const actionDispatcher = container.get<GLSPActionDispatcher>(TYPES.IActionDispatcher);

    actionDispatcher.onceModelInitialized().then(() => {
        container.getAll<IOnceModelInitialized>(UML_TYPES.IOnceModelInitialized).forEach(t => t.onceModelInitialized());
    });
}
