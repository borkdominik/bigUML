/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
import "@eclipse-glsp/client/css/glsp-sprotty.css";
import "sprotty/css/edit-label.css";

import {
    configureDefaultModelElements,
    configureModelElement,
    configureViewerOptions,
    ConsoleLogger,
    copyPasteContextMenuModule,
    createClientContainer,
    LogLevel,
    overrideViewerOptions,
    PolylineEdgeView,
    saveModule,
    SCompartment,
    SCompartmentView,
    SEdge,
    SLabel,
    SLabelView,
    SRoutingHandle,
    SRoutingHandleView,
    StructureCompartmentView,
    TYPES,
    validationModule
} from "@eclipse-glsp/client/lib";
import toolPaletteModule from "@eclipse-glsp/client/lib/features/tool-palette/di.config";
import { Container, ContainerModule } from "inversify";
import { EditLabelUI } from "sprotty/lib";

import { EditLabelUIAutocomplete } from "../../features/edit-label";
import umlToolPaletteModule from "../../features/tool-palette/di.config";
import { IconLabelCompartmentSelectionFeedback } from "../../feedback";
import { ConnectableEdge, IconLabelCompartment, LabeledNode, SEditableLabel } from "../../model";
import { BaseTypes, UmlTypes } from "../../utils";
import { IconView } from "../../views/commons";
import { DirectedEdgeView } from "../usecase/views";
import { IconClass, IconProperty } from "./model";
import { ClassNodeView, EnumerationNodeView } from "./views";

export default function createContainer(widgetId: string): Container {
    const classDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
        rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
        rebind(TYPES.LogLevel).toConstantValue(LogLevel.info);
        rebind(EditLabelUI).to(EditLabelUIAutocomplete);
        bind(TYPES.IVNodePostprocessor).to(IconLabelCompartmentSelectionFeedback);

        const context = { bind, unbind, isBound, rebind };
        // bind(TYPES.IVNodePostprocessor).to(LabelSelectionFeedback);
        configureDefaultModelElements(context);
        configureModelElement(context, UmlTypes.LABEL_NAME, SEditableLabel, SLabelView);
        configureModelElement(context, UmlTypes.LABEL_EDGE_NAME, SEditableLabel, SLabelView);
        configureModelElement(context, UmlTypes.LABEL_EDGE_MULTIPLICITY, SEditableLabel, SLabelView);
        configureModelElement(context, UmlTypes.LABEL_TEXT, SLabel, SLabelView);
        // configureModelElement(context, UmlTypes.LABEL_ICON, SLabel, SLabelView);
        configureModelElement(context, BaseTypes.COMPARTMENT, SCompartment, SCompartmentView);
        configureModelElement(context, BaseTypes.COMPARTMENT_HEADER, SCompartment, SCompartmentView);
        configureModelElement(context, BaseTypes.ROUTING_POINT, SRoutingHandle, SRoutingHandleView);
        configureModelElement(context, BaseTypes.VOLATILE_ROUTING_POINT, SRoutingHandle, SRoutingHandleView);
        configureModelElement(context, UmlTypes.STRUCTURE, SCompartment, StructureCompartmentView);

        // CLASS DIAGRAM
        configureModelElement(context, UmlTypes.ICON_CLASS, IconClass, IconView);
        configureModelElement(context, UmlTypes.CLASS, LabeledNode, ClassNodeView);
        configureModelElement(context, UmlTypes.ABSTRACT_CLASS, LabeledNode, ClassNodeView);
        configureModelElement(context, UmlTypes.ICON_ENUMERATION, IconClass, IconView);
        configureModelElement(context, UmlTypes.ENUMERATION, LabeledNode, EnumerationNodeView);
        configureModelElement(context, UmlTypes.INTERFACE, LabeledNode, ClassNodeView);
        configureModelElement(context, UmlTypes.ASSOCIATION, SEdge, PolylineEdgeView);
        configureModelElement(context, UmlTypes.AGGREGATION, ConnectableEdge, DirectedEdgeView);
        configureModelElement(context, UmlTypes.COMPOSITION, ConnectableEdge, DirectedEdgeView);
        configureModelElement(context, UmlTypes.CLASS_GENERALIZATION, ConnectableEdge, DirectedEdgeView);
        // configureModelElement(context, UmlTypes.PROPERTY, SLabelNodeProperty, LabelNodeView);
        configureModelElement(context, UmlTypes.PROPERTY, IconLabelCompartment, SCompartmentView);
        configureModelElement(context, UmlTypes.ICON_PROPERTY, IconProperty, IconView);
        configureModelElement(context, UmlTypes.LABEL_PROPERTY_NAME, SEditableLabel, SLabelView);
        configureModelElement(context, UmlTypes.LABEL_PROPERTY_TYPE, SEditableLabel, SLabelView);
        configureModelElement(context, UmlTypes.LABEL_PROPERTY_MULTIPLICITY, SEditableLabel, SLabelView);

        configureViewerOptions(context, {
            needsClientLayout: true,
            baseDiv: widgetId
        });
    });

    const container = createClientContainer(classDiagramModule, umlToolPaletteModule, saveModule, copyPasteContextMenuModule,
        validationModule);
    container.unload(toolPaletteModule);
    overrideViewerOptions(container, {
        baseDiv: widgetId,
        hiddenDiv: widgetId + "_hidden"
    });

    return container;

}
