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
import { ConnectableEdge, ConnectableEditableLabel, LabeledNode, SEditableLabel } from "../../model";
import { BaseTypes, UmlTypes } from "../../utils";
import { IconView } from "../../views/commons";
import { PackageNode } from "../shared/model";
import { PackageNodeView } from "../shared/package-node-view";
import { ConnectionPoint, IconActor, IconPackage, IconUseCase } from "./model";
import { ActorNodeView, DirectedEdgeView, UseCaseNodeView } from "./views";

export default function createContainer(widgetId: string): Container {
    const classDiagramModule = new ContainerModule(
        (bind, unbind, isBound, rebind) => {
            rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
            rebind(TYPES.LogLevel).toConstantValue(LogLevel.info);
            rebind(EditLabelUI).to(EditLabelUIAutocomplete);
            bind(TYPES.IVNodePostprocessor).to(
                IconLabelCompartmentSelectionFeedback
            );

            const context = { bind, unbind, isBound, rebind };
            // bind(TYPES.IVNodePostprocessor).to(LabelSelectionFeedback);
            configureDefaultModelElements(context);
            configureModelElement(
                context,
                UmlTypes.LABEL_NAME,
                SEditableLabel,
                SLabelView
            );
            configureModelElement(
                context,
                UmlTypes.LABEL_EDGE_NAME,
                SEditableLabel,
                SLabelView
            );
            configureModelElement(
                context,
                UmlTypes.LABEL_EDGE_MULTIPLICITY,
                SEditableLabel,
                SLabelView
            );
            configureModelElement(
                context,
                UmlTypes.LABEL_TEXT,
                SLabel,
                SLabelView
            );
            // configureModelElement(context, UmlTypes.LABEL_ICON, SLabel, SLabelView);
            configureModelElement(
                context,
                BaseTypes.COMPARTMENT,
                SCompartment,
                SCompartmentView
            );
            configureModelElement(
                context,
                BaseTypes.COMPARTMENT_HEADER,
                SCompartment,
                SCompartmentView
            );
            configureModelElement(
                context,
                BaseTypes.ROUTING_POINT,
                SRoutingHandle,
                SRoutingHandleView
            );
            configureModelElement(
                context,
                BaseTypes.VOLATILE_ROUTING_POINT,
                SRoutingHandle,
                SRoutingHandleView
            );
            configureModelElement(
                context,
                UmlTypes.STRUCTURE,
                SCompartment,
                StructureCompartmentView
            );

            // USECASE DIAGRAM
            configureModelElement(
                context,
                UmlTypes.ICON_USECASE,
                IconUseCase,
                IconView
            );
            configureModelElement(
                context,
                UmlTypes.USECASE,
                LabeledNode,
                UseCaseNodeView
            );
            configureModelElement(
                context,
                UmlTypes.ICON_ACTOR,
                IconActor,
                IconView
            );
            configureModelElement(
                context,
                UmlTypes.ACTOR,
                LabeledNode,
                ActorNodeView
            );
            configureModelElement(
                context,
                UmlTypes.ICON_PACKAGE,
                IconPackage,
                IconView
            );
            configureModelElement(
                context,
                UmlTypes.PACKAGE,
                PackageNode,
                PackageNodeView
            );
            configureModelElement(
                context,
                UmlTypes.LABEL_PACKAGE_NAME,
                SEditableLabel,
                SLabelView
            );
            configureModelElement(
                context,
                UmlTypes.COMPONENT,
                PackageNode,
                PackageNodeView
            );
            configureModelElement(
                context,
                UmlTypes.EXTENSIONPOINT,
                ConnectableEditableLabel,
                SLabelView
            );
            configureModelElement(
                context,
                UmlTypes.EXTEND,
                ConnectableEdge,
                DirectedEdgeView
            );
            configureModelElement(
                context,
                UmlTypes.INCLUDE,
                ConnectableEdge,
                DirectedEdgeView
            );
            configureModelElement(
                context,
                UmlTypes.GENERALIZATION,
                ConnectableEdge,
                DirectedEdgeView
            );
            configureModelElement(
                context,
                UmlTypes.CONNECTIONPOINT,
                ConnectionPoint,
                SLabelView
            );
            configureModelElement(
                context,
                UmlTypes.USECASE_ASSOCIATION,
                SEdge,
                PolylineEdgeView
            );

            configureViewerOptions(context, {
                needsClientLayout: true,
                baseDiv: widgetId
            });
        }
    );

    const container = createClientContainer(
        classDiagramModule,
        umlToolPaletteModule,
        saveModule,
        copyPasteContextMenuModule,
        validationModule
    );
    container.unload(toolPaletteModule);
    overrideViewerOptions(container, {
        baseDiv: widgetId,
        hiddenDiv: widgetId + "_hidden"
    });

    return container;
}
