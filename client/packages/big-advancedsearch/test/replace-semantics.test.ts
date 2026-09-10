/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { describe, expect, it } from 'vitest';
import { applyReplacement, escapeRegexPattern } from '../src/env/common/replace-semantics.js';

describe('applyReplacement', () => {
    it('replaces a literal substring', () => {
        expect(applyReplacement('UserService', 'User', 'Customer')).toBe('CustomerService');
    });

    it('replaces every occurrence', () => {
        expect(applyReplacement('UserUser', 'User', 'X')).toBe('XX');
    });

    it('is case-insensitive by default', () => {
        expect(applyReplacement('userService', 'User', 'Customer')).toBe('CustomerService');
    });

    it('is case-insensitive when caseSensitive is explicitly false', () => {
        expect(applyReplacement('userService', 'User', 'Customer', false)).toBe('CustomerService');
    });

    it('respects caseSensitive = true', () => {
        expect(applyReplacement('userService', 'User', 'Customer', true)).toBe('userService');
        expect(applyReplacement('UserService', 'User', 'Customer', true)).toBe('CustomerService');
    });

    it('returns the value unchanged for an empty pattern', () => {
        expect(applyReplacement('User', '', 'X')).toBe('User');
    });

    it('treats regex metacharacters in the pattern literally', () => {
        expect(applyReplacement('a.b', 'a.b', 'X')).toBe('X');
        expect(applyReplacement('axb', 'a.b', 'X')).toBe('axb');
        expect(applyReplacement('f(x)', '(x)', '[y]')).toBe('f[y]');
    });

    it('treats $ in the replacement literally', () => {
        expect(applyReplacement('price', 'price', 'cost$')).toBe('cost$');
        expect(applyReplacement('price', 'price', '$&Total')).toBe('$&Total');
        expect(applyReplacement('price', 'price', '$1')).toBe('$1');
        expect(applyReplacement('price', 'price', "$'")).toBe("$'");
    });
});

describe('escapeRegexPattern', () => {
    it('escapes all RegExp metacharacters', () => {
        const special = '.*+?^${}()|[]\\';
        const re = new RegExp(escapeRegexPattern(special));
        expect(re.test(special)).toBe(true);
        expect(re.test('anything-else')).toBe(false);
    });
});
