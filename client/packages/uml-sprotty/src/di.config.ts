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
    TYPES,
} from "@eclipse-glsp/client/lib";
import toolPaletteModule from "@eclipse-glsp/client/lib/features/tool-palette/di.config";
import { Container, ContainerModule } from "inversify";
import { EditLabelUI } from "sprotty/lib";

import {
    CustomCopyPasteHandler,
    LastContainableElementTracker,
} from "./features/copy-paste/copy-paste";
import umlDiagramOutlineViewModule from "./features/diagram-outline/di.config";
import { EditLabelUIAutocomplete } from "./features/edit-label";
import umlToolPaletteModule from "./features/tool-palette/di.config";
import { IconLabelCompartmentSelectionFeedback } from "./feedback";
import { LabeledNode, SEditableLabel } from "./model";
import createClassModule from "./uml/class/di.config";
import createCommunicationModule from "./uml/communication/di.config";
import { BaseTypes, UmlTypes } from "./utils";
import { CommentLinkEdgeView, CommentNodeView } from "./views/commons";

export default function createContainer(widgetId: string): Container {
    const commonDiagramModule = new ContainerModule(
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

            configureViewerOptions(context, {
                needsClientLayout: true,
                baseDiv: widgetId,
            });
        }
    );
    const communicationModule = createCommunicationModule();
    const classModule = createClassModule();

    const container = createClientContainer(
        commonDiagramModule,
        communicationModule,
        classModule,
        umlToolPaletteModule,
        saveModule,
        umlDiagramOutlineViewModule
    );
    container.unload(toolPaletteModule);
    container.bind(LastContainableElementTracker).toSelf().inSingletonScope();
    container
        .bind(TYPES.MouseListener)
        .toService(LastContainableElementTracker);
    container.rebind(GLSP_TYPES.ICopyPasteHandler).to(CustomCopyPasteHandler);

    overrideViewerOptions(container, {
        baseDiv: widgetId,
        hiddenDiv: widgetId + "_hidden",
    });
    return container;
}
