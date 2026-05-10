/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { skipPropertyPP } from "@borkdominik-biguml/big-property-palette/generator";
import {
  noBounds,
  toolPaletteItem,
  withDefaults,
} from "@borkdominik-biguml/uml-glsp-server/generator";
import {
  astType,
  crossReference,
  dynamicProperty,
  path,
  root,
} from "@borkdominik-biguml/uml-language-tooling";
import { LengthBetween } from "@borkdominik-biguml/uml-model-server/validation";
import { ArrayMaxSize, Matches, MinLength, ValidateIf } from "class-validator";
import "reflect-metadata";

// @ts-nocheck

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
  | InterfaceRealization
  | Generalization
  | PackageImport
  | PackageMerge
  | Realization
  | Substitution
  | Usage;

@toolPaletteItem({
  section: "Container",
  label: "Enumeration",
  icon: "uml-enumeration-icon",
})
@withDefaults
export class Enumeration extends Node {
  @LengthBetween(3, 10, { message: "Enumeration.name must be 3–10 characters" })
  name: string;
  @path values?: Array<EnumerationLiteral>;
}

@toolPaletteItem({
  section: "Feature",
  label: "Enumeration Literal",
  icon: "uml-enumeration-literal-icon",
})
@noBounds
@withDefaults
export class EnumerationLiteral extends Unbounded {
  name: string;
  value?: string;
  visibility?: Visibility;
}

@toolPaletteItem({
  section: "Container",
  label: "Class",
  icon: "uml-class-icon",
})
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

@toolPaletteItem({
  section: "Container",
  label: "Abstract Class",
  icon: "uml-class-icon",
})
@withDefaults
export class AbstractClass extends Class {
  override isAbstract: boolean = true;
  declare label: string;
  declare visibility?: Visibility;
}

@toolPaletteItem({
  section: "Container",
  label: "Interface",
  icon: "uml-interface-icon",
})
@withDefaults
export class Interface extends Node {
  @LengthBetween(3, 10, { message: "Interface.name must be 3–10 characters" })
  name: string;
  @path properties?: Array<Property>;
  @path operations?: Array<Operation>;
}

@toolPaletteItem({
  section: "Feature",
  label: "Property",
  icon: "uml-property-icon",
})
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

@toolPaletteItem({
  section: "Feature",
  label: "Operation",
  icon: "uml-operation-icon",
})
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

@toolPaletteItem({
  section: "Container",
  label: "DataType",
  icon: "uml-data-type-icon",
})
@withDefaults
export class DataType extends Node {
  @MinLength(5)
  name: string;
  @path properties?: Array<Property>;
  @path operations?: Array<Operation>;
  isAbstract?: boolean;
  visibility?: Visibility;
}
@toolPaletteItem({
  section: "Container",
  label: "Primitive Type",
  icon: "uml-primitive-type-icon",
})
export class PrimitiveType extends Node {
  name: string;
}

@toolPaletteItem({
  section: "Container",
  label: "Instance Specification",
  icon: "uml-instance-specification-icon",
})
@withDefaults
export class InstanceSpecification extends Node {
  name: string;
  visibility?: Visibility;
  @path slots?: Array<Slot>;
}

@toolPaletteItem({ section: "Feature", label: "Slot", icon: "uml-slot-icon" })
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

@toolPaletteItem({
  section: "Relations",
  label: "Abstraction",
  icon: "uml-abstraction-icon",
})
@withDefaults
export class Abstraction extends Relation {
  name?: string;
  visibility?: Visibility;
}

@toolPaletteItem({
  section: "Relations",
  label: "Dependency",
  icon: "uml-dependency-icon",
})
@withDefaults
export class Dependency extends Relation {
  name?: string;
  visibility?: Visibility;
}

@toolPaletteItem({
  section: "Relations",
  label: "Association",
  icon: "uml-association-icon",
})
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

@toolPaletteItem({
  section: "Relations",
  label: "Aggregation",
  icon: "uml-association-shared-icon",
})
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

@toolPaletteItem({
  section: "Relations",
  label: "Composition",
  icon: "uml-association-composite-icon",
})
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

@toolPaletteItem({
  section: "Relations",
  label: "Interface Realization",
  icon: "uml-interface-realization-icon",
})
@withDefaults
export class InterfaceRealization extends Relation {
  name?: string;
  visibility?: Visibility;
}

@toolPaletteItem({
  section: "Relations",
  label: "Generalization",
  icon: "uml-generalization-icon",
})
@withDefaults
export class Generalization extends Relation {
  isSubstitutable: boolean;
}

@toolPaletteItem({
  section: "Relations",
  label: "Package Import",
  icon: "uml-package-import-icon",
})
@withDefaults
export class PackageImport extends Relation {
  visibility?: Visibility;
}

@toolPaletteItem({
  section: "Relations",
  label: "Package Merge",
  icon: "uml-package-merge-icon",
})
@withDefaults
export class PackageMerge extends Relation {}

@toolPaletteItem({
  section: "Relations",
  label: "Realization",
  icon: "uml-realization-icon",
})
export class Realization extends Relation {
  name?: string;
  visibility?: Visibility;
}

@toolPaletteItem({
  section: "Relations",
  label: "Substitution",
  icon: "uml-substitution-icon",
})
@withDefaults
export class Substitution extends Relation {
  name?: string;
  visibility?: Visibility;
}

@toolPaletteItem({
  section: "Relations",
  label: "Usage",
  icon: "uml-usage-icon",
})
@withDefaults
export class Usage extends Relation {
  name?: string;
  visibility?: Visibility;
}

@toolPaletteItem({
  section: "Container",
  label: "Package",
  icon: "uml-package-icon",
})
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
