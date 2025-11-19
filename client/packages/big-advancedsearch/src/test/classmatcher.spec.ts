/* eslint-disable header/header */

/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { describe, expect, it } from 'vitest';
import { ClassDiagramMatcher } from '../vscode/matchers/classmatcher.js';

// Build a minimal UML-ish model in the shape the matcher expects
function makeModel() {
    const foo = {
        id: 'c1',
        eClass: 'uml#//Class',
        name: 'Foo',
        ownedAttribute: [
            { id: 'p1', name: 'x', type: { $ref: 'c2' } } // points to Bar
        ],
        ownedOperation: [{ id: 'm1', name: 'op' }],
        generalization: [
            { id: 'g1', general: { $ref: 'c2' } } // Foo -> Bar
        ]
    };

    const bar = {
        id: 'c2',
        eClass: 'uml#//Class',
        name: 'Bar',
        ownedAttribute: [
            { id: 'p2', name: 'y', type: { $ref: 'c1' } } // points to Foo (not required, but handy)
        ]
    };

    // Association between Foo.x (p1) and Bar.y (p2)
    const assoc = {
        id: 'a1',
        eClass: 'uml#//Association',
        memberEnd: [{ $ref: 'p1' }, { $ref: 'p2' }]
    };

    // Binary relation (Dependency) Foo -> Bar
    const dependency = {
        id: 'd1',
        eClass: 'uml#//Dependency',
        client: [{ $ref: 'c1' }],
        supplier: [{ $ref: 'c2' }]
    };

    // Enumeration with literal
    const colorEnum = {
        id: 'e1',
        eClass: 'uml#//Enumeration',
        name: 'Color',
        ownedLiteral: [{ id: 'lit1', name: 'RED' }]
    };

    return {
        getSourceModel() {
            return { packagedElement: [foo, bar, assoc, dependency, colorEnum] };
        }
    };
}

describe('ClassDiagramMatcher (unit)', () => {
    it('supports() and supportsPartial() behave for known types', () => {
        const m = new ClassDiagramMatcher();
        expect(m.supports('class')).toBe(true);
        expect(m.supports('Interface')).toBe(true);
        expect(m.supports('notatype')).toBe(false);

        expect(m.supportsPartial('cla')).toBe(true);
        expect(m.supportsPartial('inter')).toBe(true);
        expect(m.supportsPartial('zzz')).toBe(false);
    });

    it('collects classes, members, literals, and resolves relations', () => {
        const matcher = new ClassDiagramMatcher();
        const results = matcher.match(makeModel());

        const by = (t: string) => results.filter(r => r.type === t).map(r => r.name);

        // Classes
        expect(by('Class')).toEqual(expect.arrayContaining(['Foo', 'Bar']));

        // Members
        expect(by('Attribute')).toEqual(expect.arrayContaining(['x', 'y']));
        expect(by('Method')).toContain('op');

        // Enumeration literal
        expect(by('Literal')).toContain('RED');

        // Generalization (Foo -> Bar)
        const gens = results.filter(r => r.type === 'Generalization').map(r => r.name);
        expect(gens).toContain('Foo → Bar');

        // Association name should resolve class names from property -> type mapping.
        // Make the assertion order-agnostic ("Foo — Bar" or "Bar — Foo").
        const assocs = results.filter(r => r.type === 'Association').map(r => r.name);
        const normalized = assocs.map(n => n.split(' — ').sort().join(' — '));
        expect(normalized).toContain('Bar — Foo'.split(' — ').sort().join(' — '));

        // Binary relation (Dependency) formatted as "Foo → Bar"
        const deps = results.filter(r => r.type === 'Dependency').map(r => r.name);
        expect(deps).toContain('Foo → Bar');
    });
});
