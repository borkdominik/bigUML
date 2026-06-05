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
export class InformationFlowDiagram {
    diagramType: 'INFORMATION_FLOW';
    entities?: Array<InformationFlowDiagramNodes>;
    relations?: Array<InformationFlowDiagramEdges>;
}

type InformationFlowDiagramElements = InformationFlowDiagramNodes | InformationFlowDiagramEdges;

type InformationFlowDiagramNodes = Actor | InformationFlowClass | Property | Operation | Parameter;

type InformationFlowDiagramEdges = InformationFlow;

/**
 * NODES
 */

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
    label: 'Class',
    icon: 'uml-class-icon'
})
@Glsp.defaults
export class InformationFlowClass extends Node {
    name: string;
    isAbstract?: boolean = false;
    isActive?: boolean = false;
    visibility?: Visibility;
    properties?: Array<Property>;
    operations?: Array<Operation>;
}

/**
 * EDGES
 */

@Glsp.toolPalette({
    section: 'Edges',
    label: 'Information Flow',
    icon: 'uml-dependency-icon'
})
@Glsp.defaults
export class InformationFlow extends Edge {
    name?: string;
    visibility?: Visibility;
    @Language.reference source: Actor | InformationFlowClass;
    @Language.reference target: Actor | InformationFlowClass;
}

/**
 * FEATURES
 */

@Glsp.toolPalette({
    section: 'Feature',
    label: 'Property',
    icon: 'uml-property-icon'
})
@Glsp.noBounds
@Glsp.defaults
export class Property extends Unbounded {
    name: string;
    isDerived?: boolean = false;
    isOrdered?: boolean = false;
    isStatic?: boolean = false;
    isDerivedUnion?: boolean = false;
    isReadOnly?: boolean = false;
    isNavigable?: boolean = false;
    isUnique?: boolean = false;
    visibility?: Visibility = 'PUBLIC';
    multiplicity?: string;
    aggregation?: AggregationType;
}

@Glsp.toolPalette({
    section: 'Feature',
    label: 'Operation',
    icon: 'uml-operation-icon'
})
@Glsp.noBounds
@Glsp.defaults
export class Operation extends Unbounded {
    name: string;
    isAbstract?: boolean;
    isStatic?: boolean;
    isQuery?: boolean;
    visibility?: Visibility;
    concurrency?: Concurrency;
    parameters?: Array<Parameter>;
}

@Glsp.noBounds
@Glsp.defaults
export class Parameter extends Unbounded {
    name: string;
    isException?: boolean;
    isStream?: boolean;
    isOrdered?: boolean;
    isUnique?: boolean;
    direction?: ParameterDirection;
    effect?: EffectType;
    visibility?: Visibility;
    multiplicity?: string;
}

/**
 * TYPES
 */
type AggregationType = 'NONE' | 'SHARED' | 'COMPOSITE';
type ParameterDirection = 'IN' | 'OUT' | 'INOUT' | 'RETURN';
type EffectType = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
type Concurrency = 'SEQUENTIAL' | 'GUARDED' | 'CONCURRENT';
