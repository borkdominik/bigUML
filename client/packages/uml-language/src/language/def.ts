/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
    astType,
    crossReference,
    dynamicProperty,
    LengthBetween,
    noBounds,
    path,
    root,
    skipPropertyPP,
    withDefaults
} from '@borkdominik-biguml/uml-language-tooling';
import { ArrayMaxSize, Matches, MinLength, ValidateIf } from 'class-validator';
import 'reflect-metadata';

/**
 * This file has been generated using the langium-model-management generator
 */
@root
class Diagram {
    diagram: ClassDiagram | StateMachineDiagram | PackageDiagram;
    metaInfos?: Array<MetaInfo>;
}

/**
 * META_INFO
 */
abstract class ElementWithSizeAndPosition {}
abstract class Entity extends ElementWithSizeAndPosition {}

abstract class MetaInfo {
    @crossReference element: ElementWithSizeAndPosition;
}
class Size extends MetaInfo {
    height: number;
    width: number;
}
class Position extends MetaInfo {
    x: number;
    y: number;
}

/**
 * CLASS_DIAGRAM
 */
@withDefaults
class ClassDiagram {
    diagramType: 'CLASS';
    entities?: Array<Entity>;
    relations?: Array<Relation>;
}

type ClassDiagramElements =
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
    | LiteralSpecification
    | Relation
    | Abstraction
    | Dependency
    | Association
    | Aggregation
    | Composition
    | InterfaceRealization
    | Generalization
    | PackageImport
    | PackageMerge
    | Realization
    | Substitution
    | Usage;

@withDefaults
export class Enumeration extends Entity {
    @LengthBetween(3, 10, { message: 'Enumeration.name must be 3–10 characters' })
    name: string;
    @path values?: Array<EnumerationLiteral>;
}

@noBounds
@withDefaults
export class EnumerationLiteral {
    name: string;
    value?: string;
    visibility?: Visibility;
}

@withDefaults
export class Class extends Entity {
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
    @path
    properties?: Array<Property>;
    @path operations?: Array<Operation>;
    isActive?: boolean;
    visibility?: Visibility;
    @skipPropertyPP skip?: boolean;
}

@withDefaults
export class AbstractClass extends Class {
    override isAbstract: boolean = true;
    declare label: string;
    declare visibility?: Visibility;
}

@withDefaults
export class Interface extends Entity {
    @LengthBetween(3, 10, { message: 'Interface.name must be 3–10 characters' })
    name: string;
    @path properties?: Array<Property>;
    @path operations?: Array<Operation>;
}

@noBounds
export class Property {
    name: string;
    isDerived?: boolean = false;
    isOrdered?: boolean = false;
    isStatic?: boolean = false;
    isDerivedUnion?: boolean = false;
    isReadOnly?: boolean = false;
    isUnique?: boolean = false;
    visibility?: Visibility = 'PUBLIC';
    multiplicity?: string;
    @dynamicProperty('DataType') @crossReference propertyType?: DataTypeReference;
    aggregation?: AggregationType;
}

@noBounds
@withDefaults
export class Operation {
    name: string;
    isAbstract?: boolean;
    isStatic?: boolean;
    isQuery?: boolean;
    visibility?: Visibility;
    concurrency?: Concurrency;
    @path parameters?: Array<Parameter>;
}

@noBounds
@withDefaults
export class Parameter {
    name: string;
    isException?: boolean;
    isStream?: boolean;
    isOrdered?: boolean;
    isUnique?: boolean;
    direction?: ParameterDirection;
    effect?: EffectType;
    visibility?: Visibility;
    @dynamicProperty('DataType')
    @crossReference
    parameterType?: DataTypeReference;
    multiplicity?: string;
}
type DataTypeReference = DataType | Enumeration | Class | Interface | PrimitiveType;

@withDefaults
export class DataType extends Entity {
    @MinLength(5)
    name: string;
    @path properties?: Array<Property>;
    @path operations?: Array<Operation>;
    isAbstract?: boolean;
    visibility?: Visibility;
}
export class PrimitiveType extends Entity {
    name: string;
}

@withDefaults
export class InstanceSpecification extends Entity {
    name: string;
    visibility?: Visibility;
    @path slots?: Array<Slot>;
}

@noBounds
export class Slot {
    name: string;
    @dynamicProperty('DefiningFeature')
    @crossReference
    definingFeature?: SlotDefiningFeature;
    @path values?: Array<LiteralSpecification> = [];
}
type SlotDefiningFeature = Property | Class | Interface;

export class LiteralSpecification {
    name: string;
    value: string;
}

export class Relation {
    @crossReference source: Entity;
    @crossReference target: Entity;
    relationType: RelationType;
}

@withDefaults
export class Abstraction extends Relation {
    name?: string;
    visibility?: Visibility;
}

@withDefaults
export class Dependency extends Relation {
    name?: string;
    visibility?: Visibility;
}

@withDefaults
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

@withDefaults
@astType('Association')
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

@withDefaults
@astType('Association')
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

@withDefaults
export class InterfaceRealization extends Relation {
    name?: string;
    visibility?: Visibility;
}

@withDefaults
export class Generalization extends Relation {
    isSubstitutable: boolean;
}

@withDefaults
export class PackageImport extends Relation {
    visibility?: Visibility;
}

@withDefaults
export class PackageMerge extends Relation {}
export class Realization extends Relation {
    name?: string;
    visibility?: Visibility;
}

@withDefaults
export class Substitution extends Relation {
    name?: string;
    visibility?: Visibility;
}

@withDefaults
export class Usage extends Relation {
    name?: string;
    visibility?: Visibility;
}
/**
 * STATE_MACHINE
 */
export class StateMachineDiagram {
    diagramType: 'STATE_MACHINE';
}

/**
 * PACKAGE_DIAGRAM
 */
@withDefaults
export class PackageDiagram {
    diagramType: 'PACKAGE';
    @path entities?: Array<Entity>;
    @path relations?: Array<Relation>;
}

type PackageDiagramElements = Class | Package | Abstraction | Dependency | PackageImport | PackageMerge | Usage;

@withDefaults
export class Package extends Entity {
    name: string;
    uri?: string;
    visibility?: Visibility;
    @path entities?: Array<Entity>;
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
type Visibility = 'PUBLIC' | 'PRIVATE' | 'PROTECTED' | 'PACKAGE';
