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
import { UseCaseDiagramEdgeTypes, UseCaseDiagramNodeTypes } from '../../../common/model-types/use-case-diagram-model-types.js';
import { type Args, type MaybePromise, type PaletteItem, ToolPaletteItemProvider, TriggerNodeCreationAction } from '@eclipse-glsp/server';

/**
 * The relations of the diagram. They are not listed in the palette: the "Create relation" tool offers
 * the ones whose ends admit the two elements picked.
 */
export const UseCaseDiagramRelationTypes: readonly RelationType[] = [
    {
        elementTypeId: UseCaseDiagramEdgeTypes.ASSOCIATION,
        label: 'Association',
        icon: 'uml-association-icon'
    },
    {
        elementTypeId: UseCaseDiagramEdgeTypes.EXTEND,
        label: 'Extend',
        icon: 'uml-extend-icon'
    },
    {
        elementTypeId: UseCaseDiagramEdgeTypes.GENERALIZATION,
        label: 'Generalization',
        icon: 'uml-generalization-icon'
    },
    {
        elementTypeId: UseCaseDiagramEdgeTypes.GENERIC_EDGE,
        label: 'Generic Edge',
        icon: 'uml-connector-icon'
    },
    {
        elementTypeId: UseCaseDiagramEdgeTypes.INCLUDE,
        label: 'Include',
        icon: 'uml-include-icon'
    }
];

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
                        actions: [TriggerNodeCreationAction.create(UseCaseDiagramNodeTypes.TEXT_LABEL)]
                    },
                    {
                        id: 'note',
                        sortString: 'A',
                        label: 'Note',
                        icon: 'uml-comment-icon',
                        actions: [TriggerNodeCreationAction.create(UseCaseDiagramNodeTypes.NOTE)]
                    }
                ],
                actions: []
            }
        ];
    }
}
