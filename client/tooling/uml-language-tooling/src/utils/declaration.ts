/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type Declaration } from '../types/index.js';

/**
 * Extracts the type names from a type alias declaration's synthetic property.
 * For example, `type ClassDiagramNodes = Enumeration | Class | Interface`
 * returns `['Enumeration', 'Class', 'Interface']`.
 */
export function extractTypeNames(typeDecl: Declaration | undefined): string[] {
    if (!typeDecl?.properties?.[0]?.types) {
        return [];
    }
    return typeDecl.properties[0].types.map(t => t.typeName).filter(Boolean) as string[];
}

/**
 * Returns all diagram container declarations (e.g., `ClassDiagram`, `ActivityDiagram`).
 * Excludes the root `Diagram` class itself.
 */
export function getDiagramDeclarations(declarations: Declaration[]): Declaration[] {
    return declarations.filter(d => d.type === 'class' && d.name !== 'Diagram' && d.name?.endsWith('Diagram'));
}

/**
 * Recursively resolves type alias members to concrete type names.
 * For example, `ClassDiagramElements = ClassDiagramNodes | ClassDiagramEdges`
 * where `ClassDiagramNodes = Enumeration | Class` resolves to `['Enumeration', 'Class', ...]`.
 */
export function resolveTypeAliasMembers(alias: Declaration, declarations: Declaration[]): string[] {
    const typeAliasMap = new Map(declarations.filter(d => d.type === 'type').map(d => [d.name!, d]));
    return resolveMembers(alias, typeAliasMap);
}

function resolveMembers(alias: Declaration, typeAliasMap: Map<string, Declaration>): string[] {
    const directMembers = alias.properties?.[0]?.types.map(t => t.typeName).filter(Boolean) ?? [];
    const resolved: string[] = [];

    for (const name of directMembers) {
        const nested = typeAliasMap.get(name);
        if (nested) {
            resolved.push(...resolveMembers(nested, typeAliasMap));
        } else {
            resolved.push(name);
        }
    }

    return resolved;
}

/**
 * Returns concrete element declarations — non-abstract classes that are not
 * the root `Diagram`, diagram containers, meta info types, or relation base classes.
 */
export function getConcreteElements(declarations: Declaration[]): Declaration[] {
    return declarations.filter(
        d =>
            d.type === 'class' &&
            !d.isAbstract &&
            d.name !== 'Diagram' &&
            !d.name!.endsWith('Diagram') &&
            !(d.extends ?? []).includes('MetaInfo')
    );
}

/**
 * Checks if a type alias declaration consists entirely of string constant values
 * (e.g., `type Visibility = 'PUBLIC' | 'PRIVATE' | 'PROTECTED'`).
 */
export function isOptionType(typeDecl: Declaration | undefined): boolean {
    if (!typeDecl || typeDecl.type !== 'type') return false;
    const types = typeDecl.properties?.[0]?.types ?? [];
    return types.length > 0 && types.every(t => t.type === 'constant');
}
