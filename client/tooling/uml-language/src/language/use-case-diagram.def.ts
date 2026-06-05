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
import { Edge, Node, type Visibility } from './element.def.js';

// @ts-nocheck

@Glsp.defaults
export class UseCaseDiagram {
    diagramType: 'USE_CASE';
    entities?: Array<UseCaseDiagramNodes>;
    relations?: Array<UseCaseDiagramEdges>;
}

type UseCaseDiagramElements = UseCaseDiagramNodes | UseCaseDiagramEdges;

type UseCaseDiagramNodes = UseCase | Actor | Subject;

type UseCaseDiagramEdges = Include | Extend | UseCaseAssociation | Generalization;

/**
 * NODES
 */

@Glsp.toolPalette({
    section: 'Container',
    label: 'Use Case',
    icon: 'uml-use-case-icon'
})
@Glsp.defaults
export class UseCase extends Node {
    name: string;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Container',
    label: 'Actor',
    icon: 'uml-actor-icon'
})
@Glsp.defaults
export class Actor extends Node {
    name: string;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Container',
    label: 'Subject',
    icon: 'uml-component-icon'
})
@Glsp.defaults
export class Subject extends Node {
    name: string;
    visibility?: Visibility;
    useCases?: Array<UseCase>;
}

/**
 * EDGES
 */

export class Relation extends Edge {
    @Language.reference source: Node;
    @Language.reference target: Node;
}

@Glsp.toolPalette({
    section: 'Relation',
    label: 'Include',
    icon: 'uml-include-icon'
})
@Glsp.defaults
export class Include extends Relation {}

@Glsp.toolPalette({
    section: 'Relation',
    label: 'Extend',
    icon: 'uml-extend-icon'
})
@Glsp.defaults
export class Extend extends Relation {}

@Glsp.toolPalette({
    section: 'Relation',
    label: 'Association',
    icon: 'uml-association-icon'
})
@Glsp.defaults
export class UseCaseAssociation extends Relation {
    name?: string;
    visibility?: Visibility;
    sourceMultiplicity?: string;
    targetMultiplicity?: string;
    sourceName?: string;
    targetName?: string;
}

@Glsp.toolPalette({
    section: 'Relation',
    label: 'Generalization',
    icon: 'uml-generalization-icon'
})
@Glsp.defaults
export class Generalization extends Relation {
    isSubstitutable?: boolean;
}
