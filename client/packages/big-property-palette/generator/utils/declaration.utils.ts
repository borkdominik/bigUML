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
    resolveTypeAliasMembers,
    toConstant
} from '@borkdominik-biguml/uml-language-tooling';

/**
 * The elements a handler is generated for. An aliased class is not one: it is stored as the type it
 * aliases, so it has no AST type of its own and is edited by that type's handler.
 */
export function getNodeDecls(decls: Declaration[]): Declaration[] {
    return getConcreteElements(decls).filter(decl => !Decorator.has(decl.decorators, 'alias'));
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

/** A property whose choices are the elements of the model its declared type admits. */
export interface DynamicProperty {
    /** The name given to `@PropertyPalette.dynamic`, which names the choice list in the generated handler. */
    typeName: string;
    /** The concrete AST types the property may refer to, resolved from its declared type. */
    memberTypes: string[];
}

export function getDynamicProperties(decl: Declaration, declarations: Declaration[]): DynamicProperty[] {
    const byName = new Map<string, DynamicProperty>();
    for (const property of decl.properties ?? []) {
        const dynamic = Decorator.find(property.decorators, 'dynamic');
        const typeName = dynamic ? Decorator.getArg<string>(dynamic) : undefined;
        if (!typeName) {
            continue;
        }
        const memberTypes = property.types.flatMap(type => {
            const alias = declarations.find(d => d.type === 'type' && d.name === type.typeName);
            return alias ? resolveTypeAliasMembers(alias, declarations) : [type.typeName];
        });
        const existing = byName.get(typeName);
        byName.set(typeName, { typeName, memberTypes: Array.from(new Set([...(existing?.memberTypes ?? []), ...memberTypes])) });
    }
    return [...byName.values()];
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
