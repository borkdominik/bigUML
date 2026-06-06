// AUTO-GENERATED – DO NOT EDIT
/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { ActivityDiagramEdgeTypes, ActivityDiagramNodeTypes } from '../../../common/model-types/activity-diagram-model-types.js';
import {
    type Args,
    type MaybePromise,
    type PaletteItem,
    ToolPaletteItemProvider,
    TriggerEdgeCreationAction,
    TriggerNodeCreationAction
} from '@eclipse-glsp/server';

export class ActivityDiagramToolPaletteItemProvider extends ToolPaletteItemProvider {
    override getItems(_args?: Args): MaybePromise<PaletteItem[]> {
        return [
            {
                id: 'uml.actions',
                sortString: 'A',
                label: 'Actions',
                icon: 'symbol-property',
                children: [
                    {
                        id: 'send-signal-action',
                        sortString: 'A',
                        label: 'Send Signal Action',
                        icon: 'uml-send-signal-action-icon',
                        actions: [TriggerNodeCreationAction.create(ActivityDiagramNodeTypes.SEND_SIGNAL_ACTION)]
                    },
                    {
                        id: 'opaque-action',
                        sortString: 'A',
                        label: 'Opaque Action',
                        icon: 'uml-opaque-action-icon',
                        actions: [TriggerNodeCreationAction.create(ActivityDiagramNodeTypes.OPAQUE_ACTION)]
                    },
                    {
                        id: 'accept-event-action',
                        sortString: 'A',
                        label: 'Accept Event Action',
                        icon: 'uml-accept-event-action-icon',
                        actions: [TriggerNodeCreationAction.create(ActivityDiagramNodeTypes.ACCEPT_EVENT_ACTION)]
                    }
                ],
                actions: []
            },
            {
                id: 'uml.object nodes',
                sortString: 'A',
                label: 'Object Nodes',
                icon: 'symbol-property',
                children: [
                    {
                        id: 'output-pin',
                        sortString: 'A',
                        label: 'Output Pin',
                        icon: 'uml-output-pin-icon',
                        actions: [TriggerNodeCreationAction.create(ActivityDiagramNodeTypes.OUTPUT_PIN)]
                    },
                    {
                        id: 'input-pin',
                        sortString: 'A',
                        label: 'Input Pin',
                        icon: 'uml-input-pin-icon',
                        actions: [TriggerNodeCreationAction.create(ActivityDiagramNodeTypes.INPUT_PIN)]
                    },
                    {
                        id: 'central-buffer-node',
                        sortString: 'A',
                        label: 'Central Buffer Node',
                        icon: 'uml-central-buffer-node-icon',
                        actions: [TriggerNodeCreationAction.create(ActivityDiagramNodeTypes.CENTRAL_BUFFER_NODE)]
                    },
                    {
                        id: 'activity-parameter-node',
                        sortString: 'A',
                        label: 'Activity Parameter Node',
                        icon: 'uml-activity-parameter-node-icon',
                        actions: [TriggerNodeCreationAction.create(ActivityDiagramNodeTypes.ACTIVITY_PARAMETER_NODE)]
                    }
                ],
                actions: []
            },
            {
                id: 'uml.control nodes',
                sortString: 'A',
                label: 'Control Nodes',
                icon: 'symbol-property',
                children: [
                    {
                        id: 'merge-node',
                        sortString: 'A',
                        label: 'Merge Node',
                        icon: 'uml-merge-node-icon',
                        actions: [TriggerNodeCreationAction.create(ActivityDiagramNodeTypes.MERGE_NODE)]
                    },
                    {
                        id: 'join-node',
                        sortString: 'A',
                        label: 'Join Node',
                        icon: 'uml-join-node-icon',
                        actions: [TriggerNodeCreationAction.create(ActivityDiagramNodeTypes.JOIN_NODE)]
                    },
                    {
                        id: 'initial-node',
                        sortString: 'A',
                        label: 'Initial Node',
                        icon: 'uml-initial-node-icon',
                        actions: [TriggerNodeCreationAction.create(ActivityDiagramNodeTypes.INITIAL_NODE)]
                    },
                    {
                        id: 'fork-node',
                        sortString: 'A',
                        label: 'Fork Node',
                        icon: 'uml-fork-node-icon',
                        actions: [TriggerNodeCreationAction.create(ActivityDiagramNodeTypes.FORK_NODE)]
                    },
                    {
                        id: 'flow-final-node',
                        sortString: 'A',
                        label: 'Flow Final Node',
                        icon: 'uml-flow-final-node-icon',
                        actions: [TriggerNodeCreationAction.create(ActivityDiagramNodeTypes.FLOW_FINAL_NODE)]
                    },
                    {
                        id: 'decision-node',
                        sortString: 'A',
                        label: 'Decision Node',
                        icon: 'uml-decision-node-icon',
                        actions: [TriggerNodeCreationAction.create(ActivityDiagramNodeTypes.DECISION_NODE)]
                    },
                    {
                        id: 'activity-final-node',
                        sortString: 'A',
                        label: 'Activity Final Node',
                        icon: 'uml-activity-final-node-icon',
                        actions: [TriggerNodeCreationAction.create(ActivityDiagramNodeTypes.ACTIVITY_FINAL_NODE)]
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
                        id: 'control-flow',
                        sortString: 'A',
                        label: 'Control Flow',
                        icon: 'uml-control-flow-icon',
                        actions: [TriggerEdgeCreationAction.create(ActivityDiagramEdgeTypes.CONTROL_FLOW)]
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
                        id: 'activity-partition',
                        sortString: 'A',
                        label: 'Activity Partition',
                        icon: 'uml-activity-partition-icon',
                        actions: [TriggerNodeCreationAction.create(ActivityDiagramNodeTypes.ACTIVITY_PARTITION)]
                    },
                    {
                        id: 'activity',
                        sortString: 'A',
                        label: 'Activity',
                        icon: 'uml-activity-icon',
                        actions: [TriggerNodeCreationAction.create(ActivityDiagramNodeTypes.ACTIVITY)]
                    }
                ],
                actions: []
            }
        ];
    }
}
