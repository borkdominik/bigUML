// AUTO-GENERATED – DO NOT EDIT
/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import {
    InformationFlowDiagramEdgeTypes,
    InformationFlowDiagramNodeTypes
} from '../../../common/model-types/information-flow-diagram-model-types.js';
import {
    type Args,
    type MaybePromise,
    type PaletteItem,
    ToolPaletteItemProvider,
    TriggerEdgeCreationAction,
    TriggerNodeCreationAction
} from '@eclipse-glsp/server';

export class InformationFlowDiagramToolPaletteItemProvider extends ToolPaletteItemProvider {
    override getItems(_args?: Args): MaybePromise<PaletteItem[]> {
        return [
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
                        actions: [TriggerNodeCreationAction.create(InformationFlowDiagramNodeTypes.PROPERTY)]
                    },
                    {
                        id: 'operation',
                        sortString: 'A',
                        label: 'Operation',
                        icon: 'uml-operation-icon',
                        actions: [TriggerNodeCreationAction.create(InformationFlowDiagramNodeTypes.OPERATION)]
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
                        id: 'class',
                        sortString: 'A',
                        label: 'Class',
                        icon: 'uml-class-icon',
                        actions: [TriggerNodeCreationAction.create(InformationFlowDiagramNodeTypes.CLASS)]
                    },
                    {
                        id: 'actor',
                        sortString: 'A',
                        label: 'Actor',
                        icon: 'uml-actor-icon',
                        actions: [TriggerNodeCreationAction.create(InformationFlowDiagramNodeTypes.ACTOR)]
                    }
                ],
                actions: []
            },
            {
                id: 'uml.edges',
                sortString: 'A',
                label: 'Edges',
                icon: 'symbol-property',
                children: [
                    {
                        id: 'information-flow',
                        sortString: 'A',
                        label: 'Information Flow',
                        icon: 'uml-dependency-icon',
                        actions: [TriggerEdgeCreationAction.create(InformationFlowDiagramEdgeTypes.INFORMATION_FLOW)]
                    }
                ],
                actions: []
            }
        ];
    }
}
