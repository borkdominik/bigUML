/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { representationTypeId } from '@borkdominik-biguml/uml-glsp-server';
import { configureModelElement, FeatureModule } from '@eclipse-glsp/client';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import {
    GArtifactNode,
    GArtifactNodeView,
    GCommunicationPathEdge,
    GCommunicationPathEdgeView,
    GDependencyEdge,
    GDependencyEdgeView,
    GDeploymentEdge,
    GDeploymentEdgeView,
    GDeploymentSpecificationNode,
    GDeploymentSpecificationNodeView,
    GDeviceNode,
    GDeviceNodeView,
    GExecutionEnvironmentNode,
    GExecutionEnvironmentNodeView,
    GGeneralizationEdge,
    GGeneralizationEdgeView,
    GManifestationEdge,
    GManifestationEdgeView,
    GModelNode,
    GModelNodeView,
    GOperationNode,
    GOperationNodeView,
    GPackageNode,
    GPackageNodeView,
    GParameterNode,
    GParameterNodeView,
    GPropertyNode,
    GPropertyNodeView,
    GUmlNodeNode,
    GUmlNodeNodeView
} from '../../elements/index.js';
import { GEditableLabel, GEditableLabelView } from '../../views/uml-label.view.js';

const R = 'Deployment';

export const umlDeploymentDiagramModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    // Nodes
    configureModelElement(
        context,
        representationTypeId(R, DefaultTypes.NODE, 'DeploymentSpecification'),
        GDeploymentSpecificationNode,
        GDeploymentSpecificationNodeView
    );
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Artifact'), GArtifactNode, GArtifactNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Device'), GDeviceNode, GDeviceNodeView);
    configureModelElement(
        context,
        representationTypeId(R, DefaultTypes.NODE, 'ExecutionEnvironment'),
        GExecutionEnvironmentNode,
        GExecutionEnvironmentNodeView
    );
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Model'), GModelNode, GModelNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Node'), GUmlNodeNode, GUmlNodeNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Package'), GPackageNode, GPackageNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Property'), GPropertyNode, GPropertyNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'PropertyType'), GEditableLabel, GEditableLabelView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'PropertyMultiplicity'), GEditableLabel, GEditableLabelView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Operation'), GOperationNode, GOperationNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Parameter'), GParameterNode, GParameterNodeView);

    // Edges
    configureModelElement(
        context,
        representationTypeId(R, DefaultTypes.EDGE, 'CommunicationPath'),
        GCommunicationPathEdge,
        GCommunicationPathEdgeView
    );
    configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'Dependency'), GDependencyEdge, GDependencyEdgeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'Manifestation'), GManifestationEdge, GManifestationEdgeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'Deployment'), GDeploymentEdge, GDeploymentEdgeView);
    configureModelElement(
        context,
        representationTypeId(R, DefaultTypes.EDGE, 'Generalization'),
        GGeneralizationEdge,
        GGeneralizationEdgeView
    );
});
