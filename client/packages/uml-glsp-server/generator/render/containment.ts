/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { type Declaration, isValueProperty, Multiplicity, resolveTypeAliasMembers } from '@borkdominik-biguml/uml-language-tooling';

/** One containment property of a declaration and the concrete child types it may hold. */
export interface Containment {
    property: string;
    childTypes: string[];
}

/**
 * The containment properties of a declaration: every array-valued property of a complex type, with
 * the type resolved to the concrete declarations it admits - a type alias to its members, a base
 * class to the classes extending it, and a concrete class to itself. A list of values - an edge's
 * `routingPoints` - is part of the element holding it, not containment.
 */
export function resolveContainment(decl: Declaration, declarations: Declaration[]): Containment[] {
    const containment: Containment[] = [];

    for (const prop of decl.properties ?? []) {
        const isArray = prop.multiplicity === Multiplicity.ZERO_TO_N || prop.multiplicity === Multiplicity.ONE_TO_N;
        const type = prop.types[0];
        if (!isArray || type?.type !== 'complex' || isValueProperty(prop, declarations)) {
            continue;
        }
        containment.push({ property: prop.name, childTypes: resolveChildTypes(type.typeName, declarations) });
    }

    return containment;
}

function resolveChildTypes(typeName: string, declarations: Declaration[]): string[] {
    const alias = declarations.find(d => d.type === 'type' && d.name === typeName);
    if (alias) {
        return resolveTypeAliasMembers(alias, declarations);
    }
    const subclasses = declarations.filter(d => d.extends?.includes(typeName)).map(d => d.name!);
    return subclasses.length > 0 ? subclasses : [typeName];
}
