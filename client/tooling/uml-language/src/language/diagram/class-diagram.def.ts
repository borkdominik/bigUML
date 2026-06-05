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
import type { AbstractClass } from '../elements/abstract-class-element.def.js';
import type { Abstraction } from '../elements/abstraction-element.def.js';
import type { Association } from '../elements/association-element.def.js';
import type { Class } from '../elements/class-element.def.js';
import type { DataType } from '../elements/data-type-element.def.js';
import type { Dependency } from '../elements/dependency-element.def.js';
import type { ElementImport } from '../elements/element-import-element.def.js';
import type { Enumeration } from '../elements/enumeration-element.def.js';
import type { EnumerationLiteral } from '../elements/enumeration-literal-element.def.js';
import type { Generalization } from '../elements/generalization-element.def.js';
import type { InstanceSpecification } from '../elements/instance-specification-element.def.js';
import type { Interface } from '../elements/interface-element.def.js';
import type { InterfaceRealization } from '../elements/interface-realization-element.def.js';
import type { LiteralSpecification } from '../elements/literal-specification-element.def.js';
import type { Operation } from '../elements/operation-element.def.js';
import type { Package } from '../elements/package-element.def.js';
import type { PackageImport } from '../elements/package-import-element.def.js';
import type { PackageMerge } from '../elements/package-merge-element.def.js';
import type { Parameter } from '../elements/parameter-element.def.js';
import type { PrimitiveType } from '../elements/primitive-type-element.def.js';
import type { Property } from '../elements/property-element.def.js';
import type { Realization } from '../elements/realization-element.def.js';
import type { Slot } from '../elements/slot-element.def.js';
import type { Substitution } from '../elements/substitution-element.def.js';
import type { Usage } from '../elements/usage-element.def.js';

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
    | ElementImport
    | InterfaceRealization
    | Generalization
    | PackageImport
    | PackageMerge
    | Realization
    | Substitution
    | Usage;
