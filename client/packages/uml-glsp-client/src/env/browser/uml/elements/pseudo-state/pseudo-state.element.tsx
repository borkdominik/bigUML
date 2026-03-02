/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { injectable } from 'inversify';
import { NamedElement } from '../index.js';
import { ChoiceNodeView } from './choice_node_view.js';
import { DeepHistoryNodeView } from './deep_history_node_view.js';
import { ForkJoinNodeView } from './fork_join_node_view.js';
import { InitialNodeView } from './initial_node_view.js';
import { ShallowHistoryNodeView } from './shallow_history_node_view.js';

export class GInitialStateNode extends NamedElement {}

@injectable()
export class GInitialStateNodeView extends InitialNodeView {}

export class GChoiceNode extends NamedElement {}

@injectable()
export class GChoiceNodeView extends ChoiceNodeView {}

export class GStateForkNode extends NamedElement {}

@injectable()
export class GStateForkNodeView extends ForkJoinNodeView {}

export class GStateJoinNode extends NamedElement {}

@injectable()
export class GStateJoinNodeView extends ForkJoinNodeView {}

export class GDeepHistoryNode extends NamedElement {}

@injectable()
export class GDeepHistoryNodeView extends DeepHistoryNodeView {}

export class GShallowHistoryNode extends NamedElement {}

@injectable()
export class GShallowHistoryNodeView extends ShallowHistoryNodeView {}
