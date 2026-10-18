/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type {
    ConflictReport,
    InferredAssociation,
    InferredClass,
    InferredProperty,
    InferredType,
    ParsedInstance,
    ParsedInstanceData,
    ParsedLink
} from './types.js';

import { parseMockData } from './mock-parser.js';

// ─── 6d — Attribute Type Inference ────────────────────────────────────────────

/**
 * Examine slot values to infer property types with widening on conflict.
 *
 * Priority:
 *   1. Boolean  — all values are "true"/"false"
 *   2. Integer  — all values are whole numbers
 *   3. Real     — all values parse as floats
 *   4. Enumeration — all values match known enum literals
 *   5. String   — fallback for type conflicts or unmatched values
 *
 * If values within a slot are incompatible (e.g. "42" vs "hello"),
 * the type is widened to String (6e — type conflict resolution).
 */
export function inferType(values: string[], knownEnumerations: Map<string, Set<string>> = new Map()): InferredType {
    if (values.length === 0) {
        return 'String';
    }

    const allBooleans = values.every(v => v === 'true' || v === 'false');
    if (allBooleans) {
        return 'Boolean';
    }

    const allIntegers = values.every(v => {
        const trimmed = v.trim();
        return trimmed !== '' && /^-?\d+$/.test(trimmed);
    });
    if (allIntegers) {
        return 'Integer';
    }

    const allReals = values.every(v => {
        const trimmed = v.trim();
        return trimmed !== '' && !isNaN(Number(trimmed));
    });
    if (allReals) {
        return 'Real';
    }

    for (const [enumName, literals] of knownEnumerations) {
        if (values.every(v => literals.has(v))) {
            return { kind: 'Enumeration', name: enumName };
        }
    }

    // Type conflict (e.g. "42" and "hello" in the same slot) or plain text
    return 'String';
}

/**
 * Detect type conflicts — when the same slot has values of
 * incompatible types across instances of the same class.
 *
 * Returns the conflict description for logging / UI.
 */
export function detectTypeConflict(
    typeName: string,
    slotName: string,
    groups: { typeLabel: string; values: string[] }[]
): string | undefined {
    const inferredTypes = groups.map(g => inferType(g.values));
    const uniqueKinds = new Set(inferredTypes.map(t => (typeof t === 'string' ? t : t.kind)));
    if (uniqueKinds.size === 1) {
        return undefined;
    }
    return `Property "${slotName}" in "${typeName}" has conflicting types: ${[...uniqueKinds].join(' vs ')}`;
}

// ─── 6b — Class Inference ─────────────────────────────────────────────────────

export interface InferClassesOptions {
    /** How to handle missing slots (default: union) */
    mode?: 'union' | 'intersection';
    /** Known enumerations for type resolution */
    knownEnumerations?: Map<string, Set<string>>;
}

/**
 * Group instances by their typeName and infer class structures.
 *
 * Union mode (default): create a property for every observed slot across all
 *   instances; mark missing ones as optional.
 * Intersection mode: only create properties present in every instance.
 *
 * Type conflicts (e.g. "42" vs "hello") widen to 'String' (6e).
 */
export function inferClasses(
    parsed: ParsedInstanceData,
    options: InferClassesOptions = {}
): { classes: InferredClass[]; conflicts: ConflictReport[] } {
    const { mode = 'union', knownEnumerations = new Map() } = options;
    const groups = new Map<string, ParsedInstance[]>();

    for (const inst of parsed.instances) {
        const group = groups.get(inst.typeName) ?? [];
        group.push(inst);
        groups.set(inst.typeName, group);
    }

    const classes: InferredClass[] = [];
    const conflicts: ConflictReport[] = [];

    // 6e — Name ambiguity: normalise by preserving case-exact names but
    // reporting near-duplicates (same lowercase spelling).
    const nameConflicts = detectNameConflicts([...groups.keys()]);
    conflicts.push(...nameConflicts);

    for (const [typeName, instances] of groups) {
        const slotNames = new Set<string>();
        for (const inst of instances) {
            for (const slot of inst.slots) {
                slotNames.add(slot.featureName);
            }
        }

        const propertyNames = [...slotNames].sort();
        const properties: InferredProperty[] = [];

        for (const slotName of propertyNames) {
            const values: string[] = [];
            let presentCount = 0;

            for (const inst of instances) {
                const slot = inst.slots.find(s => s.featureName === slotName);
                if (slot) {
                    values.push(slot.value);
                    presentCount++;
                }
            }

            // 6e — mode resolution
            const isRequired = mode === 'intersection' || presentCount === instances.length;
            const isOptional = !isRequired;
            const type = inferType(values, knownEnumerations);

            // 6e — type conflict detection
            const typeGroups = [{ typeLabel: 'values', values }];
            const conflict = detectTypeConflict(typeName, slotName, typeGroups);
            if (conflict) {
                conflicts.push({ kind: 'type_conflict', message: conflict });
            }

            properties.push({ name: slotName, type, isOptional });
        }

        classes.push({ name: typeName, properties });
    }

    return { classes, conflicts };
}

// ─── 6c — Association Inference ───────────────────────────────────────────────

/**
 * Analyze links to infer associations between inferred classes.
 *
 * For each unique (sourceTypeName, targetTypeName) pair:
 *   1. Resolve source/target instances to their type names
 *   2. Collect all links between instances of those two types
 *   3. Count outgoing links per source instance → sourceMultiplicity
 *   4. Count incoming links per target instance → targetMultiplicity
 */
export function inferAssociations(parsed: ParsedInstanceData, classes: InferredClass[]): InferredAssociation[] {
    const typeNameMap = new Map<string, string>();
    for (const inst of parsed.instances) {
        typeNameMap.set(inst.name, inst.typeName);
    }

    const classNames = new Set(classes.map(c => c.name));
    const associationKey = (sourceType: string, targetType: string) => `${sourceType}→${targetType}`;

    const linkGroups = new Map<string, { links: ParsedLink[]; nameCandidates: (string | undefined)[] }>();

    for (const link of parsed.links) {
        const sourceType = typeNameMap.get(link.sourceName);
        const targetType = typeNameMap.get(link.targetName);

        if (!sourceType || !targetType) {
            continue;
        }
        if (!classNames.has(sourceType) || !classNames.has(targetType)) {
            continue;
        }

        const key = associationKey(sourceType, targetType);
        const group = linkGroups.get(key) ?? { links: [], nameCandidates: [] };
        group.links.push(link);
        group.nameCandidates.push(link.linkName);
        linkGroups.set(key, group);
    }

    const result: InferredAssociation[] = [];
    for (const [key, group] of linkGroups) {
        const [sourceType, targetType] = key.split('→');

        const sourceInstanceCounts = new Map<string, number>();
        const targetInstanceCounts = new Map<string, number>();

        for (const link of group.links) {
            sourceInstanceCounts.set(link.sourceName, (sourceInstanceCounts.get(link.sourceName) ?? 0) + 1);
            targetInstanceCounts.set(link.targetName, (targetInstanceCounts.get(link.targetName) ?? 0) + 1);
        }

        const sourceInstancesOfType = parsed.instances.filter(i => i.typeName === sourceType);
        const targetInstancesOfType = parsed.instances.filter(i => i.typeName === targetType);

        const sourceCounts = sourceInstancesOfType.map(i => sourceInstanceCounts.get(i.name) ?? 0);
        const targetCounts = targetInstancesOfType.map(i => targetInstanceCounts.get(i.name) ?? 0);

        // In UML, the multiplicity at one end describes how many instances of
        // the opposite end can be linked to it.
        const sourceMult = computeMultiplicity(targetCounts);
        const targetMult = computeMultiplicity(sourceCounts);

        const name = group.nameCandidates.find(n => n != null && n.length > 0) ?? undefined;

        result.push({
            name,
            sourceTypeName: sourceType,
            targetTypeName: targetType,
            sourceMultiplicity: sourceMult,
            targetMultiplicity: targetMult
        });
    }

    return result;
}

/**
 * Compute a UML multiplicity string from observed instance link counts.
 */
function computeMultiplicity(counts: number[]): string {
    if (counts.every(c => c <= 1)) {
        return 'one';
    }

    return '*';
}

// ─── 6e — Conflict Resolution (Name Ambiguity) ───────────────────────────────

/**
 * Detect type names that differ only by case (e.g. "Person" vs "person").
 * Returns a ConflictReport for each ambiguous group.
 */
function detectNameConflicts(typeNames: string[]): ConflictReport[] {
    const lowerMap = new Map<string, string[]>();
    for (const name of typeNames) {
        const lower = name.toLowerCase();
        const bucket = lowerMap.get(lower) ?? [];
        bucket.push(name);
        lowerMap.set(lower, bucket);
    }

    const conflicts: ConflictReport[] = [];
    for (const [_, names] of lowerMap) {
        if (names.length > 1) {
            conflicts.push({
                kind: 'name_ambiguity',
                message: `Type names differ only by case: ${names.join(', ')}. Consider merging.`,
                conflictingNames: names
            });
        }
    }
    return conflicts;
}

// ─── Combined entry point ─────────────────────────────────────────────────────

export interface TransformOptions extends InferClassesOptions {}

/**
 * Full transformation: parse → infer classes → infer associations.
 */
export function transform(mockJson: string, options: TransformOptions = {}) {
    const parsed = parseMockData(mockJson);
    const { classes, conflicts } = inferClasses(parsed, options);
    const associations = inferAssociations(parsed, classes);
    return { parsed, classes, associations, conflicts };
}
