/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { UMLDiagramType } from '@borkdominik-biguml/uml-protocol';
import { configureModelElement } from '@eclipse-glsp/client';
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
    representation: UMLDiagramType
): void {
    configureModelElement(context, QualifiedUtil.typeId(representation, 'InitialState'), NamedElement, InitialNodeView);
    configureModelElement(context, QualifiedUtil.typeId(representation, 'Choice'), NamedElement, ChoiceNodeView);
    configureModelElement(context, QualifiedUtil.typeId(representation, 'Join'), NamedElement, ForkJoinNodeView);
    configureModelElement(context, QualifiedUtil.typeId(representation, 'Fork'), NamedElement, ForkJoinNodeView);
    configureModelElement(context, QualifiedUtil.typeId(representation, 'DeepHistory'), NamedElement, DeepHistoryNodeView);
    configureModelElement(context, QualifiedUtil.typeId(representation, 'ShallowHistory'), NamedElement, ShallowHistoryNodeView);
}
