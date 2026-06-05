/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { type Declaration, Decorator, getConcreteElements, toConstant } from '@borkdominik-biguml/uml-language-tooling';

export function getNodeDecls(decls: Declaration[]): Declaration[] {
    return getConcreteElements(decls);
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
 * (e.g., Visibility, AggregationType). Returns the CONSTANT_CASE name if so.
 */
export function optionConstant(typeName: string, declarations: Declaration[]): string | undefined {
    const typeDecl = declarations.find(d => d.type === 'type' && d.name === typeName);
    if (!typeDecl) return undefined;
    const types = typeDecl.properties?.[0]?.types ?? [];
    if (types.length > 0 && types.every(t => t.type === 'constant')) {
        return toConstant(typeName);
    }
    return undefined;
}
