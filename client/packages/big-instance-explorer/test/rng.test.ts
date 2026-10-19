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
import { createRng } from '../src/env/glsp-server/strategies/rng.js';

describe('createRng', () => {
    it('is deterministic for a given seed', () => {
        const a = createRng(42);
        const b = createRng(42);
        const seqA = [a.next(), a.next(), a.next()];
        const seqB = [b.next(), b.next(), b.next()];
        assert.deepEqual(seqA, seqB);
    });

    it('produces different sequences for different seeds', () => {
        const a = createRng(1);
        const b = createRng(2);
        assert.notEqual(a.next(), b.next());
    });

    it('next() stays in [0, 1)', () => {
        const rng = createRng(7);
        for (let i = 0; i < 200; i++) {
            const v = rng.next();
            assert.ok(v >= 0 && v < 1, `value ${v} out of range`);
        }
    });

    it('int() stays within inclusive bounds and hits both ends', () => {
        const rng = createRng(123);
        const seen = new Set<number>();
        for (let i = 0; i < 500; i++) {
            const v = rng.int(5, 10);
            assert.ok(Number.isInteger(v) && v >= 5 && v <= 10, `value ${v} out of range`);
            seen.add(v);
        }
        assert.ok(seen.has(5) && seen.has(10), 'expected inclusive bounds to be reachable');
    });

    it('pick() returns an element of the array', () => {
        const rng = createRng(9);
        const items = ['a', 'b', 'c'] as const;
        for (let i = 0; i < 50; i++) {
            assert.ok(items.includes(rng.pick(items)));
        }
    });

    it('bool() returns a boolean', () => {
        const rng = createRng(3);
        assert.equal(typeof rng.bool(), 'boolean');
    });
});
