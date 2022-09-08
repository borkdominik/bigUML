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
    EditLabelUI,
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
} from "@eclipse-glsp/client";
import toolPaletteModule from "@eclipse-glsp/client/lib/features/tool-palette/di.config";
import { Container, ContainerModule } from "inversify";

import { EditLabelUIAutocomplete } from "../../features/edit-label";
import umlToolPaletteModule from "../../features/tool-palette/di.config";
import { IconLabelCompartmentSelectionFeedback } from "../../feedback";
import { LabeledNode, SEditableLabel } from "../../model";
import { BaseTypes, UmlTypes } from "../../utils";
import { IconView } from "../../views/commons";
import { ClassNodeView } from "../class/views";
import { PackageNode } from "../shared/model";
import { DirectedEdgeView } from "../usecase/views";
import {
    IconArtifact,
    IconDeploymentNode,
    IconDeploymentSpecification,
    IconDevice,
    IconExecutionEnvironment
} from "./model";
import {
    ArtifactNodeView,
    DeploymentNodeNodeView,
    DeploymentSpecificationNodeView,
    DeviceNodeView,
    ExecutionEnvironmentNodeView
} from "./views";

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

        // DEPLOYMENT DIAGRAM
        configureModelElement(context, UmlTypes.ICON_ARTIFACT, IconArtifact, IconView);
        configureModelElement(context, UmlTypes.ARTIFACT, PackageNode, ArtifactNodeView);
        configureModelElement(context, UmlTypes.ICON_DEVICE, IconDevice, IconView);
        configureModelElement(context, UmlTypes.DEVICE, PackageNode, DeviceNodeView);
        configureModelElement(context, UmlTypes.EXECUTION_ENVIRONMENT, PackageNode, ExecutionEnvironmentNodeView);
        configureModelElement(context, UmlTypes.ICON_EXECUTION_ENVIRONMENT, IconExecutionEnvironment, IconView);
        configureModelElement(context, UmlTypes.DEPLOYMENT_NODE, PackageNode, DeploymentNodeNodeView);
        configureModelElement(context, UmlTypes.ICON_DEPLOYMENT_NODE, IconDeploymentNode, IconView);
        configureModelElement(context, UmlTypes.DEPLOYMENT_SPECIFICATION, LabeledNode, DeploymentSpecificationNodeView);
        configureModelElement(context, UmlTypes.ICON_DEPLOYMENT_SPECIFICATION, IconDeploymentSpecification, IconView);
        configureModelElement(context, UmlTypes.COMMUNICATION_PATH, SEdge, PolylineEdgeView);
        configureModelElement(context, UmlTypes.DEPLOYMENT, SEdge, DirectedEdgeView);
        // TODO: ClassNodeView just used as placeholder
        configureModelElement(context, UmlTypes.DEPLOYMENT_COMPONENT, LabeledNode, ClassNodeView);

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
