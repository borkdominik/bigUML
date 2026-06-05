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
import { representationTypeId } from '../../../env/common/model/model-type-utils.js';
import { AstTypeUtils } from '../../../env/common/model/model-type-utils.js';

export namespace PackageDiagramNodeTypes {
    export const PACKAGE = representationTypeId('Package', DefaultTypes.NODE, 'Package');
    export const CLASS = representationTypeId('Package', DefaultTypes.NODE, 'Class');
    export const PROPERTY = representationTypeId('Package', DefaultTypes.NODE, 'Property');
    export const OPERATION = representationTypeId('Package', DefaultTypes.NODE, 'Operation');
    export const PARAMETER = representationTypeId('Package', DefaultTypes.NODE, 'Parameter');
}

export namespace PackageDiagramEdgeTypes {
    export const PACKAGE_IMPORT = representationTypeId('Package', DefaultTypes.EDGE, 'PackageImport');
    export const PACKAGE_MERGE = representationTypeId('Package', DefaultTypes.EDGE, 'PackageMerge');
    export const ELEMENT_IMPORT = representationTypeId('Package', DefaultTypes.EDGE, 'ElementImport');
    export const DEPENDENCY = representationTypeId('Package', DefaultTypes.EDGE, 'Dependency');
    export const ABSTRACTION = representationTypeId('Package', DefaultTypes.EDGE, 'Abstraction');
    export const USAGE = representationTypeId('Package', DefaultTypes.EDGE, 'Usage');
}

export namespace PackageDiagramModelTypes {
    // re-export nodes
    export const PACKAGE = PackageDiagramNodeTypes.PACKAGE;
    export const CLASS = PackageDiagramNodeTypes.CLASS;
    export const PROPERTY = PackageDiagramNodeTypes.PROPERTY;
    export const OPERATION = PackageDiagramNodeTypes.OPERATION;
    export const PARAMETER = PackageDiagramNodeTypes.PARAMETER;

    // re-export edges
    export const PACKAGE_IMPORT = PackageDiagramEdgeTypes.PACKAGE_IMPORT;
    export const PACKAGE_MERGE = PackageDiagramEdgeTypes.PACKAGE_MERGE;
    export const ELEMENT_IMPORT = PackageDiagramEdgeTypes.ELEMENT_IMPORT;
    export const DEPENDENCY = PackageDiagramEdgeTypes.DEPENDENCY;
    export const ABSTRACTION = PackageDiagramEdgeTypes.ABSTRACTION;
    export const USAGE = PackageDiagramEdgeTypes.USAGE;
}

export namespace PackageAstTypes {
    const typeMap: Record<string, string> = {
        Package: PackageDiagramModelTypes.PACKAGE,
        Class: PackageDiagramModelTypes.CLASS,
        Property: PackageDiagramModelTypes.PROPERTY,
        Operation: PackageDiagramModelTypes.OPERATION,
        Parameter: PackageDiagramModelTypes.PARAMETER,
        PackageImport: PackageDiagramModelTypes.PACKAGE_IMPORT,
        PackageMerge: PackageDiagramModelTypes.PACKAGE_MERGE,
        ElementImport: PackageDiagramModelTypes.ELEMENT_IMPORT,
        Dependency: PackageDiagramModelTypes.DEPENDENCY,
        Abstraction: PackageDiagramModelTypes.ABSTRACTION,
        Usage: PackageDiagramModelTypes.USAGE
    };

    export function convertToAst(elementId: string): string {
        return AstTypeUtils.stripPrefix(elementId);
    }

    export function convertToElementType(astType: string): string {
        const elementType = typeMap[astType];
        if (!elementType) {
            throw new Error(`[PackageAstTypes] No element type found for AST type '${astType}'`);
        }
        return elementType;
    }
}
