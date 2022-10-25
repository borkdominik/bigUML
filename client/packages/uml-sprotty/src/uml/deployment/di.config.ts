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
    configureModelElement,
    PolylineEdgeView,
    SEdge,
} from "@eclipse-glsp/client";
import { ContainerModule } from "inversify";

import { LabeledNode } from "../../model";
import { UmlTypes } from "../../utils";
import { IconView } from "../../views/commons";
import { ClassNodeView } from "../class/views";
import { PackageNode } from "../shared/model";
import { DirectedEdgeView } from "../usecase/views";
import {
    IconArtifact,
    IconDeploymentNode,
    IconDeploymentSpecification,
    IconDevice,
    IconExecutionEnvironment,
} from "./model";
import {
    ArtifactNodeView,
    DeploymentNodeNodeView,
    DeploymentSpecificationNodeView,
    DeviceNodeView,
    ExecutionEnvironmentNodeView,
} from "./views";

export default function createDeploymentModule(): ContainerModule {
    const deplyomentModule = new ContainerModule(
        (bind, unbind, isBound, rebind) => {
            const context = { bind, unbind, isBound, rebind };
            // DEPLOYMENT DIAGRAM
            configureModelElement(
                context,
                UmlTypes.ICON_ARTIFACT,
                IconArtifact,
                IconView
            );
            configureModelElement(
                context,
                UmlTypes.ARTIFACT,
                PackageNode,
                ArtifactNodeView
            );
            configureModelElement(
                context,
                UmlTypes.ICON_DEVICE,
                IconDevice,
                IconView
            );
            configureModelElement(
                context,
                UmlTypes.DEVICE,
                PackageNode,
                DeviceNodeView
            );
            configureModelElement(
                context,
                UmlTypes.EXECUTION_ENVIRONMENT,
                PackageNode,
                ExecutionEnvironmentNodeView
            );
            configureModelElement(
                context,
                UmlTypes.ICON_EXECUTION_ENVIRONMENT,
                IconExecutionEnvironment,
                IconView
            );
            configureModelElement(
                context,
                UmlTypes.DEPLOYMENT_NODE,
                PackageNode,
                DeploymentNodeNodeView
            );
            configureModelElement(
                context,
                UmlTypes.ICON_DEPLOYMENT_NODE,
                IconDeploymentNode,
                IconView
            );
            configureModelElement(
                context,
                UmlTypes.DEPLOYMENT_SPECIFICATION,
                LabeledNode,
                DeploymentSpecificationNodeView
            );
            configureModelElement(
                context,
                UmlTypes.ICON_DEPLOYMENT_SPECIFICATION,
                IconDeploymentSpecification,
                IconView
            );
            configureModelElement(
                context,
                UmlTypes.COMMUNICATION_PATH,
                SEdge,
                PolylineEdgeView
            );
            configureModelElement(
                context,
                UmlTypes.DEPLOYMENT,
                SEdge,
                DirectedEdgeView
            );
            // TODO: ClassNodeView just used as placeholder
            configureModelElement(
                context,
                UmlTypes.DEPLOYMENT_COMPONENT,
                LabeledNode,
                ClassNodeView
            );
        }
    );

    return deplyomentModule;
}
