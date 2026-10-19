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
import { expandClassifierSelection, type ClassifierEdge } from '../src/env/glsp-server/expand.core.js';

// Employee --worksFor--> Company, Employee --hasAddress--> Address, Employee --worksOn--> Project
const edges: ClassifierEdge[] = [
    { sourceClassifierId: 'Employee', targetClassifierId: 'Company' },
    { sourceClassifierId: 'Employee', targetClassifierId: 'Address' },
    { sourceClassifierId: 'Employee', targetClassifierId: 'Project' }
];

describe('expandClassifierSelection', () => {
    it('does not expand at depth 0 or 1 (selected only)', () => {
        assert.deepEqual(expandClassifierSelection(['Company'], edges, 0), ['Company']);
        assert.deepEqual(expandClassifierSelection(['Company'], edges, 1), ['Company']);
    });

    it('reaches direct neighbours at depth 2 (Company -> Employee)', () => {
        const result = expandClassifierSelection(['Company'], edges, 2);
        assert.deepEqual(new Set(result), new Set(['Company', 'Employee']));
        assert.equal(result[0], 'Company', 'selected classifier comes first');
    });

    it('reaches two hops at depth 3 (Company -> Employee -> Address/Project)', () => {
        const result = expandClassifierSelection(['Company'], edges, 3);
        assert.deepEqual(new Set(result), new Set(['Company', 'Employee', 'Address', 'Project']));
    });

    it('follows associations undirected (a target reaches its sources)', () => {
        // From Address, depth 2 reaches Employee (its source); depth 3 also reaches Company/Project.
        assert.deepEqual(new Set(expandClassifierSelection(['Address'], edges, 2)), new Set(['Address', 'Employee']));
        assert.deepEqual(new Set(expandClassifierSelection(['Address'], edges, 3)), new Set(['Address', 'Employee', 'Company', 'Project']));
    });

    it('terminates on cycles', () => {
        const cyclic: ClassifierEdge[] = [
            { sourceClassifierId: 'A', targetClassifierId: 'B' },
            { sourceClassifierId: 'B', targetClassifierId: 'C' },
            { sourceClassifierId: 'C', targetClassifierId: 'A' }
        ];
        assert.deepEqual(new Set(expandClassifierSelection(['A'], cyclic, 99)), new Set(['A', 'B', 'C']));
    });

    it('ignores reflexive edges and dedupes multiple seeds', () => {
        const reflexive: ClassifierEdge[] = [{ sourceClassifierId: 'A', targetClassifierId: 'A' }];
        assert.deepEqual(expandClassifierSelection(['A', 'A'], reflexive, 3), ['A']);
    });

    it('returns selected classifiers unchanged when there are no edges', () => {
        assert.deepEqual(expandClassifierSelection(['Company', 'Employee'], [], 5), ['Company', 'Employee']);
    });
});
