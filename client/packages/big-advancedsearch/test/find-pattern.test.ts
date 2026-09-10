/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { describe, expect, it } from 'vitest';
import { extractNameFindPattern } from '../src/env/glsp-server/matchers/find-pattern.js';
import { buildAst } from '../src/env/glsp-server/matchers/visitor.js';

function patternOf(query: string): string | undefined {
    return extractNameFindPattern(buildAst(query));
}

describe('extractNameFindPattern', () => {
    it('extracts a quoted name filter', () => {
        expect(patternOf('Class[name~"User"]')).toBe('User');
    });

    it('extracts an exact-match name filter', () => {
        expect(patternOf('Class[name="User"]')).toBe('User');
    });

    it('tolerates whitespace around the operator (the lexer skips it)', () => {
        expect(patternOf('Class[ name = "User" ]')).toBe('User');
        expect(patternOf('Class [name ~ "User"]')).toBe('User');
    });

    it('extracts an unquoted identifier value', () => {
        expect(patternOf('Class[name~User]')).toBe('User');
    });

    it('unescapes escaped quotes', () => {
        expect(patternOf('Class[name~"a\\"b"]')).toBe('a"b');
    });

    it('returns undefined without a name filter', () => {
        expect(patternOf('Class')).toBeUndefined();
        expect(patternOf('Class[isAbstract=true]')).toBeUndefined();
    });

    it('uses the root criteria for hierarchical queries (results are the root elements)', () => {
        expect(patternOf('Class[name~"Base"] > Attribute[name~"id"]')).toBe('Base');
    });

    it('picks the first of multiple name filters', () => {
        expect(patternOf('Class[name~"A", name~"B"]')).toBe('A');
    });
});
