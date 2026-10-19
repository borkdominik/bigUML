/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

/**
 * A small, dependency-free, seedable pseudo-random number generator.
 *
 * Generation strategies depend on this interface (never on `Math.random`) so that
 * generated test data is reproducible: the same seed always yields the same values.
 * This is what makes the strategies unit-testable with exact assertions.
 */
export interface Rng {
    /** Next float in the half-open interval [0, 1). */
    next(): number;
    /** Integer in the inclusive interval [min, max]. */
    int(min: number, max: number): number;
    /** Float in the half-open interval [min, max), rounded to `decimals` places. */
    float(min: number, max: number, decimals?: number): number;
    /** A random element of a non-empty array. */
    pick<T>(items: readonly T[]): T;
    /** A random boolean. */
    bool(): boolean;
}

/**
 * Creates a deterministic {@link Rng} from a numeric seed using the `mulberry32`
 * algorithm — a compact, well-distributed 32-bit generator that is more than
 * sufficient for synthetic test-data generation.
 */
export function createRng(seed: number): Rng {
    let state = seed >>> 0;

    const next = (): number => {
        state = (state + 0x6d2b79f5) | 0;
        let t = Math.imul(state ^ (state >>> 15), 1 | state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    return {
        next,
        int: (min, max) => min + Math.floor(next() * (max - min + 1)),
        float: (min, max, decimals = 2) => {
            const factor = 10 ** decimals;
            return Math.round((min + next() * (max - min)) * factor) / factor;
        },
        pick: items => items[Math.floor(next() * items.length)],
        bool: () => next() < 0.5
    };
}
