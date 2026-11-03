// AUTO-GENERATED – DO NOT EDIT
/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { RelationType } from '../../../../env/common/model/relation-type.action.js';
import { DeploymentDiagramEdgeTypes, DeploymentDiagramNodeTypes } from '../../../common/model-types/deployment-diagram-model-types.js';
import { type Args, type MaybePromise, type PaletteItem, ToolPaletteItemProvider, TriggerNodeCreationAction } from '@eclipse-glsp/server';

/**
 * The relations of the diagram. They are not listed in the palette: the "Create relation" tool offers
 * the ones whose ends admit the two elements picked.
 */
export const DeploymentDiagramRelationTypes: readonly RelationType[] = [
    {
        elementTypeId: DeploymentDiagramEdgeTypes.COMMUNICATION_PATH,
        label: 'Communication Path',
        icon: 'uml-communication-path-icon'
    },
    {
        elementTypeId: DeploymentDiagramEdgeTypes.DEPENDENCY,
        label: 'Dependency',
        icon: 'uml-dependency-icon'
    },
    {
        elementTypeId: DeploymentDiagramEdgeTypes.DEPLOYMENT,
        label: 'Deployment',
        icon: 'uml-deployment-icon'
    },
    {
        elementTypeId: DeploymentDiagramEdgeTypes.GENERALIZATION,
        label: 'Generalization',
        icon: 'uml-generalization-icon'
    },
    {
        elementTypeId: DeploymentDiagramEdgeTypes.GENERIC_EDGE,
        label: 'Generic Edge',
        icon: 'uml-connector-icon'
    },
    {
        elementTypeId: DeploymentDiagramEdgeTypes.MANIFESTATION,
        label: 'Manifestation',
        icon: 'uml-manifestation-icon'
    }
];

export class DeploymentDiagramToolPaletteItemProvider extends ToolPaletteItemProvider {
    override getItems(_args?: Args): MaybePromise<PaletteItem[]> {
        return [
            {
                id: 'uml.annotation',
                sortString: 'A',
                label: 'Annotation',
                icon: 'symbol-property',
                children: [
                    {
                        id: 'text-label',
                        sortString: 'A',
                        label: 'Label',
                        icon: 'uml-string-expression-icon',
                        actions: [TriggerNodeCreationAction.create(DeploymentDiagramNodeTypes.TEXT_LABEL)]
                    },
                    {
                        id: 'note',
                        sortString: 'A',
                        label: 'Note',
                        icon: 'uml-comment-icon',
                        actions: [TriggerNodeCreationAction.create(DeploymentDiagramNodeTypes.NOTE)]
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
