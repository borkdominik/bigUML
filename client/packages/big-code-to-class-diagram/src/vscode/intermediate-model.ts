/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

export type Diagram = {
    edges: Edge[];
    nodes: Node[];
};

export type Edge = {
    type:
        | 'Abstraction'
        | 'Aggregation'
        | 'Association'
        | 'Composition'
        | 'Dependency'
        | 'ElementImport'
        | 'Generalization'
        | 'InterfaceRealization'
        | 'PackageImport'
        | 'PackageMerge'
        | 'Realization'
        | 'Substitution'
        | 'Usage';
    fromId: string;
    toId: string;
    label: string;
    sourceMultiplicity?: Multiplicity;
    targetMultiplicity?: Multiplicity;
};

export type Node = {
    id: string;
    name: string;
    // see server/app/src/main/java/com/borkdominik/big/glsp/uml/uml/UMLTypes.java
    type: 'AbstractClass' | 'Class' | 'DataType' | 'Enumeration' | 'Interface' | 'PrimitiveType' | 'Package';
    properties: Property[];
    operations: Operation[];
    enumerationLiterals: string[];
    comment: string;
};

export type Property = {
    name: string;
    type: string;
    accessModifier: '+' | '-' | '#' | '';
    resolvedType?: string;
};

export type Operation = {
    name: string;
    type: string;
    accessModifier: '+' | '-' | '#' | '';
    attributes: Attribute[];
};

export type Attribute = {
    name: string;
    type: string;
};

export type Multiplicity = {
    lower: number;
    upper: number | '*';
};
