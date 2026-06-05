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
    CommunicationDiagramEdgeTypes,
    CommunicationDiagramNodeTypes
} from '../../../common/model-types/communication-diagram-model-types.js';
import {
    type Args,
    type MaybePromise,
    type PaletteItem,
    ToolPaletteItemProvider,
    TriggerEdgeCreationAction,
    TriggerNodeCreationAction
} from '@eclipse-glsp/server';

export class CommunicationDiagramToolPaletteItemProvider extends ToolPaletteItemProvider {
    override getItems(_args?: Args): MaybePromise<PaletteItem[]> {
        return [
            {
                id: 'uml.edges',
                sortString: 'A',
                label: 'Edges',
                icon: 'symbol-property',
                children: [
                    {
                        id: 'message',
                        sortString: 'A',
                        label: 'Message',
                        icon: 'uml-message-icon',
                        actions: [TriggerEdgeCreationAction.create(CommunicationDiagramEdgeTypes.MESSAGE)]
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
