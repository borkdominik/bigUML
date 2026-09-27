// AUTO-GENERATED – DO NOT EDIT
/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { DefaultTypes } from '@eclipse-glsp/server';
import { representationTemplateTypeId, representationTypeId } from '../../../env/common/model/model-type-utils.js';
import { AstTypeUtils } from '../../../env/common/model/model-type-utils.js';

export namespace ClassDiagramNodeTypes {
    export const ENUMERATION = representationTypeId('Class', DefaultTypes.NODE, 'Enumeration');
    export const ENUMERATION_LITERAL = representationTypeId('Class', DefaultTypes.NODE, 'EnumerationLiteral');
    export const CLASS = representationTypeId('Class', DefaultTypes.NODE, 'Class');
    export const INTERFACE = representationTypeId('Class', DefaultTypes.NODE, 'Interface');
    export const PACKAGE = representationTypeId('Class', DefaultTypes.NODE, 'Package');
    export const PROPERTY = representationTypeId('Class', DefaultTypes.NODE, 'Property');
    export const OPERATION = representationTypeId('Class', DefaultTypes.NODE, 'Operation');
    export const PARAMETER = representationTypeId('Class', DefaultTypes.NODE, 'Parameter');
    export const DATA_TYPE = representationTypeId('Class', DefaultTypes.NODE, 'DataType');
    export const PRIMITIVE_TYPE = representationTypeId('Class', DefaultTypes.NODE, 'PrimitiveType');
    export const INSTANCE_SPECIFICATION = representationTypeId('Class', DefaultTypes.NODE, 'InstanceSpecification');
    export const SLOT = representationTypeId('Class', DefaultTypes.NODE, 'Slot');
    export const LITERAL_SPECIFICATION = representationTypeId('Class', DefaultTypes.NODE, 'LiteralSpecification');
    export const NARY_ASSOCIATION = representationTypeId('Class', DefaultTypes.NODE, 'NaryAssociation');
    export const NOTE = representationTypeId('Class', DefaultTypes.NODE, 'Note');
    export const TEXT_LABEL = representationTypeId('Class', DefaultTypes.NODE, 'TextLabel');
    export const EDGE_ANCHOR = representationTypeId('Class', DefaultTypes.NODE, 'EdgeAnchor');
}

export namespace ClassDiagramEdgeTypes {
    export const ABSTRACTION = representationTypeId('Class', DefaultTypes.EDGE, 'Abstraction');
    export const DEPENDENCY = representationTypeId('Class', DefaultTypes.EDGE, 'Dependency');
    export const ASSOCIATION = representationTypeId('Class', DefaultTypes.EDGE, 'Association');
    export const AGGREGATION = representationTemplateTypeId('Class', DefaultTypes.EDGE, 'aggregation', 'Association');
    export const COMPOSITION = representationTemplateTypeId('Class', DefaultTypes.EDGE, 'composition', 'Association');
    export const ELEMENT_IMPORT = representationTypeId('Class', DefaultTypes.EDGE, 'ElementImport');
    export const INTERFACE_REALIZATION = representationTypeId('Class', DefaultTypes.EDGE, 'InterfaceRealization');
    export const GENERALIZATION = representationTypeId('Class', DefaultTypes.EDGE, 'Generalization');
    export const PACKAGE_IMPORT = representationTypeId('Class', DefaultTypes.EDGE, 'PackageImport');
    export const PACKAGE_MERGE = representationTypeId('Class', DefaultTypes.EDGE, 'PackageMerge');
    export const REALIZATION = representationTypeId('Class', DefaultTypes.EDGE, 'Realization');
    export const SUBSTITUTION = representationTypeId('Class', DefaultTypes.EDGE, 'Substitution');
    export const USAGE = representationTypeId('Class', DefaultTypes.EDGE, 'Usage');
    export const GENERIC_EDGE = representationTypeId('Class', DefaultTypes.EDGE, 'GenericEdge');
}

export namespace ClassDiagramModelTypes {
    // re-export nodes
    export const ENUMERATION = ClassDiagramNodeTypes.ENUMERATION;
    export const ENUMERATION_LITERAL = ClassDiagramNodeTypes.ENUMERATION_LITERAL;
    export const CLASS = ClassDiagramNodeTypes.CLASS;
    export const INTERFACE = ClassDiagramNodeTypes.INTERFACE;
    export const PACKAGE = ClassDiagramNodeTypes.PACKAGE;
    export const PROPERTY = ClassDiagramNodeTypes.PROPERTY;
    export const OPERATION = ClassDiagramNodeTypes.OPERATION;
    export const PARAMETER = ClassDiagramNodeTypes.PARAMETER;
    export const DATA_TYPE = ClassDiagramNodeTypes.DATA_TYPE;
    export const PRIMITIVE_TYPE = ClassDiagramNodeTypes.PRIMITIVE_TYPE;
    export const INSTANCE_SPECIFICATION = ClassDiagramNodeTypes.INSTANCE_SPECIFICATION;
    export const SLOT = ClassDiagramNodeTypes.SLOT;
    export const LITERAL_SPECIFICATION = ClassDiagramNodeTypes.LITERAL_SPECIFICATION;
    export const NARY_ASSOCIATION = ClassDiagramNodeTypes.NARY_ASSOCIATION;
    export const NOTE = ClassDiagramNodeTypes.NOTE;
    export const TEXT_LABEL = ClassDiagramNodeTypes.TEXT_LABEL;
    export const EDGE_ANCHOR = ClassDiagramNodeTypes.EDGE_ANCHOR;

    // re-export edges
    export const ABSTRACTION = ClassDiagramEdgeTypes.ABSTRACTION;
    export const DEPENDENCY = ClassDiagramEdgeTypes.DEPENDENCY;
    export const ASSOCIATION = ClassDiagramEdgeTypes.ASSOCIATION;
    export const AGGREGATION = ClassDiagramEdgeTypes.AGGREGATION;
    export const COMPOSITION = ClassDiagramEdgeTypes.COMPOSITION;
    export const ELEMENT_IMPORT = ClassDiagramEdgeTypes.ELEMENT_IMPORT;
    export const INTERFACE_REALIZATION = ClassDiagramEdgeTypes.INTERFACE_REALIZATION;
    export const GENERALIZATION = ClassDiagramEdgeTypes.GENERALIZATION;
    export const PACKAGE_IMPORT = ClassDiagramEdgeTypes.PACKAGE_IMPORT;
    export const PACKAGE_MERGE = ClassDiagramEdgeTypes.PACKAGE_MERGE;
    export const REALIZATION = ClassDiagramEdgeTypes.REALIZATION;
    export const SUBSTITUTION = ClassDiagramEdgeTypes.SUBSTITUTION;
    export const USAGE = ClassDiagramEdgeTypes.USAGE;
    export const GENERIC_EDGE = ClassDiagramEdgeTypes.GENERIC_EDGE;
}

export namespace ClassAstTypes {
    const aliases: Record<string, string> = {
        [ClassDiagramModelTypes.AGGREGATION]: 'Association',
        [ClassDiagramModelTypes.COMPOSITION]: 'Association'
    };

    const typeMap: Record<string, string> = {
        Enumeration: ClassDiagramModelTypes.ENUMERATION,
        EnumerationLiteral: ClassDiagramModelTypes.ENUMERATION_LITERAL,
        Class: ClassDiagramModelTypes.CLASS,
        Interface: ClassDiagramModelTypes.INTERFACE,
        Package: ClassDiagramModelTypes.PACKAGE,
        Property: ClassDiagramModelTypes.PROPERTY,
        Operation: ClassDiagramModelTypes.OPERATION,
        Parameter: ClassDiagramModelTypes.PARAMETER,
        DataType: ClassDiagramModelTypes.DATA_TYPE,
        PrimitiveType: ClassDiagramModelTypes.PRIMITIVE_TYPE,
        InstanceSpecification: ClassDiagramModelTypes.INSTANCE_SPECIFICATION,
        Slot: ClassDiagramModelTypes.SLOT,
        LiteralSpecification: ClassDiagramModelTypes.LITERAL_SPECIFICATION,
        NaryAssociation: ClassDiagramModelTypes.NARY_ASSOCIATION,
        Note: ClassDiagramModelTypes.NOTE,
        TextLabel: ClassDiagramModelTypes.TEXT_LABEL,
        EdgeAnchor: ClassDiagramModelTypes.EDGE_ANCHOR,
        Abstraction: ClassDiagramModelTypes.ABSTRACTION,
        Dependency: ClassDiagramModelTypes.DEPENDENCY,
        Association: ClassDiagramModelTypes.ASSOCIATION,
        ElementImport: ClassDiagramModelTypes.ELEMENT_IMPORT,
        InterfaceRealization: ClassDiagramModelTypes.INTERFACE_REALIZATION,
        Generalization: ClassDiagramModelTypes.GENERALIZATION,
        PackageImport: ClassDiagramModelTypes.PACKAGE_IMPORT,
        PackageMerge: ClassDiagramModelTypes.PACKAGE_MERGE,
        Realization: ClassDiagramModelTypes.REALIZATION,
        Substitution: ClassDiagramModelTypes.SUBSTITUTION,
        Usage: ClassDiagramModelTypes.USAGE,
        GenericEdge: ClassDiagramModelTypes.GENERIC_EDGE
    };

    export function convertToAst(elementId: string): string {
        if (aliases[elementId]) {
            return aliases[elementId];
        }
        return AstTypeUtils.stripPrefix(elementId);
    }

    export function convertToElementType(astType: string): string {
        const elementType = typeMap[astType];
        if (!elementType) {
            throw new Error(`[ClassAstTypes] No element type found for AST type '${astType}'`);
        }
        return elementType;
    }
}
