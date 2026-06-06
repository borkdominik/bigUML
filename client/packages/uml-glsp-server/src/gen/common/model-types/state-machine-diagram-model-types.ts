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

export namespace StateMachineDiagramNodeTypes {
    export const STATE_MACHINE = representationTypeId('StateMachine', DefaultTypes.NODE, 'StateMachine');
    export const REGION = representationTypeId('StateMachine', DefaultTypes.NODE, 'Region');
    export const STATE = representationTypeId('StateMachine', DefaultTypes.NODE, 'State');
    export const FINAL_STATE = representationTypeId('StateMachine', DefaultTypes.NODE, 'FinalState');
    export const INITIAL_STATE = representationTypeId('StateMachine', DefaultTypes.NODE, 'InitialState');
    export const CHOICE = representationTypeId('StateMachine', DefaultTypes.NODE, 'Choice');
    export const JOIN = representationTypeId('StateMachine', DefaultTypes.NODE, 'Join');
    export const FORK = representationTypeId('StateMachine', DefaultTypes.NODE, 'Fork');
    export const DEEP_HISTORY = representationTypeId('StateMachine', DefaultTypes.NODE, 'DeepHistory');
    export const SHALLOW_HISTORY = representationTypeId('StateMachine', DefaultTypes.NODE, 'ShallowHistory');
}

export namespace StateMachineDiagramEdgeTypes {
    export const TRANSITION = representationTypeId('StateMachine', DefaultTypes.EDGE, 'Transition');
}

export namespace StateMachineDiagramModelTypes {
    // re-export nodes
    export const STATE_MACHINE = StateMachineDiagramNodeTypes.STATE_MACHINE;
    export const REGION = StateMachineDiagramNodeTypes.REGION;
    export const STATE = StateMachineDiagramNodeTypes.STATE;
    export const FINAL_STATE = StateMachineDiagramNodeTypes.FINAL_STATE;
    export const INITIAL_STATE = StateMachineDiagramNodeTypes.INITIAL_STATE;
    export const CHOICE = StateMachineDiagramNodeTypes.CHOICE;
    export const JOIN = StateMachineDiagramNodeTypes.JOIN;
    export const FORK = StateMachineDiagramNodeTypes.FORK;
    export const DEEP_HISTORY = StateMachineDiagramNodeTypes.DEEP_HISTORY;
    export const SHALLOW_HISTORY = StateMachineDiagramNodeTypes.SHALLOW_HISTORY;

    // re-export edges
    export const TRANSITION = StateMachineDiagramEdgeTypes.TRANSITION;
}

export namespace StateMachineAstTypes {
    const typeMap: Record<string, string> = {
        StateMachine: StateMachineDiagramModelTypes.STATE_MACHINE,
        Region: StateMachineDiagramModelTypes.REGION,
        State: StateMachineDiagramModelTypes.STATE,
        FinalState: StateMachineDiagramModelTypes.FINAL_STATE,
        InitialState: StateMachineDiagramModelTypes.INITIAL_STATE,
        Choice: StateMachineDiagramModelTypes.CHOICE,
        Join: StateMachineDiagramModelTypes.JOIN,
        Fork: StateMachineDiagramModelTypes.FORK,
        DeepHistory: StateMachineDiagramModelTypes.DEEP_HISTORY,
        ShallowHistory: StateMachineDiagramModelTypes.SHALLOW_HISTORY,
        Transition: StateMachineDiagramModelTypes.TRANSITION
    };

    export function convertToAst(elementId: string): string {
        return AstTypeUtils.stripPrefix(elementId);
    }

    export function convertToElementType(astType: string): string {
        const elementType = typeMap[astType];
        if (!elementType) {
            throw new Error(`[StateMachineAstTypes] No element type found for AST type '${astType}'`);
        }
        return elementType;
    }
}
