/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { PropertyPalette } from '@borkdominik-biguml/big-property-palette/generator';
import { Glsp } from '@borkdominik-biguml/uml-glsp-server/generator';
import { Language } from '@borkdominik-biguml/uml-language-tooling';
import { LengthBetween } from '@borkdominik-biguml/uml-model-server/validation';
import { ArrayMaxSize, Matches, MinLength, ValidateIf } from 'class-validator';
import 'reflect-metadata';
import { Edge, Node, Unbounded, type Visibility } from './element.def.js';

// @ts-nocheck

@Glsp.defaults
export class ClassDiagram {
    diagramType: 'CLASS';
    entities?: Array<ClassDiagramNodes>;
    relations?: Array<ClassDiagramEdges>;
}

type ClassDiagramElements = ClassDiagramNodes | ClassDiagramEdges;

type ClassDiagramNodes =
    | Enumeration
    | EnumerationLiteral
    | Class
    | AbstractClass
    | Interface
    | Package
    | Property
    | Operation
    | Parameter
    | DataType
    | PrimitiveType
    | InstanceSpecification
    | Slot
    | LiteralSpecification;

type ClassDiagramEdges =
    | Abstraction
    | Dependency
    | Association
    | Aggregation
    | Composition
    | ElementImport
    | InterfaceRealization
    | Generalization
    | PackageImport
    | PackageMerge
    | Realization
    | Substitution
    | Usage;

@Glsp.toolPalette({
    section: 'Container',
    label: 'Enumeration',
    icon: 'uml-enumeration-icon'
})
@Glsp.defaults
export class Enumeration extends Node {
    @LengthBetween(3, 10, { message: 'Enumeration.name must be 3–10 characters' })
    name: string;
    isAbstract?: boolean = false;
    visibility?: Visibility;
    values?: Array<EnumerationLiteral>;
}

@Glsp.toolPalette({
    section: 'Feature',
    label: 'Enumeration Literal',
    icon: 'uml-enumeration-literal-icon'
})
@Glsp.noBounds
@Glsp.defaults
export class EnumerationLiteral extends Unbounded {
    name: string;
    value?: string;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Container',
    label: 'Class',
    icon: 'uml-class-icon'
})
@Glsp.defaults
export class Class extends Node {
    @Matches(/^[A-Z]/, {
        message: 'First letter of class name must be uppercase.'
    })
    @MinLength(5, { message: 'Class name must be at least 5 characters long' })
    name: string;
    isAbstract: boolean = false;
    @ValidateIf(o => o.isActive === true)
    @ArrayMaxSize(3, {
        message: 'Active classes must declare at most 3 properties.'
    })
    properties?: Array<Property>;
    operations?: Array<Operation>;
    isActive?: boolean;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Container',
    label: 'Abstract Class',
    icon: 'uml-class-icon'
})
@Glsp.defaults
export class AbstractClass extends Class {
    override isAbstract: boolean = true;
    declare label: string;
    declare visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Container',
    label: 'Interface',
    icon: 'uml-interface-icon'
})
@Glsp.defaults
export class Interface extends Node {
    @LengthBetween(3, 10, { message: 'Interface.name must be 3–10 characters' })
    name: string;
    properties?: Array<Property>;
    operations?: Array<Operation>;
}

@Glsp.toolPalette({
    section: 'Feature',
    label: 'Property',
    icon: 'uml-property-icon'
})
@Glsp.noBounds
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
    @PropertyPalette.dynamic('DataType') @Language.reference propertyType?: DataTypeReference;
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
    @PropertyPalette.dynamic('DataType')
    @Language.reference
    parameterType?: DataTypeReference;
    multiplicity?: string;
}
type DataTypeReference = DataType | Enumeration | Class | Interface | PrimitiveType;

@Glsp.toolPalette({
    section: 'Container',
    label: 'DataType',
    icon: 'uml-data-type-icon'
})
@Glsp.defaults
export class DataType extends Node {
    @MinLength(5)
    name: string;
    properties?: Array<Property>;
    operations?: Array<Operation>;
    isAbstract?: boolean;
    visibility?: Visibility;
}
@Glsp.toolPalette({
    section: 'Container',
    label: 'Primitive Type',
    icon: 'uml-primitive-type-icon'
})
@Glsp.defaults
export class PrimitiveType extends Node {
    name: string;
}

@Glsp.toolPalette({
    section: 'Container',
    label: 'Instance Specification',
    icon: 'uml-instance-specification-icon'
})
@Glsp.defaults
export class InstanceSpecification extends Node {
    name: string;
    visibility?: Visibility;
    slots?: Array<Slot>;
}

@Glsp.toolPalette({ section: 'Feature', label: 'Slot', icon: 'uml-slot-icon' })
@Glsp.noBounds
export class Slot extends Unbounded {
    name: string;
    @PropertyPalette.dynamic('DefiningFeature')
    @Language.reference
    definingFeature?: SlotDefiningFeature;
    values?: Array<LiteralSpecification> = [];
}
type SlotDefiningFeature = Property | Class | Interface;

@Glsp.noBounds
@Glsp.defaults
export class LiteralSpecification extends Unbounded {
    name: string;
    value: string;
}

export class Relation extends Edge {
    @Language.reference source: Node;
    @Language.reference target: Node;
    relationType: RelationType;
}

@Glsp.toolPalette({
    section: 'Relations',
    label: 'Abstraction',
    icon: 'uml-abstraction-icon'
})
@Glsp.defaults
export class Abstraction extends Relation {
    name?: string;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Relations',
    label: 'Dependency',
    icon: 'uml-dependency-icon'
})
@Glsp.defaults
export class Dependency extends Relation {
    name?: string;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Relations',
    label: 'Association',
    icon: 'uml-association-icon'
})
@Glsp.defaults
export class Association extends Relation {
    name?: string;
    sourceMultiplicity?: string = '*';
    targetMultiplicity?: string = '*';
    sourceName?: string;
    targetName?: string;
    sourceAggregation?: AggregationType = 'NONE';
    targetAggregation?: AggregationType = 'NONE';
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Relations',
    label: 'Aggregation',
    icon: 'uml-association-shared-icon'
})
@Glsp.defaults
@Glsp.alias('Association')
export class Aggregation extends Relation {
    name?: string;
    sourceMultiplicity?: string = '*';
    targetMultiplicity?: string = '*';
    sourceName?: string;
    targetName?: string;
    sourceAggregation?: AggregationType = 'SHARED';
    targetAggregation?: AggregationType = 'NONE';
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Relations',
    label: 'Composition',
    icon: 'uml-association-composite-icon'
})
@Glsp.defaults
@Glsp.alias('Association')
export class Composition extends Relation {
    name?: string;
    sourceMultiplicity?: string = '*';
    targetMultiplicity?: string = '*';
    sourceName?: string;
    targetName?: string;
    sourceAggregation?: AggregationType = 'COMPOSITE';
    targetAggregation?: AggregationType = 'NONE';
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Relations',
    label: 'Interface Realization',
    icon: 'uml-interface-realization-icon'
})
@Glsp.defaults
export class InterfaceRealization extends Relation {
    name?: string;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Relations',
    label: 'Generalization',
    icon: 'uml-generalization-icon'
})
@Glsp.defaults
export class Generalization extends Relation {
    isSubstitutable: boolean;
}

@Glsp.toolPalette({
    section: 'Relations',
    label: 'Package Import',
    icon: 'uml-package-import-icon'
})
@Glsp.defaults
export class PackageImport extends Relation {
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Relations',
    label: 'Package Merge',
    icon: 'uml-package-merge-icon'
})
@Glsp.defaults
export class PackageMerge extends Relation {}

@Glsp.toolPalette({
    section: 'Relations',
    label: 'Element Import',
    icon: 'uml-package-import-icon'
})
@Glsp.defaults
export class ElementImport extends Relation {
    alias?: string;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Relations',
    label: 'Realization',
    icon: 'uml-realization-icon'
})
@Glsp.defaults
export class Realization extends Relation {
    name?: string;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Relations',
    label: 'Substitution',
    icon: 'uml-substitution-icon'
})
@Glsp.defaults
export class Substitution extends Relation {
    name?: string;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Relations',
    label: 'Usage',
    icon: 'uml-usage-icon'
})
@Glsp.defaults
export class Usage extends Relation {
    name?: string;
    visibility?: Visibility;
}

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
    entities?: Array<Node>;
}

/**
 * TYPES
 */
type AggregationType = 'NONE' | 'SHARED' | 'COMPOSITE';
type ParameterDirection = 'IN' | 'OUT' | 'INOUT' | 'RETURN';
type EffectType = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';

type Concurrency = 'SEQUENTIAL' | 'GUARDED' | 'CONCURRENT';
type RelationType =
    | 'ABSTRACTION'
    | 'AGGREGATION'
    | 'ASSOCIATION'
    | 'COMPOSITION'
    | 'DEPENDENCY'
    | 'GENERALIZATION'
    | 'INTERFACE_REALIZATION'
    | 'PACKAGE_IMPORT'
    | 'ELEMENT_IMPORT'
    | 'PACKAGE_MERGE'
    | 'REALIZATION'
    | 'SUBSTITUTION'
    | 'USAGE';
