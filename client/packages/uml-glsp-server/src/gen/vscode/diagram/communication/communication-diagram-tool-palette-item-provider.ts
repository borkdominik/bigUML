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
    CommunicationDiagramEdgeTypes,
    CommunicationDiagramNodeTypes
} from '../../../common/model-types/communication-diagram-model-types.js';
import { type Args, type MaybePromise, type PaletteItem, ToolPaletteItemProvider, TriggerNodeCreationAction } from '@eclipse-glsp/server';

/**
 * The relations of the diagram. They are not listed in the palette: the "Create relation" tool offers
 * the ones whose ends admit the two elements picked.
 */
export const CommunicationDiagramRelationTypes: readonly RelationType[] = [
    {
        elementTypeId: CommunicationDiagramEdgeTypes.GENERIC_EDGE,
        label: 'Generic Edge',
        icon: 'uml-connector-icon'
    },
    {
        elementTypeId: CommunicationDiagramEdgeTypes.MESSAGE,
        label: 'Message',
        icon: 'uml-message-icon'
    }
];

export class CommunicationDiagramToolPaletteItemProvider extends ToolPaletteItemProvider {
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
                        actions: [TriggerNodeCreationAction.create(CommunicationDiagramNodeTypes.TEXT_LABEL)]
                    },
                    {
                        id: 'note',
                        sortString: 'A',
                        label: 'Note',
                        icon: 'uml-comment-icon',
                        actions: [TriggerNodeCreationAction.create(CommunicationDiagramNodeTypes.NOTE)]
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
                        id: 'lifeline',
                        sortString: 'A',
                        label: 'Lifeline',
                        icon: 'uml-lifeline-icon',
                        actions: [TriggerNodeCreationAction.create(CommunicationDiagramNodeTypes.LIFELINE)]
                    },
                    {
                        id: 'interaction',
                        sortString: 'A',
                        label: 'Interaction',
                        icon: 'uml-interaction-icon',
                        actions: [TriggerNodeCreationAction.create(CommunicationDiagramNodeTypes.INTERACTION)]
                    }
                ],
                actions: []
            }
        ];
    }
}
