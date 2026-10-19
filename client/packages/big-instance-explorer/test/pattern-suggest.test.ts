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
import { suggestPattern } from '../src/env/common/pattern-suggest.js';

describe('suggestPattern', () => {
    it('suggests a classifier-prefixed sequence for name properties', () => {
        assert.equal(suggestPattern('User', 'name'), 'User_{n}');
        assert.equal(suggestPattern('Employee', 'fullName'), 'Employee_{n}');
    });

    it('suggests an email pattern derived from the classifier', () => {
        assert.equal(suggestPattern('User', 'email'), 'user_{n}@example.com');
    });

    it('suggests pick lists for first/last names', () => {
        assert.match(suggestPattern('Person', 'firstName'), /^\{pick:/);
        assert.match(suggestPattern('Person', 'lastName'), /^\{pick:/);
    });

    it('suggests pick lists for city and country', () => {
        assert.match(suggestPattern('Address', 'city'), /^\{pick:/);
        assert.match(suggestPattern('Address', 'country'), /^\{pick:/);
    });

    it('suggests an id pattern for *id properties', () => {
        assert.match(suggestPattern('Employee', 'employeeId'), /\{n\}/);
    });

    it('falls back to a property-name sequence', () => {
        assert.equal(suggestPattern('Whatever', 'somethingElse'), 'somethingElse_{n}');
    });
});
