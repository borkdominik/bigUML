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
import {
    buildGeneration,
    extractPreviewSample,
    sanitizeSlotValue,
    type ClassifierView,
    type PropertyView
} from '../src/env/glsp-server/generate.core.js';
import { PatternStrategy } from '../src/env/glsp-server/strategies/pattern.strategy.js';
import { RandomStrategy } from '../src/env/glsp-server/strategies/random.strategy.js';
import { type ValueStrategy } from '../src/env/glsp-server/strategies/strategy.js';

type AnyRecord = Record<string, any>;

/** Deterministic, sequential id factory for assertable output. */
function counter(prefix = 'id'): () => string {
    let n = 0;
    return () => `${prefix}${++n}`;
}

function pv(name: string, over: Partial<PropertyView> = {}): PropertyView {
    // Default to single-valued (upperBound 1) unless a test opts into multi-valued.
    return { id: `${name}-pid`, name, typeKind: 'string', documentUri: 'mem://test', upperBound: 1, ...over };
}

function classifier(over: Partial<ClassifierView> & Pick<ClassifierView, 'name'>): ClassifierView {
    return { id: `${over.name}-cid`, documentUri: 'mem://test', properties: [], ...over };
}

const constStrategy = (value: string | undefined): ValueStrategy => ({ kind: 'const', value: () => value });

function instanceOps(patch: { op: string; path: string; value: unknown }[]): AnyRecord[] {
    return patch.filter(p => p.path === '/diagram/entities/-').map(p => p.value as AnyRecord);
}

describe('buildGeneration', () => {
    it('creates `count` instances per classifier as add ops on /diagram/entities/-', () => {
        const person = classifier({ name: 'Person', properties: [pv('name')] });
        const result = buildGeneration([person], { count: 3, strategy: new RandomStrategy(), seed: 1, idFactory: counter() });
        const ops = instanceOps(result.patch);
        assert.equal(ops.length, 3);
        assert.equal(result.instances.length, 3);
        for (const inst of ops) {
            assert.equal(inst.$type, 'InstanceSpecification');
        }
    });

    it('sets the classifier cross-reference (ref.__id + $refText)', () => {
        const person = classifier({ name: 'Person', properties: [pv('name')] });
        const [inst] = instanceOps(buildGeneration([person], { count: 1, strategy: new RandomStrategy(), idFactory: counter() }).patch);
        assert.equal(inst.classifier.$refText, 'Person');
        assert.equal(inst.classifier.ref.__id, 'Person-cid');
        assert.equal(inst.classifier.ref.__documentUri, 'mem://test');
    });

    it('creates a Slot with one LiteralSpecification value per generated property', () => {
        const person = classifier({ name: 'Person', properties: [pv('name')] });
        const [inst] = instanceOps(buildGeneration([person], { count: 1, strategy: constStrategy('Alice'), idFactory: counter() }).patch);
        assert.equal(inst.slots.length, 1);
        const slot = inst.slots[0];
        assert.equal(slot.$type, 'Slot');
        assert.equal(slot.name, 'name');
        assert.equal(slot.definingFeature.ref.__id, 'name-pid');
        assert.equal(slot.definingFeature.$refText, 'name');
        assert.equal(slot.values.length, 1);
        assert.equal(slot.values[0].$type, 'LiteralSpecification');
        assert.equal(slot.values[0].value, 'Alice');
    });

    it('skips read-only properties (no slot)', () => {
        const person = classifier({
            name: 'Person',
            properties: [pv('name'), pv('id', { typeKind: 'integer', isReadOnly: true })]
        });
        const [inst] = instanceOps(buildGeneration([person], { count: 1, strategy: new RandomStrategy(), idFactory: counter() }).patch);
        assert.deepEqual(
            inst.slots.map((s: AnyRecord) => s.name),
            ['name']
        );
    });

    it('warns when a required property cannot be generated and leaves it empty', () => {
        const person = classifier({ name: 'Person', properties: [pv('ref', { typeKind: 'reference', required: true })] });
        const result = buildGeneration([person], { count: 1, strategy: constStrategy(undefined), idFactory: counter() });
        assert.ok(result.diagnostics.some(d => d.code === 'REQUIRED_PROPERTY_SKIPPED' && d.propertyName === 'ref'));
        assert.equal(instanceOps(result.patch)[0].slots.length, 0);
    });

    it('does not warn when an optional property cannot be generated', () => {
        const person = classifier({ name: 'Person', properties: [pv('ref', { typeKind: 'reference' })] });
        const result = buildGeneration([person], { count: 1, strategy: constStrategy(undefined), idFactory: counter() });
        assert.equal(result.diagnostics.length, 0);
    });

    it('enforces best-effort uniqueness and warns when it cannot satisfy it', () => {
        const tag = classifier({ name: 'Tag', properties: [pv('code', { isUnique: true })] });
        const result = buildGeneration([tag], { count: 3, strategy: constStrategy('X'), uniquenessRetries: 3, idFactory: counter() });
        assert.ok(result.diagnostics.some(d => d.code === 'UNIQUENESS_BEST_EFFORT' && d.propertyName === 'code'));
    });

    it('warns on a value that is not type-compatible with the property (follow-up: type-consistency)', () => {
        const person = classifier({ name: 'Person', properties: [pv('age', { typeKind: 'integer' })] });
        const result = buildGeneration([person], {
            count: 1,
            strategy: new PatternStrategy({ patterns: { 'Person-cid': { age: 'not-a-number' } } }),
            idFactory: counter()
        });
        assert.ok(result.diagnostics.some(d => d.code === 'TYPE_MISMATCH' && d.propertyName === 'age'));
    });

    it('does not warn when a value is type-compatible', () => {
        const person = classifier({ name: 'Person', properties: [pv('age', { typeKind: 'integer' })] });
        const result = buildGeneration([person], {
            count: 1,
            strategy: new PatternStrategy({ patterns: { 'Person-cid': { age: '{n}' } } }),
            idFactory: counter()
        });
        assert.equal(result.diagnostics.filter(d => d.code === 'TYPE_MISMATCH').length, 0);
    });

    it('produces unique ids across instances, slots and literals', () => {
        const person = classifier({ name: 'Person', properties: [pv('a'), pv('b')] });
        const result = buildGeneration([person], { count: 3, strategy: new RandomStrategy(), seed: 5, idFactory: counter() });
        const ids: string[] = [];
        for (const inst of instanceOps(result.patch)) {
            ids.push(inst.__id);
            for (const slot of inst.slots) {
                ids.push(slot.__id);
                for (const v of slot.values) ids.push(v.__id);
            }
        }
        assert.equal(ids.length, new Set(ids).size, 'expected all ids to be unique');
    });

    it('generates unique instance names that avoid reserved names', () => {
        const person = classifier({ name: 'Person' });
        const result = buildGeneration([person], {
            count: 2,
            strategy: new RandomStrategy(),
            reservedNames: ['person_1'],
            idFactory: counter()
        });
        assert.deepEqual(
            result.instances.map(i => i.name),
            ['person_2', 'person_3']
        );
    });

    it('is deterministic for the same seed and id factory', () => {
        const person = classifier({ name: 'Person', properties: [pv('name'), pv('age', { typeKind: 'integer' })] });
        const run = (): unknown =>
            buildGeneration([person], { count: 2, strategy: new RandomStrategy(), seed: 42, idFactory: counter() }).patch;
        assert.deepEqual(run(), run());
    });

    it('handles multiple classifiers', () => {
        const person = classifier({ name: 'Person', properties: [pv('name')] });
        const address = classifier({ name: 'Address', properties: [pv('city')] });
        const result = buildGeneration([person, address], { count: 2, strategy: new RandomStrategy(), seed: 1, idFactory: counter() });
        assert.equal(result.instances.length, 4);
        assert.equal(result.instances.filter(i => i.classifierName === 'Person').length, 2);
        assert.equal(result.instances.filter(i => i.classifierName === 'Address').length, 2);
    });
});

describe('buildGeneration — multi-valued attributes', () => {
    it('keeps a single value for single-valued (upperBound <= 1) properties', () => {
        const person = classifier({ name: 'Person', properties: [pv('name', { upperBound: 1 })] });
        const slot = (
            instanceOps(
                buildGeneration([person], { count: 1, strategy: new RandomStrategy(), seed: 1, idFactory: counter() }).patch
            )[0] as AnyRecord
        ).slots[0];
        assert.equal(slot.values.length, 1);
    });

    it('generates several values for a multi-valued attribute, within [lower, upper]', () => {
        const person = classifier({ name: 'Person', properties: [pv('tags', { lowerBound: 2, upperBound: 3 })] });
        const slot = (
            instanceOps(
                buildGeneration([person], { count: 1, strategy: new RandomStrategy(), seed: 4, idFactory: counter() }).patch
            )[0] as AnyRecord
        ).slots[0];
        assert.ok(slot.values.length >= 2 && slot.values.length <= 3, `got ${slot.values.length}`);
        for (let i = 0; i < slot.values.length; i++) {
            assert.equal(slot.values[i].name, `value${i + 1}`);
        }
    });

    it('caps an unbounded (*) multi-valued attribute', () => {
        const person = classifier({ name: 'Person', properties: [pv('tags', { lowerBound: 0, upperBound: undefined })] });
        const slot = (
            instanceOps(
                buildGeneration([person], { count: 1, strategy: new RandomStrategy(), seed: 2, idFactory: counter() }).patch
            )[0] as AnyRecord
        ).slots[0];
        assert.ok(slot.values.length >= 1 && slot.values.length <= 5, `got ${slot.values.length}`);
    });

    it('emits multi-values in generation order (isOrdered honoured by construction)', () => {
        let n = 0;
        const seq: ValueStrategy = { kind: 'seq', value: () => `v${++n}` };
        const doc = classifier({ name: 'Doc', properties: [pv('lines', { lowerBound: 3, upperBound: 3 })] });
        const slot = (instanceOps(buildGeneration([doc], { count: 1, strategy: seq, idFactory: counter() }).patch)[0] as AnyRecord)
            .slots[0];
        assert.deepEqual(
            (slot.values as AnyRecord[]).map(v => v.value),
            ['v1', 'v2', 'v3']
        );
    });

    it('honors isUnique within a multi-valued slot (no duplicate values)', () => {
        let calls = 0;
        const cycle: ValueStrategy = { kind: 'cycle', value: () => ['A', 'B'][calls++ % 2] };
        const tag = classifier({ name: 'Tag', properties: [pv('code', { lowerBound: 1, upperBound: 5, isUnique: true })] });
        const slot = (instanceOps(buildGeneration([tag], { count: 1, strategy: cycle, idFactory: counter() }).patch)[0] as AnyRecord)
            .slots[0];
        const values = (slot.values as AnyRecord[]).map(v => v.value);
        assert.equal(new Set(values).size, values.length, `duplicates in ${JSON.stringify(values)}`);
        assert.ok(values.length <= 2);
    });
});

describe('sanitizeSlotValue', () => {
    it('keeps grammar-safe values (incl. dots, @, apostrophes, dashes) unchanged', () => {
        assert.equal(sanitizeSlotValue('AliceSmith'), 'AliceSmith');
        assert.equal(sanitizeSlotValue('email_1_xk7a'), 'email_1_xk7a');
        assert.equal(sanitizeSlotValue('E-001'), 'E-001');
        assert.equal(sanitizeSlotValue('alice.smith@example.com'), 'alice.smith@example.com');
        assert.equal(sanitizeSlotValue("O'Brien"), "O'Brien");
        assert.equal(sanitizeSlotValue('Dibbert-Hegmann'), 'Dibbert-Hegmann');
    });

    it('replaces only the still-disallowed characters (whitespace, comma, colon, quote, braces) with underscore', () => {
        assert.equal(sanitizeSlotValue('Monica Gutmann'), 'Monica_Gutmann');
        assert.equal(sanitizeSlotValue('Hirthe, Hirthe and Hirthe'), 'Hirthe_Hirthe_and_Hirthe');
        assert.equal(sanitizeSlotValue('(555) 123-4567'), '(555)_123-4567');
        assert.equal(sanitizeSlotValue('say "hi"'), 'say_hi');
    });

    it('never yields an empty value', () => {
        assert.equal(sanitizeSlotValue(''), 'value');
        assert.equal(sanitizeSlotValue('   '), 'value');
    });

    it('prefixes bare numeric/boolean values so they survive the grammar (INT/BOOL shadowing)', () => {
        assert.equal(sanitizeSlotValue('121544'), '_121544');
        assert.equal(sanitizeSlotValue('3.14'), '_3.14');
        assert.equal(sanitizeSlotValue('-5'), '_-5');
        assert.equal(sanitizeSlotValue('true'), '_true');
        assert.equal(sanitizeSlotValue('false'), '_false');
    });

    it('does not prefix values that already contain a non-digit', () => {
        assert.equal(sanitizeSlotValue('Toys'), 'Toys');
        assert.equal(sanitizeSlotValue('BUL751'), 'BUL751');
        assert.equal(sanitizeSlotValue('E-001'), 'E-001');
    });

    it('produces only grammar-safe characters (no whitespace or JSON-structural chars)', () => {
        for (const input of ['Monica Gutmann', 'a.b@c,d', 'x\'y"z', 'café\nüber', 'a{b}c[d]:e']) {
            assert.doesNotMatch(sanitizeSlotValue(input), /[\s"{}[\]:,\\]/, `unsafe output for ${JSON.stringify(input)}`);
        }
    });
});

describe('generated slot values are grammar-safe', () => {
    it('no produced slot value contains whitespace or JSON-structural chars, even for unsafe strategy output', () => {
        const person = classifier({ name: 'Person', properties: [pv('fullName'), pv('email')] });
        const unsafe: ValueStrategy = { kind: 'unsafe', value: () => 'Monica Gutmann <m@x.io>, "x"' };
        const result = buildGeneration([person], { count: 2, strategy: unsafe, idFactory: counter() });
        for (const op of instanceOps(result.patch)) {
            for (const slot of op.slots as AnyRecord[]) {
                assert.doesNotMatch(slot.values[0].value, /[\s"{}[\]:,\\]/, `unsafe stored value: ${slot.values[0].value}`);
            }
        }
    });
});

describe('extractPreviewSample', () => {
    it('summarizes generated instances into name/classifier/slot values', () => {
        const person = classifier({ name: 'Person', properties: [pv('name'), pv('age', { typeKind: 'integer' })] });
        const result = buildGeneration([person], { count: 1, strategy: constStrategy('X'), idFactory: counter() });
        const sample = extractPreviewSample(result.patch, 5, 25);
        assert.equal(sample.length, 1);
        assert.equal(sample[0].classifierName, 'Person');
        assert.match(sample[0].name, /person_/);
        assert.deepEqual(sample[0].slots, [
            { feature: 'name', value: 'X' },
            { feature: 'age', value: 'X' }
        ]);
    });

    it('respects the per-classifier limit', () => {
        const person = classifier({ name: 'Person', properties: [pv('name')] });
        const result = buildGeneration([person], { count: 5, strategy: new RandomStrategy(), seed: 1, idFactory: counter() });
        assert.equal(extractPreviewSample(result.patch, 2, 25).length, 2);
    });

    it('samples each classifier (stratified), not just the first', () => {
        const person = classifier({ name: 'Person', properties: [pv('name')] });
        const address = classifier({ name: 'Address', properties: [pv('city')] });
        // 10 of each; a flat "first 10" would show only Person — stratified must include both.
        const result = buildGeneration([person, address], { count: 10, strategy: new RandomStrategy(), seed: 1, idFactory: counter() });
        const sample = extractPreviewSample(result.patch, 3, 25);
        assert.equal(sample.filter(s => s.classifierName === 'Person').length, 3);
        assert.equal(sample.filter(s => s.classifierName === 'Address').length, 3);
    });

    it('caps the total sample size across classifiers', () => {
        const classifiers = ['A1', 'B2', 'C3', 'D4'].map(name => classifier({ name, properties: [pv('p')] }));
        const result = buildGeneration(classifiers, { count: 10, strategy: new RandomStrategy(), seed: 1, idFactory: counter() });
        // 4 classifiers × up to 5 = 20, but capped at 14 overall.
        assert.equal(extractPreviewSample(result.patch, 5, 14).length, 14);
    });

    it('joins multi-valued slots with a comma in the preview', () => {
        let n = 0;
        const seq: ValueStrategy = { kind: 'seq', value: () => `v${++n}` };
        const doc = classifier({ name: 'Doc', properties: [pv('lines', { lowerBound: 2, upperBound: 2 })] });
        const sample = extractPreviewSample(buildGeneration([doc], { count: 1, strategy: seq, idFactory: counter() }).patch, 5, 25);
        assert.equal(sample[0].slots[0].value, 'v1, v2');
    });
});
