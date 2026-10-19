/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import assert from 'node:assert/strict';
import { describe, it } from 'vitest';
import { RealisticStrategy } from '../src/env/glsp-server/strategies/realistic.strategy.js';
import { createRng } from '../src/env/glsp-server/strategies/rng.js';
import { type PropertyDescriptor, type ValueContext } from '../src/env/glsp-server/strategies/strategy.js';

function ctx(seed = 1, index = 1): ValueContext {
    return { rng: createRng(seed), index };
}

function prop(name: string, over: Partial<PropertyDescriptor> = {}): PropertyDescriptor {
    return { name, typeKind: 'string', ...over };
}

describe('RealisticStrategy (Faker-backed)', () => {
    it('declares its kind', () => {
        assert.equal(new RealisticStrategy(1).kind, 'realistic');
    });

    it('generates an email-looking value for email properties', () => {
        const v = new RealisticStrategy(1).value(prop('email'), ctx());
        assert.ok(v !== undefined && /.+@.+/.test(v), `got ${v}`);
    });

    it('generates a non-empty value for name properties', () => {
        const v = new RealisticStrategy(1).value(prop('fullName'), ctx());
        assert.ok(v !== undefined && v.trim().length > 0, `got ${v}`);
    });

    it('picks an enumeration literal', () => {
        const literals = ['ADMIN', 'USER', 'GUEST'];
        const v = new RealisticStrategy(1).value(prop('role', { typeKind: 'enumeration', enumLiterals: literals }), ctx());
        assert.ok(v !== undefined && literals.includes(v), `got ${v}`);
    });

    it('returns undefined for reference types (handled by links)', () => {
        assert.equal(new RealisticStrategy(1).value(prop('owner', { typeKind: 'reference' }), ctx()), undefined);
    });

    it('generates an integer-parseable value for integer typeKind', () => {
        const v = new RealisticStrategy(1).value(prop('age', { typeKind: 'integer' }), ctx());
        assert.ok(v !== undefined && Number.isInteger(Number(v)), `got ${v}`);
    });

    it('fills untyped (unknown) properties with a non-empty value', () => {
        const v = new RealisticStrategy(1).value(prop('department', { typeKind: 'unknown' }), ctx());
        assert.ok(v !== undefined && v.length > 0, `got ${v}`);
    });

    it('generates numeric values for salary/teamSize-style untyped fields', () => {
        const strategy = new RealisticStrategy(1);
        const salary = strategy.value(prop('salary', { typeKind: 'unknown' }), ctx());
        const teamSize = strategy.value(prop('teamSize', { typeKind: 'unknown' }), ctx());
        assert.ok(salary !== undefined && Number.isFinite(Number(salary)), `salary=${salary}`);
        assert.ok(teamSize !== undefined && Number.isFinite(Number(teamSize)), `teamSize=${teamSize}`);
    });

    it('generates a non-empty department name', () => {
        const v = new RealisticStrategy(1).value(prop('department', { typeKind: 'unknown' }), ctx());
        assert.ok(v !== undefined && v.trim().length > 0, `got ${v}`);
    });

    it('is deterministic for the same seed', () => {
        const a = new RealisticStrategy(42).value(prop('fullName'), ctx());
        const b = new RealisticStrategy(42).value(prop('fullName'), ctx());
        assert.equal(a, b);
    });

    it('generates a spread of years for *year fields (so isUnique can be satisfied)', () => {
        const strategy = new RealisticStrategy(7);
        const years = Array.from({ length: 6 }, () => strategy.value(prop('birthYear', { typeKind: 'unknown' }), ctx()));
        for (const year of years) {
            assert.match(year ?? '', /^\d{4}$/, `expected a 4-digit year, got ${year}`);
        }
        assert.ok(new Set(years).size >= 4, `expected varied years, got ${JSON.stringify(years)}`);
    });
});
