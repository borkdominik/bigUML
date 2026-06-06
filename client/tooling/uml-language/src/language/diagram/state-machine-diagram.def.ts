/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Glsp } from '@borkdominik-biguml/uml-glsp-server/generator';
import 'reflect-metadata';
import type { Choice } from '../elements/choice-element.def.js';
import type { DeepHistory } from '../elements/deep-history-element.def.js';
import type { FinalState } from '../elements/final-state-element.def.js';
import type { Fork } from '../elements/fork-element.def.js';
import type { InitialState } from '../elements/initial-state-element.def.js';
import type { Join } from '../elements/join-element.def.js';
import type { Region } from '../elements/region-element.def.js';
import type { ShallowHistory } from '../elements/shallow-history-element.def.js';
import type { State } from '../elements/state-element.def.js';
import type { StateMachine } from '../elements/state-machine-element.def.js';
import type { Transition } from '../elements/transition-element.def.js';

// @ts-nocheck

@Glsp.defaults
export class StateMachineDiagram {
    diagramType: 'STATE_MACHINE';
    entities?: Array<StateMachineDiagramNodes>;
    relations?: Array<StateMachineDiagramEdges>;
}

type StateMachineDiagramElements = StateMachineDiagramNodes | StateMachineDiagramEdges;

type StateMachineDiagramNodes =
    | StateMachine
    | Region
    | State
    | FinalState
    | InitialState
    | Choice
    | Join
    | Fork
    | DeepHistory
    | ShallowHistory;

type StateMachineDiagramEdges = Transition;
