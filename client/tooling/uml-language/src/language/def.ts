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
  withDefaults,
} from "@borkdominik-biguml/uml-language-tooling";
import { ArrayMaxSize, Matches, MinLength, ValidateIf } from "class-validator";
import "reflect-metadata";

/**
 * This file has been generated using the langium-model-management generator
 */
@root
class Diagram {
  diagram: ClassDiagram;
  metaInfos?: Array<MetaInfo>;
}

abstract class Element {}

abstract class ElementWithSizeAndPosition extends Element {}

abstract class Node extends ElementWithSizeAndPosition {}

abstract class Edge extends Element {}

abstract class Unbounded extends Element {}

/**
 * META_INFO
 */

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
  diagramType: "CLASS";
  entities?: Array<ClassDiagramNodes>;
  relations?: Array<ClassDiagramEdges>;
}

type ClassDiagramElement = ClassDiagramNodes | ClassDiagramEdges;

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
export class Enumeration extends Node {
  @LengthBetween(3, 10, { message: "Enumeration.name must be 3–10 characters" })
  name: string;
  @path values?: Array<EnumerationLiteral>;
}

@noBounds
@withDefaults
export class EnumerationLiteral extends Unbounded {
  name: string;
  value?: string;
  visibility?: Visibility;
}

@withDefaults
export class Class extends Node {
  @Matches(/^[A-Z]/, {
    message: "First letter of class name must be uppercase.",
  })
  @MinLength(5, { message: "Class name must be at least 5 characters long" })
  name: string;
  isAbstract: boolean = false;
  @ValidateIf((o) => o.isActive === true)
  @ArrayMaxSize(3, {
    message: "Active classes must declare at most 3 properties.",
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
export class Interface extends Node {
  @LengthBetween(3, 10, { message: "Interface.name must be 3–10 characters" })
  name: string;
  @path properties?: Array<Property>;
  @path operations?: Array<Operation>;
}

@noBounds
export class Property extends Unbounded {
  name: string;
  isDerived?: boolean = false;
  isOrdered?: boolean = false;
  isStatic?: boolean = false;
  isDerivedUnion?: boolean = false;
  isReadOnly?: boolean = false;
  isUnique?: boolean = false;
  visibility?: Visibility = "PUBLIC";
  multiplicity?: string;
  @dynamicProperty("DataType") @crossReference propertyType?: DataTypeReference;
  aggregation?: AggregationType;
}

@noBounds
@withDefaults
export class Operation extends Unbounded {
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
export class Parameter extends Unbounded {
  name: string;
  isException?: boolean;
  isStream?: boolean;
  isOrdered?: boolean;
  isUnique?: boolean;
  direction?: ParameterDirection;
  effect?: EffectType;
  visibility?: Visibility;
  @dynamicProperty("DataType")
  @crossReference
  parameterType?: DataTypeReference;
  multiplicity?: string;
}
type DataTypeReference =
  | DataType
  | Enumeration
  | Class
  | Interface
  | PrimitiveType;

@withDefaults
export class DataType extends Node {
  @MinLength(5)
  name: string;
  @path properties?: Array<Property>;
  @path operations?: Array<Operation>;
  isAbstract?: boolean;
  visibility?: Visibility;
}
export class PrimitiveType extends Node {
  name: string;
}

@withDefaults
export class InstanceSpecification extends Node {
  name: string;
  visibility?: Visibility;
  @path slots?: Array<Slot>;
}

@noBounds
export class Slot extends Node {
  name: string;
  @dynamicProperty("DefiningFeature")
  @crossReference
  definingFeature?: SlotDefiningFeature;
  @path values?: Array<LiteralSpecification> = [];
}
type SlotDefiningFeature = Property | Class | Interface;

export class LiteralSpecification extends Unbounded {
  name: string;
  value: string;
}

export class Relation extends Edge {
  @crossReference source: Node;
  @crossReference target: Node;
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
  sourceMultiplicity?: string = "*";
  targetMultiplicity?: string = "*";
  sourceName?: string;
  targetName?: string;
  sourceAggregation?: AggregationType = "NONE";
  targetAggregation?: AggregationType = "NONE";
  visibility?: Visibility;
}

@withDefaults
@astType("Association")
export class Aggregation extends Relation {
  name?: string;
  sourceMultiplicity?: string = "*";
  targetMultiplicity?: string = "*";
  sourceName?: string;
  targetName?: string;
  sourceAggregation?: AggregationType = "SHARED";
  targetAggregation?: AggregationType = "NONE";
  visibility?: Visibility;
}

@withDefaults
@astType("Association")
export class Composition extends Relation {
  name?: string;
  sourceMultiplicity?: string = "*";
  targetMultiplicity?: string = "*";
  sourceName?: string;
  targetName?: string;
  sourceAggregation?: AggregationType = "COMPOSITE";
  targetAggregation?: AggregationType = "NONE";
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

@withDefaults
export class Package extends Node {
  name: string;
  uri?: string;
  visibility?: Visibility;
  @path entities?: Array<Node>;
}

/**
 * TYPES
 */
type AggregationType = "NONE" | "SHARED" | "COMPOSITE";
type ParameterDirection = "IN" | "OUT" | "INOUT" | "RETURN";
type EffectType = "CREATE" | "READ" | "UPDATE" | "DELETE";

type Concurrency = "SEQUENTIAL" | "GUARDED" | "CONCURRENT";
type RelationType =
  | "ABSTRACTION"
  | "AGGREGATION"
  | "ASSOCIATION"
  | "COMPOSITION"
  | "DEPENDENCY"
  | "GENERALIZATION"
  | "INTERFACE_REALIZATION"
  | "PACKAGE_IMPORT"
  | "ELEMENT_IMPORT"
  | "PACKAGE_MERGE"
  | "REALIZATION"
  | "SUBSTITUTION"
  | "USAGE";
type Visibility = "PUBLIC" | "PRIVATE" | "PROTECTED" | "PACKAGE";
