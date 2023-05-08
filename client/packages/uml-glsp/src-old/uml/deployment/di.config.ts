/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import '@eclipse-glsp/client/css/glsp-sprotty.css';
import 'sprotty/css/edit-label.css';

/*
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
            /*
            configureModelElement(
                context,
                UmlTypes.DEPLOYMENT_COMPONENT,
                LabeledNode,
                ClassNodeView
            );
            *
        }
    );

    return deplyomentModule;
}
*/
