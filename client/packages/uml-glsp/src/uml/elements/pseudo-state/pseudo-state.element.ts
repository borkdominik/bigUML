/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { UmlDiagramType } from '@borkdominik-biguml/uml-common';
import { configureModelElement, DefaultTypes } from '@eclipse-glsp/client';
import { interfaces } from 'inversify';
import { QualifiedUtil } from '../../qualified.utils';
import { NamedElement } from '../index';
import { ChoiceNodeView } from './choice_node_view';
import { DeepHistoryNodeView } from './deep_history_node_view';
import { ForkJoinNodeView } from './fork_join_node_view';
import { InitialNodeView } from './initial_node_view';
import { ShallowHistoryNodeView } from './shallow_history_node_view';

export function registerPseudoStateElement(
    context: { bind: interfaces.Bind; isBound: interfaces.IsBound },
    representation: UmlDiagramType
): void {
    configureModelElement(
        context,
        QualifiedUtil.representationTypeId(representation, DefaultTypes.NODE_CIRCLE, 'InitialState'),
        NamedElement,
        InitialNodeView
    );
    configureModelElement(
        context,
        QualifiedUtil.representationTypeId(representation, DefaultTypes.NODE_DIAMOND, 'Choice'),
        NamedElement,
        ChoiceNodeView
    );
    configureModelElement(
        context,
        QualifiedUtil.representationTypeId(representation, DefaultTypes.NODE_RECTANGLE, 'Join'),
        NamedElement,
        ForkJoinNodeView
    );
    configureModelElement(
        context,
        QualifiedUtil.representationTypeId(representation, DefaultTypes.NODE_RECTANGLE, 'Fork'),
        NamedElement,
        ForkJoinNodeView
    );
    configureModelElement(
        context,
        QualifiedUtil.representationTypeId(representation, DefaultTypes.NODE_CIRCLE, 'DeepHistory'),
        NamedElement,
        DeepHistoryNodeView
    );
    configureModelElement(
        context,
        QualifiedUtil.representationTypeId(representation, DefaultTypes.NODE_CIRCLE, 'ShallowHistory'),
        NamedElement,
        ShallowHistoryNodeView
    );
}
