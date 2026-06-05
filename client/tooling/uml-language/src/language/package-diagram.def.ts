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
export class PackageDiagram {
    diagramType: 'PACKAGE';
    entities?: Array<PackageDiagramNodes>;
    relations?: Array<PackageDiagramEdges>;
}

type PackageDiagramElements = PackageDiagramNodes | PackageDiagramEdges;

type PackageDiagramNodes = Package | PackageClass | Property | Operation | Parameter;

type PackageDiagramEdges = PackageImport | PackageMerge | ElementImport | Dependency | Abstraction | Usage;

/**
 * CONTAINERS
 */

@Glsp.toolPalette({
    section: 'Container',
    label: 'Package',
    icon: 'uml-package-icon'
})
@Glsp.defaults
export class Package extends Node {
    name: string;
    uri?: string;
    visibility?: Visibility;
    entities?: Array<PackageDiagramNodes>;
}

@Glsp.toolPalette({
    section: 'Container',
    label: 'Class',
    icon: 'uml-class-icon'
})
@Glsp.defaults
export class PackageClass extends Node {
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

export class Relation extends Edge {
    @Language.reference source: Node;
    @Language.reference target: Node;
}

@Glsp.toolPalette({
    section: 'Relation',
    label: 'Package Import',
    icon: 'uml-package-import-icon'
})
@Glsp.defaults
export class PackageImport extends Relation {
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Relation',
    label: 'Package Merge',
    icon: 'uml-package-merge-icon'
})
@Glsp.defaults
export class PackageMerge extends Relation {}

@Glsp.toolPalette({
    section: 'Relation',
    label: 'Element Import',
    icon: 'uml-package-import-icon'
})
@Glsp.defaults
export class ElementImport extends Relation {
    alias?: string;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Relation',
    label: 'Dependency',
    icon: 'uml-dependency-icon'
})
@Glsp.defaults
export class Dependency extends Relation {
    name?: string;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Relation',
    label: 'Abstraction',
    icon: 'uml-abstraction-icon'
})
@Glsp.defaults
export class Abstraction extends Relation {
    name?: string;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Relation',
    label: 'Usage',
    icon: 'uml-usage-icon'
})
@Glsp.defaults
export class Usage extends Relation {
    name?: string;
    visibility?: Visibility;
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
