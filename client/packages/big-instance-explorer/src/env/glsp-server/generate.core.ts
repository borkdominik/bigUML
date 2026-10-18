/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { defaultIdFactory, type IdFactory } from './id-factory.js';
import { createRng } from './strategies/rng.js';
import { type PropertyDescriptor, type ValueContext, type ValueStrategy } from './strategies/strategy.js';

/**
 * The pure core of the test-data generator. It takes a plain-data view of the
 * selected classifiers (resolved from the AST elsewhere, including inherited
 * properties) and a configuration, and returns a single batch of JSON-patch
 * operations that create N instances with populated slots — plus a structured
 * summary and diagnostics.
 *
 * It is intentionally free of GLSP / Langium / IO so it can be unit-tested in
 * isolation. The GLSP handler (imperative shell) resolves the views, wraps the
 * returned patch in one `ModelPatchCommand` (atomic single-undo) and augments it
 * with layout (`Size`/`Position`) metadata, which requires live model state.
 */

/** A property of a classifier, extended with the identity needed to build cross-references. */
export interface PropertyView extends PropertyDescriptor {
    /** The property's `__id` in the model. */
    id: string;
    /** URI of the document that owns the property (for cross-document references). */
    documentUri?: string;
    /** Whether the property is required (lower multiplicity bound >= 1). */
    required?: boolean;
    /** Lower multiplicity bound (default 1 when omitted). */
    lowerBound?: number;
    /** Upper multiplicity bound; `undefined` means unbounded (`*`), so multi-valued. */
    upperBound?: number;
}

/** A classifier selected for instantiation, with its resolved (incl. inherited) properties. */
export interface ClassifierView {
    /** The classifier's `__id` in the model. */
    id: string;
    name: string;
    documentUri?: string;
    properties: readonly PropertyView[];
}

export interface GenerationConfig {
    /** Number of instances to create per classifier. */
    count: number;
    /** Strategy used to fill slot values. */
    strategy: ValueStrategy;
    /** Seed for reproducible generation (default 0). */
    seed?: number;
    /** Best-effort retry count for `isUnique` properties (default 8). */
    uniquenessRetries?: number;
    /** Names already used in the model, to avoid collisions. */
    reservedNames?: Iterable<string>;
    /** Id generator, given the AST type of the element; injectable for deterministic tests (default random UUID). */
    idFactory?: IdFactory;
}

export interface PatchOperation {
    op: 'add';
    path: string;
    value: unknown;
}

export type DiagnosticSeverity = 'info' | 'warning' | 'error';

export type GenerationDiagnosticCode =
    | 'REQUIRED_PROPERTY_SKIPPED'
    | 'UNIQUENESS_BEST_EFFORT'
    | 'TYPE_MISMATCH'
    | 'MULTIPLICITY_BEST_EFFORT';

export interface GenerationDiagnostic {
    code: GenerationDiagnosticCode;
    message: string;
    severity: DiagnosticSeverity;
    classifierName?: string;
    propertyName?: string;
}

export interface GeneratedInstanceSummary {
    id: string;
    name: string;
    classifierId: string;
    classifierName: string;
    slotCount: number;
}

export interface GenerationResult {
    /** Semantic add operations (instances with inline slots). Atomic batch. */
    patch: PatchOperation[];
    instances: GeneratedInstanceSummary[];
    diagnostics: GenerationDiagnostic[];
}

/** One generated slot in a preview sample. */
export interface PreviewSlotSample {
    feature: string;
    value: string;
}

/** One generated instance in a preview sample (dry-run view of what will be created). */
export interface PreviewInstanceSample {
    name: string;
    classifierName: string;
    slots: PreviewSlotSample[];
}

/**
 * Builds a human-readable, **stratified** sample for the dry-run preview: up to
 * `perClassifierLimit` instances *per classifier* (so every selected/expanded classifier is
 * represented, not just the first one), bounded by `maxTotal` overall. Reads the instance add
 * operations produced by {@link buildGeneration} without touching the model.
 *
 * Rationale: a flat "first N" sample is biased toward whichever classifier was generated first;
 * stratified sampling reflects all groups while staying small relative to the whole. The complete
 * counts are reported separately (see the handler's summary), so the sample is illustrative only.
 */
export function extractPreviewSample(
    patch: readonly PatchOperation[],
    perClassifierLimit: number,
    maxTotal: number
): PreviewInstanceSample[] {
    const samples: PreviewInstanceSample[] = [];
    const perClassifierCount = new Map<string, number>();
    for (const operation of patch) {
        if (samples.length >= maxTotal) {
            break;
        }
        if (operation.path !== '/diagram/entities/-') {
            continue;
        }
        const instance = operation.value as {
            name?: string;
            classifier?: { $refText?: string };
            slots?: { name?: string; values?: { value?: string }[] }[];
        };
        const classifierName = instance.classifier?.$refText ?? '';
        const used = perClassifierCount.get(classifierName) ?? 0;
        if (used >= perClassifierLimit) {
            continue;
        }
        perClassifierCount.set(classifierName, used + 1);
        samples.push({
            name: instance.name ?? '',
            classifierName,
            slots: (instance.slots ?? []).map(slot => ({
                feature: slot.name ?? '',
                value: (slot.values ?? []).map(literal => literal.value ?? '').join(', ')
            }))
        });
    }
    return samples;
}

const DEFAULT_UNIQUENESS_RETRIES = 8;
/** Cap on how many values to generate for a multi-valued attribute (bounds the unbounded `*` case). */
const MULTI_VALUE_CAP = 5;
/** Default number of values for an unbounded (`*`) multi-valued attribute. */
const MULTI_VALUE_DEFAULT_MAX = 3;

/** How many slot values to generate for a property, from its multiplicity bounds. */
function valueCount(property: PropertyView, rng: ReturnType<typeof createRng>): number {
    const upper = property.upperBound;
    // Single-valued unless the upper bound is unbounded or > 1.
    if (upper !== undefined && upper <= 1) {
        return 1;
    }
    const maxValues = Math.min(upper ?? MULTI_VALUE_DEFAULT_MAX, MULTI_VALUE_CAP);
    const minValues = Math.min(Math.max(property.lowerBound ?? 1, 1), maxValues);
    return minValues >= maxValues ? maxValues : rng.int(minValues, maxValues);
}

/** Whether a generated string value is compatible with the property's declared type. */
function isValueCompatible(property: PropertyView, value: string): boolean {
    switch (property.typeKind) {
        case 'integer':
            return Number.isInteger(Number(value));
        case 'real':
            return value.trim() !== '' && !Number.isNaN(Number(value));
        case 'boolean':
            return value === 'true' || value === 'false';
        case 'enumeration':
            // Only judge when the literals are known.
            return !property.enumLiterals || property.enumLiterals.includes(value);
        case 'string':
        case 'reference':
        case 'unknown':
        default:
            return true;
    }
}

/**
 * Makes a generated value safe to store in a `LiteralSpecification`. The bigUML
 * grammar parses slot values as a `LANGIUM_ID` token (`/[^\s"{}\[\]:,\\]+/`), so
 * realistic punctuation (dots, `@`, apostrophes, parentheses, dashes) is kept as-is,
 * and only the disallowed characters — whitespace, JSON-structural `{ } [ ] : , "`,
 * and `\` — are replaced with `_`. E.g. "alice.smith@example.com" and "O'Brien" are
 * preserved, while "Monica Gutmann" -> "Monica_Gutmann" and
 * "Hirthe, Hirthe and Hirthe" -> "Hirthe_Hirthe_and_Hirthe". Protects every strategy
 * (random/pattern/realistic) and user-typed patterns alike.
 *
 * (Full whitespace/comma support would require an escaped-string grammar terminal —
 * see planning/feature-4-implementation-report.md.)
 */
export function sanitizeSlotValue(value: string): string {
    const safe = value.replace(/[\s"{}[\]:,\\]+/g, '_').replace(/^_+|_+$/g, '');
    if (safe.length === 0) {
        return 'value';
    }
    // The grammar stores slot values as a `LANGIUM_ID` token, which the (ordered, not
    // longest-match) lexer shadows with `LANGIUM_INT` / `LANGIUM_BOOL` for bare numbers
    // and booleans — so values like "121544", "3.14" or "true" fail to parse on reload
    // and corrupt the document. Only a leading non-digit disqualifies the INT/BOOL token,
    // so prefix such values with '_' (readable: `salary = _121544`). Proper fix: an
    // escaped-value grammar terminal — see planning/feature-4-implementation-report.md §5.4.
    if (/^-?\d+(\.\d+)?$/.test(safe) || safe === 'true' || safe === 'false') {
        return `_${safe}`;
    }
    return safe;
}

function buildSlot(property: PropertyView, values: readonly string[], idFactory: IdFactory): Record<string, unknown> {
    return {
        $type: 'Slot',
        __id: idFactory('Slot'),
        name: property.name,
        definingFeature: {
            ref: { __id: property.id, __documentUri: property.documentUri },
            $refText: property.name
        },
        // isOrdered is honoured by construction: values are emitted in generation order.
        values: values.map((value, index) => ({
            $type: 'LiteralSpecification',
            __id: idFactory('LiteralSpecification'),
            name: `value${index + 1}`,
            value: sanitizeSlotValue(value)
        }))
    };
}

function buildInstance(id: string, name: string, classifier: ClassifierView, slots: Record<string, unknown>[]): Record<string, unknown> {
    return {
        $type: 'InstanceSpecification',
        __id: id,
        name,
        classifier: {
            ref: { __id: classifier.id, __documentUri: classifier.documentUri },
            $refText: classifier.name
        },
        slots
    };
}

function nextName(classifierName: string, usedNames: Set<string>): string {
    const base = classifierName.toLowerCase();
    let k = 1;
    let candidate = `${base}_${k}`;
    while (usedNames.has(candidate)) {
        k++;
        candidate = `${base}_${k}`;
    }
    return candidate;
}

/**
 * Builds the atomic generation patch for the given classifier views.
 *
 * Constraint handling (topic feature 4e):
 * - `isReadOnly` properties are skipped (no slot).
 * - required properties that cannot be generated produce a diagnostic.
 * - `isUnique` properties are de-duplicated best-effort (with a diagnostic on failure).
 * - values incompatible with the property type produce a diagnostic.
 */
export function buildGeneration(classifiers: readonly ClassifierView[], config: GenerationConfig): GenerationResult {
    const rng = createRng(config.seed ?? 0);
    const idFactory = config.idFactory ?? defaultIdFactory;
    const retries = config.uniquenessRetries ?? DEFAULT_UNIQUENESS_RETRIES;
    const usedNames = new Set<string>(config.reservedNames ?? []);

    const patch: PatchOperation[] = [];
    const instances: GeneratedInstanceSummary[] = [];
    const diagnostics: GenerationDiagnostic[] = [];

    for (const classifier of classifiers) {
        const seenValuesByProperty = new Map<string, Set<string>>();

        for (let index = 1; index <= config.count; index++) {
            const instanceId = idFactory('InstanceSpecification');
            const name = nextName(classifier.name, usedNames);
            usedNames.add(name);

            const slots: Record<string, unknown>[] = [];

            for (const property of classifier.properties) {
                if (property.isReadOnly) {
                    continue;
                }

                const ctx: ValueContext = { rng, index, classifierId: classifier.id };
                const count = valueCount(property, rng);
                const seen = property.isUnique ? (seenValuesByProperty.get(property.name) ?? new Set<string>()) : undefined;
                const slotValues: string[] = [];
                let typeMismatchReported = false;

                for (let valueIndex = 0; valueIndex < count; valueIndex++) {
                    let value = config.strategy.value(property, ctx);
                    if (value === undefined) {
                        break;
                    }

                    if (seen) {
                        let attempts = 0;
                        while ((seen.has(value) || slotValues.includes(value)) && attempts < retries) {
                            const next = config.strategy.value(property, ctx);
                            if (next === undefined) {
                                break;
                            }
                            value = next;
                            attempts++;
                        }
                        if (seen.has(value) || slotValues.includes(value)) {
                            // Could not produce a distinct value: keep the first one best-effort, else stop adding.
                            if (slotValues.length > 0) {
                                break;
                            }
                            diagnostics.push({
                                code: 'UNIQUENESS_BEST_EFFORT',
                                severity: 'warning',
                                classifierName: classifier.name,
                                propertyName: property.name,
                                message: `Could not generate a unique value for ${classifier.name}.${property.name}; a duplicate was kept.`
                            });
                        }
                    }

                    if (!typeMismatchReported && !isValueCompatible(property, value)) {
                        typeMismatchReported = true;
                        diagnostics.push({
                            code: 'TYPE_MISMATCH',
                            severity: 'warning',
                            classifierName: classifier.name,
                            propertyName: property.name,
                            message: `Generated value "${value}" is not compatible with type ${property.typeName ?? property.typeKind} of ${classifier.name}.${property.name}.`
                        });
                    }

                    slotValues.push(value);
                    seen?.add(value);
                }
                if (seen) {
                    seenValuesByProperty.set(property.name, seen);
                }

                if (slotValues.length === 0) {
                    if (property.required) {
                        diagnostics.push({
                            code: 'REQUIRED_PROPERTY_SKIPPED',
                            severity: 'warning',
                            classifierName: classifier.name,
                            propertyName: property.name,
                            message: `Required property ${classifier.name}.${property.name} could not be generated and was left empty.`
                        });
                    }
                    continue;
                }

                slots.push(buildSlot(property, slotValues, idFactory));
            }

            patch.push({
                op: 'add',
                path: '/diagram/entities/-',
                value: buildInstance(instanceId, name, classifier, slots)
            });
            instances.push({
                id: instanceId,
                name,
                classifierId: classifier.id,
                classifierName: classifier.name,
                slotCount: slots.length
            });
        }
    }

    return { patch, instances, diagnostics };
}
