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
import "@eclipse-glsp/client/css/glsp-sprotty.css";
import "balloon-css/balloon.min.css";
import "sprotty/css/edit-label.css";

import {
    configureDefaultModelElements,
    configureModelElement,
    configureViewerOptions,
    ConsoleLogger,
    createClientContainer,
    GLSP_TYPES,
    GLSPGraph,
    LogLevel,
    overrideViewerOptions,
    saveModule,
    SCompartment,
    SCompartmentView,
    SEdge,
    SLabel,
    SLabelView,
    SRoutingHandle,
    SRoutingHandleView,
    StructureCompartmentView,
    TYPES
} from "@eclipse-glsp/client/lib";
import toolPaletteModule from "@eclipse-glsp/client/lib/features/tool-palette/di.config";
import { DefaultTypes } from "@eclipse-glsp/protocol";
import { Container, ContainerModule } from "inversify";
import { EditLabelUI } from "sprotty/lib";

import { CommentLinkEdgeView, CommentNodeView, IconCSSView } from "./common/common";
import { UmlGraphView } from "./common/graph-view";
import { CustomCopyPasteHandler, LastContainableElementTracker } from "./features/copy-paste/copy-paste";
import umlDiagramOutlineViewModule from "./features/diagram-outline/di.config";
import { EditLabelUIAutocomplete } from "./features/edit-label";
import umlEditorPanelModule from "./features/editor-panel/di.config";
import umlPropertyPaletteModule from "./features/property-palette/di.config";
import umlToolPaletteModule from "./features/tool-palette/di.config";
import { IconLabelCompartmentSelectionFeedback } from "./feedback";
import { IconCSS, LabeledNode, SEditableLabel } from "./model";
import createClassModule from "./uml/class/di.config";
import createCommunicationModule from "./uml/communication/di.config";
import { BaseTypes, UmlTypes } from "./utils";

export default function createContainer(widgetId: string): Container {
    const coreDiagramModule = new ContainerModule(
        (bind, unbind, isBound, rebind) => {
            rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
            rebind(TYPES.LogLevel).toConstantValue(LogLevel.info);
            rebind(EditLabelUI).to(EditLabelUIAutocomplete);
            bind(TYPES.IVNodePostprocessor).to(
                IconLabelCompartmentSelectionFeedback
            );

            const context = { bind, unbind, isBound, rebind };
            configureDefaultModelElements(context);

            configureModelElement(
                context,
                DefaultTypes.GRAPH,
                GLSPGraph,
                UmlGraphView
            );

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
                UmlTypes.LABEL_TEXT,
                SLabel,
                SLabelView
            );

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

            configureModelElement(
                context,
                UmlTypes.COMMENT,
                LabeledNode,
                CommentNodeView
            );
            configureModelElement(
                context,
                UmlTypes.COMMENT_LINK,
                SEdge,
                CommentLinkEdgeView
            );

            configureModelElement(
                context,
                UmlTypes.ICON_CSS,
                IconCSS,
                IconCSSView
            );

            configureViewerOptions(context, {
                needsClientLayout: true,
                baseDiv: widgetId
            });
        }
    );
    const communicationModule = createCommunicationModule();
    const classModule = createClassModule();

    const container = createClientContainer(
        saveModule,
        coreDiagramModule,
        communicationModule,
        classModule,
        umlEditorPanelModule,
        umlToolPaletteModule,
        umlDiagramOutlineViewModule,
        umlPropertyPaletteModule
    );
    container.unload(toolPaletteModule);
    container.bind(LastContainableElementTracker).toSelf().inSingletonScope();
    container
        .bind(TYPES.MouseListener)
        .toService(LastContainableElementTracker);
    container.rebind(GLSP_TYPES.ICopyPasteHandler).to(CustomCopyPasteHandler);

    overrideViewerOptions(container, {
        baseDiv: widgetId,
        hiddenDiv: widgetId + "_hidden"
    });
    return container;
}
