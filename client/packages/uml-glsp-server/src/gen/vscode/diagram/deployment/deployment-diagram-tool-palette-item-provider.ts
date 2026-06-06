// AUTO-GENERATED – DO NOT EDIT
/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { DeploymentDiagramEdgeTypes, DeploymentDiagramNodeTypes } from '../../../common/model-types/deployment-diagram-model-types.js';
import {
    type Args,
    type MaybePromise,
    type PaletteItem,
    ToolPaletteItemProvider,
    TriggerEdgeCreationAction,
    TriggerNodeCreationAction
} from '@eclipse-glsp/server';

export class DeploymentDiagramToolPaletteItemProvider extends ToolPaletteItemProvider {
    override getItems(_args?: Args): MaybePromise<PaletteItem[]> {
        return [
            {
                id: 'uml.relations',
                sortString: 'A',
                label: 'Relations',
                icon: 'symbol-property',
                children: [
                    {
                        id: 'generalization',
                        sortString: 'A',
                        label: 'Generalization',
                        icon: 'uml-generalization-icon',
                        actions: [TriggerEdgeCreationAction.create(DeploymentDiagramEdgeTypes.GENERALIZATION)]
                    },
                    {
                        id: 'dependency',
                        sortString: 'A',
                        label: 'Dependency',
                        icon: 'uml-dependency-icon',
                        actions: [TriggerEdgeCreationAction.create(DeploymentDiagramEdgeTypes.DEPENDENCY)]
                    }
                ],
                actions: []
            },
            {
                id: 'uml.feature',
                sortString: 'A',
                label: 'Feature',
                icon: 'symbol-property',
                children: [
                    {
                        id: 'property',
                        sortString: 'A',
                        label: 'Property',
                        icon: 'uml-property-icon',
                        actions: [TriggerNodeCreationAction.create(DeploymentDiagramNodeTypes.PROPERTY)]
                    },
                    {
                        id: 'operation',
                        sortString: 'A',
                        label: 'Operation',
                        icon: 'uml-operation-icon',
                        actions: [TriggerNodeCreationAction.create(DeploymentDiagramNodeTypes.OPERATION)]
                    }
                ],
                actions: []
            },
            {
                id: 'uml.relation',
                sortString: 'A',
                label: 'Relation',
                icon: 'symbol-property',
                children: [
                    {
                        id: 'manifestation',
                        sortString: 'A',
                        label: 'Manifestation',
                        icon: 'uml-manifestation-icon',
                        actions: [TriggerEdgeCreationAction.create(DeploymentDiagramEdgeTypes.MANIFESTATION)]
                    },
                    {
                        id: 'deployment',
                        sortString: 'A',
                        label: 'Deployment',
                        icon: 'uml-deployment-icon',
                        actions: [TriggerEdgeCreationAction.create(DeploymentDiagramEdgeTypes.DEPLOYMENT)]
                    },
                    {
                        id: 'communication-path',
                        sortString: 'A',
                        label: 'Communication Path',
                        icon: 'uml-communication-path-icon',
                        actions: [TriggerEdgeCreationAction.create(DeploymentDiagramEdgeTypes.COMMUNICATION_PATH)]
                    }
                ],
                actions: []
            },
            {
                id: 'uml.container',
                sortString: 'A',
                label: 'Container',
                icon: 'symbol-property',
                children: [
                    {
                        id: 'execution-environment',
                        sortString: 'A',
                        label: 'Execution Environment',
                        icon: 'uml-execution-environment-icon',
                        actions: [TriggerNodeCreationAction.create(DeploymentDiagramNodeTypes.EXECUTION_ENVIRONMENT)]
                    },
                    {
                        id: 'deployment-specification',
                        sortString: 'A',
                        label: 'Deployment Specification',
                        icon: 'uml-deployment-specification-icon',
                        actions: [TriggerNodeCreationAction.create(DeploymentDiagramNodeTypes.DEPLOYMENT_SPECIFICATION)]
                    },
                    {
                        id: 'artifact',
                        sortString: 'A',
                        label: 'Artifact',
                        icon: 'uml-artifact-icon',
                        actions: [TriggerNodeCreationAction.create(DeploymentDiagramNodeTypes.ARTIFACT)]
                    },
                    {
                        id: 'device',
                        sortString: 'A',
                        label: 'Device',
                        icon: 'uml-device-icon',
                        actions: [TriggerNodeCreationAction.create(DeploymentDiagramNodeTypes.DEVICE)]
                    },
                    {
                        id: 'deployment-node',
                        sortString: 'A',
                        label: 'Node',
                        icon: 'uml-node-icon',
                        actions: [TriggerNodeCreationAction.create(DeploymentDiagramNodeTypes.DEPLOYMENT_NODE)]
                    },
                    {
                        id: 'deployment-package',
                        sortString: 'A',
                        label: 'Package',
                        icon: 'uml-package-icon',
                        actions: [TriggerNodeCreationAction.create(DeploymentDiagramNodeTypes.DEPLOYMENT_PACKAGE)]
                    },
                    {
                        id: 'deployment-model',
                        sortString: 'A',
                        label: 'Model',
                        icon: 'uml-model-icon',
                        actions: [TriggerNodeCreationAction.create(DeploymentDiagramNodeTypes.DEPLOYMENT_MODEL)]
                    }
                ],
                actions: []
            }
        ];
    }
}
