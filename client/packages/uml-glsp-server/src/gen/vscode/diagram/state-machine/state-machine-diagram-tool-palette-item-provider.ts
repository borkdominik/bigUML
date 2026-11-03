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
import {
    StateMachineDiagramEdgeTypes,
    StateMachineDiagramNodeTypes
} from '../../../common/model-types/state-machine-diagram-model-types.js';
import { type Args, type MaybePromise, type PaletteItem, ToolPaletteItemProvider, TriggerNodeCreationAction } from '@eclipse-glsp/server';

/**
 * The relations of the diagram. They are not listed in the palette: the "Create relation" tool offers
 * the ones whose ends admit the two elements picked.
 */
export const StateMachineDiagramRelationTypes: readonly RelationType[] = [
    {
        elementTypeId: StateMachineDiagramEdgeTypes.GENERIC_EDGE,
        label: 'Generic Edge',
        icon: 'uml-connector-icon'
    },
    {
        elementTypeId: StateMachineDiagramEdgeTypes.TRANSITION,
        label: 'Transition',
        icon: 'uml-transition-icon'
    }
];

export class StateMachineDiagramToolPaletteItemProvider extends ToolPaletteItemProvider {
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
                        actions: [TriggerNodeCreationAction.create(StateMachineDiagramNodeTypes.TEXT_LABEL)]
                    },
                    {
                        id: 'note',
                        sortString: 'A',
                        label: 'Note',
                        icon: 'uml-comment-icon',
                        actions: [TriggerNodeCreationAction.create(StateMachineDiagramNodeTypes.NOTE)]
                    }
                ],
                actions: []
            },
            {
                id: 'uml.pseudo-states',
                sortString: 'A',
                label: 'PseudoStates',
                icon: 'symbol-property',
                children: [
                    {
                        id: 'terminate',
                        sortString: 'A',
                        label: 'Terminate',
                        icon: 'uml-pseudostate-terminate-icon',
                        actions: [TriggerNodeCreationAction.create(StateMachineDiagramNodeTypes.TERMINATE)]
                    },
                    {
                        id: 'shallow-history',
                        sortString: 'A',
                        label: 'Shallow History',
                        icon: 'uml-pseudostate-shallow-history-icon',
                        actions: [TriggerNodeCreationAction.create(StateMachineDiagramNodeTypes.SHALLOW_HISTORY)]
                    },
                    {
                        id: 'join',
                        sortString: 'A',
                        label: 'Join',
                        icon: 'uml-pseudostate-join-icon',
                        actions: [TriggerNodeCreationAction.create(StateMachineDiagramNodeTypes.JOIN)]
                    },
                    {
                        id: 'initial-state',
                        sortString: 'A',
                        label: 'Initial State',
                        icon: 'uml-pseudostate-initial-icon',
                        actions: [TriggerNodeCreationAction.create(StateMachineDiagramNodeTypes.INITIAL_STATE)]
                    },
                    {
                        id: 'fork',
                        sortString: 'A',
                        label: 'Fork',
                        icon: 'uml-pseudostate-fork-icon',
                        actions: [TriggerNodeCreationAction.create(StateMachineDiagramNodeTypes.FORK)]
                    },
                    {
                        id: 'final-state',
                        sortString: 'A',
                        label: 'Final State',
                        icon: 'uml-final-state-icon',
                        actions: [TriggerNodeCreationAction.create(StateMachineDiagramNodeTypes.FINAL_STATE)]
                    },
                    {
                        id: 'exit-point',
                        sortString: 'A',
                        label: 'Exit Point',
                        icon: 'uml-pseudostate-exit-point-icon',
                        actions: [TriggerNodeCreationAction.create(StateMachineDiagramNodeTypes.EXIT_POINT)]
                    },
                    {
                        id: 'entry-point',
                        sortString: 'A',
                        label: 'Entry Point',
                        icon: 'uml-pseudostate-entry-point-icon',
                        actions: [TriggerNodeCreationAction.create(StateMachineDiagramNodeTypes.ENTRY_POINT)]
                    },
                    {
                        id: 'deep-history',
                        sortString: 'A',
                        label: 'Deep History',
                        icon: 'uml-pseudostate-deep-history-icon',
                        actions: [TriggerNodeCreationAction.create(StateMachineDiagramNodeTypes.DEEP_HISTORY)]
                    },
                    {
                        id: 'choice',
                        sortString: 'A',
                        label: 'Choice',
                        icon: 'uml-pseudostate-choice-icon',
                        actions: [TriggerNodeCreationAction.create(StateMachineDiagramNodeTypes.CHOICE)]
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
                        id: 'state-machine',
                        sortString: 'A',
                        label: 'State Machine',
                        icon: 'uml-state-machine-icon',
                        actions: [TriggerNodeCreationAction.create(StateMachineDiagramNodeTypes.STATE_MACHINE)]
                    },
                    {
                        id: 'region',
                        sortString: 'A',
                        label: 'Region',
                        icon: 'uml-region-icon',
                        actions: [TriggerNodeCreationAction.create(StateMachineDiagramNodeTypes.REGION)]
                    },
                    {
                        id: 'state',
                        sortString: 'A',
                        label: 'State',
                        icon: 'uml-state-icon',
                        actions: [TriggerNodeCreationAction.create(StateMachineDiagramNodeTypes.STATE)]
                    }
                ],
                actions: []
            }
        ];
    }
}
