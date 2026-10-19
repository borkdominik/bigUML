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
import { RandomStrategy } from '../src/env/glsp-server/strategies/random.strategy.js';
import { createRng } from '../src/env/glsp-server/strategies/rng.js';
import { type PropertyDescriptor, type ValueContext } from '../src/env/glsp-server/strategies/strategy.js';

const strategy = new RandomStrategy();

function ctx(seed: number, index = 1): ValueContext {
    return { rng: createRng(seed), index };
}

function prop(over: Partial<PropertyDescriptor> & Pick<PropertyDescriptor, 'typeKind'>): PropertyDescriptor {
    return { name: 'field', ...over };
}

describe('RandomStrategy', () => {
    it('declares its kind', () => {
        assert.equal(strategy.kind, 'random');
    });

    it('generates a string value containing the property name and instance index', () => {
        const v = strategy.value(prop({ name: 'username', typeKind: 'string' }), ctx(1, 3));
        assert.equal(typeof v, 'string');
        assert.ok(v !== undefined);
        assert.match(v, /username/);
        assert.match(v, /3/);
    });

    it('generates an integer-parseable value within range', () => {
        const v = strategy.value(prop({ typeKind: 'integer' }), ctx(1));
        const n = Number(v);
        assert.ok(Number.isInteger(n) && n >= 0 && n <= 100, `got ${v}`);
    });

    it('generates a boolean string', () => {
        const v = strategy.value(prop({ typeKind: 'boolean' }), ctx(1));
        assert.ok(v === 'true' || v === 'false', `got ${v}`);
    });

    it('generates a real-parseable value', () => {
        const v = strategy.value(prop({ typeKind: 'real' }), ctx(1));
        assert.ok(v !== undefined && !Number.isNaN(Number(v)), `got ${v}`);
    });

    it('picks one of the enumeration literals', () => {
        const literals = ['ADMIN', 'USER', 'GUEST'];
        const v = strategy.value(prop({ typeKind: 'enumeration', enumLiterals: literals }), ctx(1));
        assert.ok(v !== undefined && literals.includes(v), `got ${v}`);
    });

    it('returns undefined for an enumeration with no literals', () => {
        assert.equal(strategy.value(prop({ typeKind: 'enumeration', enumLiterals: [] }), ctx(1)), undefined);
    });

    it('returns undefined for reference types (handled by link generation)', () => {
        assert.equal(strategy.value(prop({ typeKind: 'reference' }), ctx(1)), undefined);
    });

    it('generates a string for untyped (unknown) properties so the slot is still filled', () => {
        const v = strategy.value(prop({ name: 'employeeId', typeKind: 'unknown' }), ctx(1, 2));
        assert.equal(typeof v, 'string');
        assert.ok(v !== undefined && v.length > 0, `got ${v}`);
    });

    it('is deterministic for the same seed, property and index', () => {
        const p = prop({ name: 'email', typeKind: 'string' });
        assert.equal(strategy.value(p, ctx(99, 2)), strategy.value(p, ctx(99, 2)));
    });
});
