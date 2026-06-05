/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Glsp } from '@borkdominik-biguml/uml-glsp-server/generator';
import { Language } from '@borkdominik-biguml/uml-language-tooling';
import 'reflect-metadata';
import { Edge, Node, Unbounded, type Visibility } from './element.def.js';

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

/**
 * CONTAINERS
 */

@Glsp.toolPalette({
    section: 'Container',
    label: 'State Machine',
    icon: 'uml-state-machine-icon'
})
@Glsp.defaults
export class StateMachine extends Node {
    name: string;
    visibility?: Visibility;
    regions?: Array<Region>;
}

@Glsp.toolPalette({
    section: 'Container',
    label: 'Region',
    icon: 'uml-region-icon'
})
@Glsp.defaults
export class Region extends Node {
    name?: string;
    visibility?: Visibility;
    subvertices?: Array<StateMachineDiagramNodes>;
    transitions?: Array<Transition>;
}

@Glsp.toolPalette({
    section: 'Container',
    label: 'State',
    icon: 'uml-state-icon'
})
@Glsp.defaults
export class State extends Node {
    name: string;
    visibility?: Visibility;
    regions?: Array<Region>;
}

/**
 * PSEUDO STATES
 */

@Glsp.toolPalette({
    section: 'PseudoStates',
    label: 'Initial State',
    icon: 'uml-pseudostate-initial-icon'
})
@Glsp.noBounds
@Glsp.defaults
export class InitialState extends Unbounded {
    name?: string;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'PseudoStates',
    label: 'Final State',
    icon: 'uml-final-state-icon'
})
@Glsp.noBounds
@Glsp.defaults
export class FinalState extends Unbounded {
    name?: string;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'PseudoStates',
    label: 'Choice',
    icon: 'uml-pseudostate-choice-icon'
})
@Glsp.noBounds
@Glsp.defaults
export class Choice extends Unbounded {
    name?: string;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'PseudoStates',
    label: 'Join',
    icon: 'uml-pseudostate-join-icon'
})
@Glsp.noBounds
@Glsp.defaults
export class Join extends Unbounded {
    name?: string;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'PseudoStates',
    label: 'Fork',
    icon: 'uml-pseudostate-fork-icon'
})
@Glsp.noBounds
@Glsp.defaults
export class Fork extends Unbounded {
    name?: string;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'PseudoStates',
    label: 'Deep History',
    icon: 'uml-pseudostate-deep-history-icon'
})
@Glsp.noBounds
@Glsp.defaults
export class DeepHistory extends Unbounded {
    name?: string;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'PseudoStates',
    label: 'Shallow History',
    icon: 'uml-pseudostate-shallow-history-icon'
})
@Glsp.noBounds
@Glsp.defaults
export class ShallowHistory extends Unbounded {
    name?: string;
    visibility?: Visibility;
}

/**
 * EDGES
 */

@Glsp.toolPalette({
    section: 'Transition',
    label: 'Transition',
    icon: 'uml-transition-icon'
})
@Glsp.defaults
export class Transition extends Edge {
    name?: string;
    visibility?: Visibility;
    kind?: TransitionKind = 'EXTERNAL';
    @Language.reference source: Node | Unbounded;
    @Language.reference target: Node | Unbounded;
}

/**
 * TYPES
 */
type TransitionKind = 'INTERNAL' | 'EXTERNAL' | 'LOCAL';
