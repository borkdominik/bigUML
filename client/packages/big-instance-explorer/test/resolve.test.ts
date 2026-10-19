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
import { parseMultiplicity, resolveTypeKind, toPropertyTypeKind } from '../src/env/glsp-server/resolve.js';

describe('parseMultiplicity', () => {
    it('defaults to required single (1..1) when absent or empty', () => {
        assert.deepEqual(parseMultiplicity(undefined), { lower: 1, upper: 1 });
        assert.deepEqual(parseMultiplicity(''), { lower: 1, upper: 1 });
        assert.deepEqual(parseMultiplicity('   '), { lower: 1, upper: 1 });
    });

    it('parses a bare star as 0..unbounded', () => {
        assert.deepEqual(parseMultiplicity('*'), { lower: 0, upper: undefined });
    });

    it('parses a single number as exact', () => {
        assert.deepEqual(parseMultiplicity('1'), { lower: 1, upper: 1 });
        assert.deepEqual(parseMultiplicity('0'), { lower: 0, upper: 0 });
    });

    it('parses bounded and unbounded ranges', () => {
        assert.deepEqual(parseMultiplicity('0..1'), { lower: 0, upper: 1 });
        assert.deepEqual(parseMultiplicity('2..5'), { lower: 2, upper: 5 });
        assert.deepEqual(parseMultiplicity('1..*'), { lower: 1, upper: undefined });
        assert.deepEqual(parseMultiplicity('0..*'), { lower: 0, upper: undefined });
    });

    it('tolerates surrounding whitespace', () => {
        assert.deepEqual(parseMultiplicity(' 1 .. 2 '), { lower: 1, upper: 2 });
    });

    it('parses textual multiplicity words used by some models', () => {
        assert.deepEqual(parseMultiplicity('one'), { lower: 1, upper: 1 });
        assert.deepEqual(parseMultiplicity('One'), { lower: 1, upper: 1 });
        assert.deepEqual(parseMultiplicity('many'), { lower: 0, upper: undefined });
        assert.deepEqual(parseMultiplicity('zeroOrOne'), { lower: 0, upper: 1 });
        assert.deepEqual(parseMultiplicity('oneOrMany'), { lower: 1, upper: undefined });
    });

    it('falls back to required single for unparseable input', () => {
        assert.deepEqual(parseMultiplicity('garbage'), { lower: 1, upper: 1 });
    });
});

describe('toPropertyTypeKind', () => {
    it('maps primitive type names (case-insensitive)', () => {
        assert.equal(toPropertyTypeKind('String'), 'string');
        assert.equal(toPropertyTypeKind('integer'), 'integer');
        assert.equal(toPropertyTypeKind('Int'), 'integer');
        assert.equal(toPropertyTypeKind('Boolean'), 'boolean');
        assert.equal(toPropertyTypeKind('Real'), 'real');
        assert.equal(toPropertyTypeKind('Float'), 'real');
        assert.equal(toPropertyTypeKind('Double'), 'real');
    });

    it('treats an enumeration type as enumeration regardless of name', () => {
        assert.equal(toPropertyTypeKind('Color', true), 'enumeration');
    });

    it('treats a non-primitive named type as a reference', () => {
        assert.equal(toPropertyTypeKind('Person'), 'reference');
    });

    it('returns unknown when there is no type', () => {
        assert.equal(toPropertyTypeKind(undefined), 'unknown');
    });
});

describe('resolveTypeKind', () => {
    it('maps enumeration and classifier categories', () => {
        assert.equal(resolveTypeKind('enumeration', 'Color'), 'enumeration');
        assert.equal(resolveTypeKind('classifier', 'Person'), 'reference');
    });

    it('treats an untyped property as unknown', () => {
        assert.equal(resolveTypeKind('none'), 'unknown');
    });

    it('treats DataType-typed properties as value-bearing (generate a value, not a reference)', () => {
        // A structured DataType (e.g. Address) gets a string value rather than being skipped.
        assert.equal(resolveTypeKind('datatype', 'Address'), 'string');
        // Primitive-named DataTypes keep their primitive kind.
        assert.equal(resolveTypeKind('datatype', 'Integer'), 'integer');
        assert.equal(resolveTypeKind('datatype', 'String'), 'string');
        assert.equal(resolveTypeKind('datatype', undefined), 'string');
    });
});
