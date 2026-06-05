// AUTO-GENERATED – DO NOT EDIT
/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { DefaultTypes } from '@eclipse-glsp/server';
import { representationTypeId } from '../../../env/common/model/model-type-utils.js';
import { AstTypeUtils } from '../../../env/common/model/model-type-utils.js';

export namespace ActivityDiagramNodeTypes {
    export const ACTIVITY = representationTypeId('Activity', DefaultTypes.NODE, 'Activity');
    export const ACTIVITY_PARTITION = representationTypeId('Activity', DefaultTypes.NODE, 'ActivityPartition');
    export const OPAQUE_ACTION = representationTypeId('Activity', DefaultTypes.NODE, 'OpaqueAction');
    export const ACCEPT_EVENT_ACTION = representationTypeId('Activity', DefaultTypes.NODE, 'AcceptEventAction');
    export const SEND_SIGNAL_ACTION = representationTypeId('Activity', DefaultTypes.NODE, 'SendSignalAction');
    export const INITIAL_NODE = representationTypeId('Activity', DefaultTypes.NODE, 'InitialNode');
    export const DECISION_NODE = representationTypeId('Activity', DefaultTypes.NODE, 'DecisionNode');
    export const MERGE_NODE = representationTypeId('Activity', DefaultTypes.NODE, 'MergeNode');
    export const JOIN_NODE = representationTypeId('Activity', DefaultTypes.NODE, 'JoinNode');
    export const FORK_NODE = representationTypeId('Activity', DefaultTypes.NODE, 'ForkNode');
    export const ACTIVITY_FINAL_NODE = representationTypeId('Activity', DefaultTypes.NODE, 'ActivityFinalNode');
    export const FLOW_FINAL_NODE = representationTypeId('Activity', DefaultTypes.NODE, 'FlowFinalNode');
    export const CENTRAL_BUFFER_NODE = representationTypeId('Activity', DefaultTypes.NODE, 'CentralBufferNode');
    export const ACTIVITY_PARAMETER_NODE = representationTypeId('Activity', DefaultTypes.NODE, 'ActivityParameterNode');
    export const INPUT_PIN = representationTypeId('Activity', DefaultTypes.NODE, 'InputPin');
    export const OUTPUT_PIN = representationTypeId('Activity', DefaultTypes.NODE, 'OutputPin');
}

export namespace ActivityDiagramEdgeTypes {
    export const CONTROL_FLOW = representationTypeId('Activity', DefaultTypes.EDGE, 'ControlFlow');
}

export namespace ActivityDiagramModelTypes {
    // re-export nodes
    export const ACTIVITY = ActivityDiagramNodeTypes.ACTIVITY;
    export const ACTIVITY_PARTITION = ActivityDiagramNodeTypes.ACTIVITY_PARTITION;
    export const OPAQUE_ACTION = ActivityDiagramNodeTypes.OPAQUE_ACTION;
    export const ACCEPT_EVENT_ACTION = ActivityDiagramNodeTypes.ACCEPT_EVENT_ACTION;
    export const SEND_SIGNAL_ACTION = ActivityDiagramNodeTypes.SEND_SIGNAL_ACTION;
    export const INITIAL_NODE = ActivityDiagramNodeTypes.INITIAL_NODE;
    export const DECISION_NODE = ActivityDiagramNodeTypes.DECISION_NODE;
    export const MERGE_NODE = ActivityDiagramNodeTypes.MERGE_NODE;
    export const JOIN_NODE = ActivityDiagramNodeTypes.JOIN_NODE;
    export const FORK_NODE = ActivityDiagramNodeTypes.FORK_NODE;
    export const ACTIVITY_FINAL_NODE = ActivityDiagramNodeTypes.ACTIVITY_FINAL_NODE;
    export const FLOW_FINAL_NODE = ActivityDiagramNodeTypes.FLOW_FINAL_NODE;
    export const CENTRAL_BUFFER_NODE = ActivityDiagramNodeTypes.CENTRAL_BUFFER_NODE;
    export const ACTIVITY_PARAMETER_NODE = ActivityDiagramNodeTypes.ACTIVITY_PARAMETER_NODE;
    export const INPUT_PIN = ActivityDiagramNodeTypes.INPUT_PIN;
    export const OUTPUT_PIN = ActivityDiagramNodeTypes.OUTPUT_PIN;

    // re-export edges
    export const CONTROL_FLOW = ActivityDiagramEdgeTypes.CONTROL_FLOW;
}

export namespace ActivityAstTypes {
    const typeMap: Record<string, string> = {
        Activity: ActivityDiagramModelTypes.ACTIVITY,
        ActivityPartition: ActivityDiagramModelTypes.ACTIVITY_PARTITION,
        OpaqueAction: ActivityDiagramModelTypes.OPAQUE_ACTION,
        AcceptEventAction: ActivityDiagramModelTypes.ACCEPT_EVENT_ACTION,
        SendSignalAction: ActivityDiagramModelTypes.SEND_SIGNAL_ACTION,
        InitialNode: ActivityDiagramModelTypes.INITIAL_NODE,
        DecisionNode: ActivityDiagramModelTypes.DECISION_NODE,
        MergeNode: ActivityDiagramModelTypes.MERGE_NODE,
        JoinNode: ActivityDiagramModelTypes.JOIN_NODE,
        ForkNode: ActivityDiagramModelTypes.FORK_NODE,
        ActivityFinalNode: ActivityDiagramModelTypes.ACTIVITY_FINAL_NODE,
        FlowFinalNode: ActivityDiagramModelTypes.FLOW_FINAL_NODE,
        CentralBufferNode: ActivityDiagramModelTypes.CENTRAL_BUFFER_NODE,
        ActivityParameterNode: ActivityDiagramModelTypes.ACTIVITY_PARAMETER_NODE,
        InputPin: ActivityDiagramModelTypes.INPUT_PIN,
        OutputPin: ActivityDiagramModelTypes.OUTPUT_PIN,
        ControlFlow: ActivityDiagramModelTypes.CONTROL_FLOW
    };

    export function convertToAst(elementId: string): string {
        return AstTypeUtils.stripPrefix(elementId);
    }

    export function convertToElementType(astType: string): string {
        const elementType = typeMap[astType];
        if (!elementType) {
            throw new Error(`[ActivityAstTypes] No element type found for AST type '${astType}'`);
        }
        return elementType;
    }
}
