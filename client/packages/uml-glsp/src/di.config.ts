/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
import '@eclipse-glsp/client/css/glsp-sprotty.css';
import 'balloon-css/balloon.min.css';
import 'sprotty/css/edit-label.css';

import '../css/style.css';

import '../css/extensions/edit-label.css';

import {
    configureDefaultModelElements,
    configureModelElement,
    configureViewerOptions,
    ConsoleLogger,
    createDiagramContainer,
    EditLabelUI,
    GLSPGraph,
    LogLevel,
    overrideViewerOptions,
    saveModule,
    SCompartment,
    SCompartmentView,
    SLabel,
    SLabelView,
    SRoutingHandle,
    SRoutingHandleView,
    StructureCompartmentView,
    TYPES
} from '@eclipse-glsp/client';
import toolPaletteModule from '@eclipse-glsp/client/lib/features/tool-palette/di.config';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import { Container, ContainerModule } from 'inversify';

import { CustomCopyPasteHandler, LastContainableElementTracker } from './features/copy-paste/copy-paste';
import { EditLabelUIAutocomplete } from './features/edit-label';
import umlEditorPanelModule from './features/editor-panel/di.config';
import umlDiagramOutlineModule from './features/outline/di.config';
import umlPropertyPaletteModule from './features/property-palette/di.config';
import umlToolPaletteModule from './features/tool-palette/di.config';
import { UmlGraphView } from './graph/graph.view';
import { IconCSS, IconCSSView, SEditableLabel } from './graph/index';
import { umlClassDiagramModule } from './uml/diagram/class/di.config';
import { umlCommunicationDiagramModule } from './uml/diagram/communication/di.config';
import { BaseTypes, UmlTypes } from './utils';
import { IconLabelCompartmentSelectionFeedback } from './views/feedback.postprocessor';

export default function createContainer(widgetId: string): Container {
    const coreDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
        rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
        rebind(TYPES.LogLevel).toConstantValue(LogLevel.info);
        rebind(EditLabelUI).to(EditLabelUIAutocomplete);
        rebind(TYPES.ICopyPasteHandler).to(CustomCopyPasteHandler);

        bind(LastContainableElementTracker).toSelf().inSingletonScope();
        bind(TYPES.MouseListener).toService(LastContainableElementTracker);
        bind(TYPES.IVNodePostprocessor).to(IconLabelCompartmentSelectionFeedback);

        const context = { bind, unbind, isBound, rebind };
        configureDefaultModelElements(context);

        configureModelElement(context, DefaultTypes.GRAPH, GLSPGraph, UmlGraphView);

        configureModelElement(context, UmlTypes.LABEL_NAME, SEditableLabel, SLabelView);
        configureModelElement(context, UmlTypes.LABEL_EDGE_NAME, SEditableLabel, SLabelView);
        configureModelElement(context, UmlTypes.LABEL_TEXT, SLabel, SLabelView);

        configureModelElement(context, BaseTypes.COMPARTMENT, SCompartment, SCompartmentView);
        configureModelElement(context, BaseTypes.COMPARTMENT_HEADER, SCompartment, SCompartmentView);
        configureModelElement(context, BaseTypes.ROUTING_POINT, SRoutingHandle, SRoutingHandleView);
        configureModelElement(context, BaseTypes.VOLATILE_ROUTING_POINT, SRoutingHandle, SRoutingHandleView);
        configureModelElement(context, UmlTypes.STRUCTURE, SCompartment, StructureCompartmentView);

        configureModelElement(context, UmlTypes.ICON_CSS, IconCSS, IconCSSView);

        configureViewerOptions(context, {
            needsClientLayout: true,
            baseDiv: widgetId
        });
    });

    const container = createDiagramContainer(
        saveModule,
        coreDiagramModule,
        umlClassDiagramModule,
        umlCommunicationDiagramModule,
        umlEditorPanelModule,
        umlToolPaletteModule,
        umlDiagramOutlineModule,
        umlPropertyPaletteModule
    );

    container.unload(toolPaletteModule);

    overrideViewerOptions(container, {
        baseDiv: widgetId,
        hiddenDiv: widgetId + '_hidden'
    });
    return container;
}
