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
import { planLinks, type AssociationView, type LinkableInstance } from '../src/env/glsp-server/links.core.js';

type AnyRecord = Record<string, any>;

function counter(prefix = 'lid'): () => string {
    let n = 0;
    return () => `${prefix}${++n}`;
}

function inst(id: string, name: string, classifierId: string): LinkableInstance {
    return { id, name, classifierId, documentUri: 'mem://test' };
}

function assoc(over: Partial<AssociationView> = {}): AssociationView {
    return {
        id: 'A',
        name: 'rel',
        documentUri: 'mem://test',
        sourceClassifierId: 'P',
        targetClassifierId: 'Addr',
        targetLowerBound: 1,
        targetUpperBound: 1,
        ...over
    };
}

const persons = [inst('p1', 'p1', 'P'), inst('p2', 'p2', 'P'), inst('p3', 'p3', 'P')];
const addresses = [inst('a1', 'a1', 'Addr'), inst('a2', 'a2', 'Addr')];

function linkOps(patch: { op: string; path: string; value: unknown }[]): AnyRecord[] {
    return patch.filter(p => p.path === '/diagram/relations/-').map(p => p.value as AnyRecord);
}

function linksBySource(result: ReturnType<typeof planLinks>): Map<string, AnyRecord[]> {
    const map = new Map<string, AnyRecord[]>();
    for (const link of linkOps(result.patch)) {
        const list = map.get(link.source.ref.__id) ?? [];
        list.push(link);
        map.set(link.source.ref.__id, list);
    }
    return map;
}

describe('planLinks', () => {
    it('creates no links at depth 0', () => {
        const result = planLinks([...persons, ...addresses], [assoc()], { depth: 0, seed: 1, idFactory: counter() });
        assert.equal(result.patch.length, 0);
        assert.equal(result.links.length, 0);
    });

    it('creates exactly one link per source for a 1..1 target multiplicity', () => {
        const result = planLinks([...persons, ...addresses], [assoc({ targetLowerBound: 1, targetUpperBound: 1 })], {
            depth: 1,
            seed: 1,
            idFactory: counter()
        });
        const bySource = linksBySource(result);
        for (const p of persons) {
            assert.equal(bySource.get(p.id)?.length ?? 0, 1, `expected 1 link for ${p.id}`);
        }
    });

    it('respects the lower bound (>= lower links per source when enough targets exist)', () => {
        const manyAddresses = [inst('a1', 'a1', 'Addr'), inst('a2', 'a2', 'Addr'), inst('a3', 'a3', 'Addr'), inst('a4', 'a4', 'Addr')];
        const result = planLinks([...persons, ...manyAddresses], [assoc({ targetLowerBound: 2, targetUpperBound: undefined })], {
            depth: 1,
            seed: 3,
            idFactory: counter()
        });
        for (const p of persons) {
            assert.ok((linksBySource(result).get(p.id)?.length ?? 0) >= 2, `expected >= 2 links for ${p.id}`);
        }
    });

    it('respects the upper bound (<= upper links per source)', () => {
        const manyAddresses = [inst('a1', 'a1', 'Addr'), inst('a2', 'a2', 'Addr'), inst('a3', 'a3', 'Addr'), inst('a4', 'a4', 'Addr')];
        const result = planLinks([...persons, ...manyAddresses], [assoc({ targetLowerBound: 0, targetUpperBound: 2 })], {
            depth: 1,
            seed: 3,
            idFactory: counter()
        });
        for (const p of persons) {
            assert.ok((linksBySource(result).get(p.id)?.length ?? 0) <= 2, `expected <= 2 links for ${p.id}`);
        }
    });

    it('allows a target to be shared by multiple sources', () => {
        const oneAddress = [inst('a1', 'a1', 'Addr')];
        const result = planLinks([...persons, ...oneAddress], [assoc({ targetLowerBound: 1, targetUpperBound: 1 })], {
            depth: 1,
            seed: 1,
            idFactory: counter()
        });
        const ops = linkOps(result.patch);
        assert.equal(ops.length, 3);
        assert.ok(ops.every(l => l.target.ref.__id === 'a1'));
    });

    it('warns (best-effort) when there are not enough targets to satisfy the lower bound', () => {
        const oneAddress = [inst('a1', 'a1', 'Addr')];
        const result = planLinks([...persons, ...oneAddress], [assoc({ targetLowerBound: 2, targetUpperBound: undefined })], {
            depth: 1,
            seed: 1,
            idFactory: counter()
        });
        assert.ok(result.diagnostics.some(d => d.code === 'MULTIPLICITY_BEST_EFFORT'));
    });

    it('never creates a self-link for a reflexive association', () => {
        const result = planLinks(
            persons,
            [assoc({ sourceClassifierId: 'P', targetClassifierId: 'P', targetLowerBound: 1, targetUpperBound: 1 })],
            {
                depth: 1,
                seed: 7,
                idFactory: counter()
            }
        );
        for (const link of linkOps(result.patch)) {
            assert.notEqual(link.source.ref.__id, link.target.ref.__id);
        }
    });

    it('produces a runtime-correct InstanceLink shape', () => {
        const result = planLinks([...persons, ...addresses], [assoc({ targetLowerBound: 1, targetUpperBound: 1 })], {
            depth: 1,
            seed: 1,
            idFactory: counter()
        });
        const link = linkOps(result.patch)[0];
        assert.equal(link.$type, 'InstanceLink');
        assert.equal(link.association.ref.__id, 'A');
        assert.equal(link.association.$refText, 'rel');
        assert.ok(typeof link.source.ref.__id === 'string');
        assert.ok(typeof link.target.ref.__id === 'string');
        assert.equal(link.source.ref.__documentUri, 'mem://test');
    });

    it('skips associations whose endpoints have no generated instances', () => {
        const result = planLinks(persons, [assoc({ sourceClassifierId: 'P', targetClassifierId: 'Addr', targetLowerBound: 0 })], {
            depth: 1,
            seed: 1,
            idFactory: counter()
        });
        assert.equal(result.patch.length, 0);
    });

    it('produces unique link ids', () => {
        const result = planLinks([...persons, ...addresses], [assoc({ targetLowerBound: 1, targetUpperBound: 1 })], {
            depth: 1,
            seed: 1,
            idFactory: counter()
        });
        const ids = linkOps(result.patch).map(l => l.__id as string);
        assert.equal(ids.length, new Set(ids).size);
    });

    it('is deterministic for the same seed and id factory', () => {
        const run = (): unknown =>
            planLinks([...persons, ...addresses], [assoc({ targetLowerBound: 1, targetUpperBound: 1 })], {
                depth: 1,
                seed: 42,
                idFactory: counter()
            }).patch;
        assert.deepEqual(run(), run());
    });

    it('links every source to a fixed target when one is chosen for the association', () => {
        const employees = [inst('e1', 'e1', 'Employee'), inst('e2', 'e2', 'Employee')];
        const companies = [inst('c1', 'c1', 'Company'), inst('c2', 'c2', 'Company')];
        const worksFor = assoc({
            id: 'wf',
            sourceClassifierId: 'Employee',
            targetClassifierId: 'Company',
            targetLowerBound: 0,
            targetUpperBound: undefined
        });
        const result = planLinks([...employees, ...companies], [worksFor], {
            depth: 1,
            seed: 1,
            sourceIds: new Set(['e1', 'e2']),
            fixedTargets: { wf: 'c2' },
            idFactory: counter()
        });
        const ops = linkOps(result.patch);
        assert.equal(ops.length, 2);
        for (const link of ops) {
            assert.equal(link.target.ref.__id, 'c2');
            assert.ok(['e1', 'e2'].includes(link.source.ref.__id));
        }
    });

    it('falls back to automatic targets when the fixed target id is not found', () => {
        const result = planLinks([...persons, ...addresses], [assoc({ id: 'A', targetLowerBound: 1, targetUpperBound: 1 })], {
            depth: 1,
            seed: 1,
            fixedTargets: { A: 'does-not-exist' },
            idFactory: counter()
        });
        assert.equal(linkOps(result.patch).length, persons.length);
    });

    it('minPerSource forces a link per source for an optional (0..*) association even with a single target', () => {
        const manyPersons = Array.from({ length: 10 }, (_unused, i) => inst(`p${i}`, `p${i}`, 'P'));
        const oneAddress = [inst('a1', 'a1', 'Addr')];
        const result = planLinks([...manyPersons, ...oneAddress], [assoc({ targetLowerBound: 0, targetUpperBound: undefined })], {
            depth: 1,
            seed: 1,
            minPerSource: 1,
            idFactory: counter()
        });
        const bySource = linksBySource(result);
        for (const p of manyPersons) {
            assert.equal(bySource.get(p.id)?.length ?? 0, 1, `expected exactly 1 link for ${p.id}`);
        }
    });

    it('restricts link sources to sourceIds (reflexive: only listed instances originate links)', () => {
        const employees = [inst('e1', 'e1', 'E'), inst('e2', 'e2', 'E'), inst('e3', 'e3', 'E')];
        const reflexive = assoc({ sourceClassifierId: 'E', targetClassifierId: 'E', targetLowerBound: 1, targetUpperBound: 1 });
        const result = planLinks(employees, [reflexive], { depth: 1, seed: 1, sourceIds: new Set(['e1']), idFactory: counter() });
        const ops = linkOps(result.patch);
        assert.equal(ops.length, 1);
        assert.equal(ops[0].source.ref.__id, 'e1');
    });

    it('links generated sources to existing targets (existing + generated pool)', () => {
        // Existing companies + newly generated employees; employees link to existing companies.
        const existingCompanies = [inst('c1', 'c1', 'Company'), inst('c2', 'c2', 'Company')];
        const generatedEmployees = [inst('e1', 'e1', 'Employee'), inst('e2', 'e2', 'Employee')];
        const worksFor = assoc({
            id: 'wf',
            name: 'worksFor',
            sourceClassifierId: 'Employee',
            targetClassifierId: 'Company',
            targetLowerBound: 1,
            targetUpperBound: 1
        });
        const result = planLinks([...existingCompanies, ...generatedEmployees], [worksFor], {
            depth: 1,
            seed: 1,
            sourceIds: new Set(['e1', 'e2']),
            idFactory: counter()
        });
        const ops = linkOps(result.patch);
        assert.equal(ops.length, 2);
        for (const link of ops) {
            assert.ok(['e1', 'e2'].includes(link.source.ref.__id), 'source must be a generated employee');
            assert.ok(['c1', 'c2'].includes(link.target.ref.__id), 'target may be an existing company');
        }
    });

    it('restricts targets to targetIds (link within this batch: generated sources -> generated targets only)', () => {
        const existingCompanies = [inst('c1', 'c1', 'Company'), inst('c2', 'c2', 'Company')];
        const generatedEmployees = [inst('e1', 'e1', 'Employee'), inst('e2', 'e2', 'Employee')];
        const generatedCompanies = [inst('gc1', 'gc1', 'Company'), inst('gc2', 'gc2', 'Company')];
        const worksFor = assoc({
            id: 'wf',
            name: 'worksFor',
            sourceClassifierId: 'Employee',
            targetClassifierId: 'Company',
            targetLowerBound: 1,
            targetUpperBound: 1
        });
        const result = planLinks([...existingCompanies, ...generatedEmployees, ...generatedCompanies], [worksFor], {
            depth: 1,
            seed: 1,
            sourceIds: new Set(['e1', 'e2']),
            targetIds: new Set(['gc1', 'gc2', 'e1', 'e2']),
            idFactory: counter()
        });
        const ops = linkOps(result.patch);
        assert.equal(ops.length, 2);
        for (const link of ops) {
            assert.ok(['gc1', 'gc2'].includes(link.target.ref.__id), `target must be a generated company, got ${link.target.ref.__id}`);
        }
    });

    it('spreads links evenly across targets (balanced: no clustering, no stale targets)', () => {
        // 6 employees, 3 companies, each employee -> exactly one company (target upper 1).
        const employees = Array.from({ length: 6 }, (_, i) => inst(`e${i + 1}`, `e${i + 1}`, 'Employee'));
        const companies = [inst('c1', 'c1', 'Company'), inst('c2', 'c2', 'Company'), inst('c3', 'c3', 'Company')];
        const worksFor = assoc({
            id: 'wf',
            name: 'worksFor',
            sourceClassifierId: 'Employee',
            targetClassifierId: 'Company',
            targetLowerBound: 1,
            targetUpperBound: 1
        });
        const result = planLinks([...employees, ...companies], [worksFor], { depth: 1, seed: 1, minPerSource: 1, idFactory: counter() });
        const perTarget = new Map<string, number>();
        for (const op of linkOps(result.patch)) {
            perTarget.set(op.target.ref.__id, (perTarget.get(op.target.ref.__id) ?? 0) + 1);
        }
        assert.equal(linkOps(result.patch).length, 6);
        // 6 links over 3 targets, balanced ⇒ exactly 2 each (no stale, no clustering).
        assert.deepEqual(
            [...perTarget.values()].sort((a, b) => a - b),
            [2, 2, 2],
            `uneven distribution: ${JSON.stringify([...perTarget])}`
        );
    });

    it('enforces the source-end multiplicity (1:1: a target is never shared)', () => {
        const employees = Array.from({ length: 4 }, (_, i) => inst(`e${i + 1}`, `e${i + 1}`, 'Employee'));
        const addresses = [inst('a1', 'a1', 'Address'), inst('a2', 'a2', 'Address'), inst('a3', 'a3', 'Address')];
        // 1:1 — each person has one address, each address belongs to one person (sourceUpperBound 1).
        const hasAddress = assoc({
            id: 'ha',
            name: 'hasAddress',
            sourceClassifierId: 'Employee',
            targetClassifierId: 'Address',
            targetLowerBound: 1,
            targetUpperBound: 1,
            sourceUpperBound: 1
        });
        const result = planLinks([...employees, ...addresses], [hasAddress], { depth: 1, seed: 2, minPerSource: 1, idFactory: counter() });
        const ops = linkOps(result.patch);
        const targetsUsed = ops.map(op => op.target.ref.__id);
        // Only 3 addresses, each usable once ⇒ 3 links, all distinct targets; 4th employee unlinked + warning.
        assert.equal(ops.length, 3);
        assert.equal(new Set(targetsUsed).size, 3, `a target was shared under 1:1: ${JSON.stringify(targetsUsed)}`);
        assert.ok(
            result.diagnostics.some(d => d.code === 'MULTIPLICITY_BEST_EFFORT'),
            'expected a warning for the unlinkable source'
        );
    });

    it('without sourceIds, every instance can act as a source (back-compat)', () => {
        const result = planLinks([...persons, ...addresses], [assoc({ targetLowerBound: 1, targetUpperBound: 1 })], {
            depth: 1,
            seed: 1,
            idFactory: counter()
        });
        assert.equal(linkOps(result.patch).length, persons.length);
    });

    it('minPerSource never exceeds the upper bound', () => {
        const result = planLinks([...persons, ...addresses], [assoc({ targetLowerBound: 0, targetUpperBound: 0 })], {
            depth: 1,
            seed: 1,
            minPerSource: 1,
            idFactory: counter()
        });
        assert.equal(result.patch.length, 0);
    });
});
