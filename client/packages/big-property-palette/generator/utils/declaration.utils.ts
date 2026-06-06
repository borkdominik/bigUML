/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import {
    type Declaration,
    Decorator,
    extractTypeNames,
    getConcreteElements,
    getDiagramDeclarations,
    toConstant
} from '@borkdominik-biguml/uml-language-tooling';

export function getNodeDecls(decls: Declaration[]): Declaration[] {
    return getConcreteElements(decls);
}

/**
 * Finds which diagram an element belongs to by checking the XxxDiagramNodes type union.
 * Returns the diagram prefix (e.g., 'Deployment' for DeploymentDiagram).
 * Falls back to 'Class' if no match is found.
 */
export function getDiagramForElement(elementName: string, declarations: Declaration[]): string {
    const diagramDecls = getDiagramDeclarations(declarations);

    for (const diagramDecl of diagramDecls) {
        const diagramName = diagramDecl.name!.replace(/Diagram$/, '');
        const nodeTypeAlias = declarations.find(d => d.type === 'type' && d.name === `${diagramName}DiagramNodes`);
        const nodeNames = extractTypeNames(nodeTypeAlias);
        if (nodeNames.includes(elementName)) {
            return diagramName;
        }
    }

    return 'Class';
}

export function getDynamicPropertyTypes(decl: Declaration): string[] {
    return Array.from(
        new Set(
            decl.properties
                ?.flatMap(p => {
                    const dec = Decorator.find(p.decorators, 'dynamic');
                    return dec ? [Decorator.getArg<string>(dec) ?? ''] : [];
                })
                .filter(Boolean) ?? []
        )
    );
}

/**
 * Checks if a type name corresponds to an enum-like type alias with constant values
 * (e.g., Visibility, AggregationType). Returns the PropertyPaletteChoices key if so.
 */
export function optionConstant(typeName: string, declarations: Declaration[]): string | undefined {
    const typeDecl = declarations.find(d => d.type === 'type' && d.name === typeName);
    if (!typeDecl) return undefined;
    const types = typeDecl.properties?.[0]?.types ?? [];
    if (types.length > 0 && types.every(t => t.type === 'constant')) {
        const stripped = typeName.replace(/Type$/, '');
        return toConstant(stripped);
    }
    return undefined;
}

/**
 * Determines if an element type is an edge (extends Edge or Relation).
 */
export function isEdgeType(typeName: string, declarations: Declaration[]): boolean {
    const decl = declarations.find(d => d.type === 'class' && d.name === typeName);
    if (!decl) return false;
    const exts = decl.extends ?? [];
    if (exts.includes('Edge') || exts.includes('Relation')) return true;
    for (const ext of exts) {
        if (isEdgeType(ext, declarations)) return true;
    }
    return false;
}

/**
 * Checks if a type is abstract or not a concrete element in any diagram.
 */
export function isAbstractType(typeName: string, declarations: Declaration[]): boolean {
    const decl = declarations.find(d => d.type === 'class' && d.name === typeName);
    if (!decl) return true;
    return !!decl.isAbstract;
}

/**
 * Checks if an element exists in a diagram's node or edge type union.
 */
export function isInDiagramTypes(typeName: string, diagramName: string, declarations: Declaration[]): boolean {
    const nodeAlias = declarations.find(d => d.type === 'type' && d.name === `${diagramName}DiagramNodes`);
    const edgeAlias = declarations.find(d => d.type === 'type' && d.name === `${diagramName}DiagramEdges`);
    const nodeNames = extractTypeNames(nodeAlias);
    const edgeNames = extractTypeNames(edgeAlias);
    return nodeNames.includes(typeName) || edgeNames.includes(typeName);
}
