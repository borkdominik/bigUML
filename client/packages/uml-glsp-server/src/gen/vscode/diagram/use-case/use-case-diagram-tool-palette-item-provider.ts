// AUTO-GENERATED – DO NOT EDIT
/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { UseCaseDiagramEdgeTypes, UseCaseDiagramNodeTypes } from '../../../common/model-types/use-case-diagram-model-types.js';
import {
    type Args,
    type MaybePromise,
    type PaletteItem,
    ToolPaletteItemProvider,
    TriggerEdgeCreationAction,
    TriggerNodeCreationAction
} from '@eclipse-glsp/server';

export class UseCaseDiagramToolPaletteItemProvider extends ToolPaletteItemProvider {
    override getItems(_args?: Args): MaybePromise<PaletteItem[]> {
        return [
            {
                id: 'uml.container',
                sortString: 'A',
                label: 'Container',
                icon: 'symbol-property',
                children: [
                    {
                        id: 'use-case',
                        sortString: 'A',
                        label: 'Use Case',
                        icon: 'uml-use-case-icon',
                        actions: [TriggerNodeCreationAction.create(UseCaseDiagramNodeTypes.USE_CASE)]
                    },
                    {
                        id: 'subject',
                        sortString: 'A',
                        label: 'Subject',
                        icon: 'uml-component-icon',
                        actions: [TriggerNodeCreationAction.create(UseCaseDiagramNodeTypes.SUBJECT)]
                    },
                    {
                        id: 'actor',
                        sortString: 'A',
                        label: 'Actor',
                        icon: 'uml-actor-icon',
                        actions: [TriggerNodeCreationAction.create(UseCaseDiagramNodeTypes.ACTOR)]
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
                        id: 'include',
                        sortString: 'A',
                        label: 'Include',
                        icon: 'uml-include-icon',
                        actions: [TriggerEdgeCreationAction.create(UseCaseDiagramEdgeTypes.INCLUDE)]
                    },
                    {
                        id: 'extend',
                        sortString: 'A',
                        label: 'Extend',
                        icon: 'uml-extend-icon',
                        actions: [TriggerEdgeCreationAction.create(UseCaseDiagramEdgeTypes.EXTEND)]
                    }
                ],
                actions: []
            },
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
                        actions: [TriggerEdgeCreationAction.create(UseCaseDiagramEdgeTypes.GENERALIZATION)]
                    },
                    {
                        id: 'association',
                        sortString: 'A',
                        label: 'Association',
                        icon: 'uml-association-icon',
                        actions: [TriggerEdgeCreationAction.create(UseCaseDiagramEdgeTypes.ASSOCIATION)]
                    }
                ],
                actions: []
            }
        ];
    }
}
