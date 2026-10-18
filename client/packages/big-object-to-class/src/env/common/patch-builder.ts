/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { v4 as uuidv4 } from 'uuid';
import type { InferredAssociation, InferredClass, ParsedInstanceData } from './types.js';

interface JsonPatchAdd {
    op: 'add';
    path: string;
    value: Record<string, unknown>;
}

export function buildPatches(params: {
    parsed: ParsedInstanceData;
    classes: InferredClass[];
    associations: InferredAssociation[];
    entityPath?: string;
    relationPath?: string;
}): JsonPatchAdd[] {
    const { parsed, classes, associations, entityPath = '/diagram/entities', relationPath = '/diagram/relations' } = params;

    const patches: JsonPatchAdd[] = [];
    // The id format of the model server: the AST type, then a random UUID.
    const createId = (type: string) => `${type}_${uuidv4()}`;
    const classIdBy = new Map<string, string>();
    const classPropertyByFeature = new Map<string, Map<string, { id: string; name: string }>>();
    const associationIdByPair = new Map<string, string>();
    const associationNameByPair = new Map<string, string | undefined>();

    // ─── 1. Create Classes ───
    classes.forEach((cls, index) => {
        const id = createId('Class');
        classIdBy.set(cls.name, id);
        const propertyMap = new Map<string, { id: string; name: string }>();
        const classWidth = 220;
        const classHeight = Math.max(86, 86 + cls.properties.length * 24);

        const classValue = {
            $type: 'Class',
            __id: id,
            name: cls.name,
            isAbstract: false,
            isActive: false,
            visibility: 'PUBLIC',
            bounds: { $type: 'Bounds', x: 100 + index * 200, y: 100, width: classWidth, height: classHeight },
            properties: cls.properties.map(p => {
                const propId = createId('Property');
                const propName = p.name === 'name' ? 'p_name' : p.name;
                propertyMap.set(p.name, { id: propId, name: propName });
                return {
                    $type: 'Property',
                    __id: propId,
                    name: propName,
                    isDerived: false,
                    isDerivedUnion: false,
                    isOrdered: false,
                    isReadOnly: false,
                    isStatic: false,
                    isUnique: true,
                    multiplicity: '1',
                    visibility: 'PUBLIC'
                };
            }),
            operations: []
        };
        classPropertyByFeature.set(cls.name, propertyMap);

        patches.push({ op: 'add', path: `${entityPath}/-`, value: classValue });
    });

    // ─── 2. Create Associations / Generalizations ───
    associations.forEach(assoc => {
        const sId = classIdBy.get(assoc.sourceTypeName);
        const tId = classIdBy.get(assoc.targetTypeName);

        if (!sId || !tId) return;

        const associationId = createId(assoc.relationType === 'GENERALIZATION' ? 'Generalization' : 'Association');

        // Define common properties for ALL relations
        const relationBase: any = {
            __id: associationId,
            source: createReference(sId),
            target: createReference(tId)
        };

        if (assoc.relationType === 'GENERALIZATION') {
            relationBase.$type = 'Generalization';
            relationBase.isSubstitutable = true;
        } else {
            // Logic for ASSOCIATION
            relationBase.$type = 'Association';
            relationBase.sourceAggregation = 'NONE';
            relationBase.targetAggregation = 'NONE';
            relationBase.visibility = 'PUBLIC';
            relationBase.sourceMultiplicity = formatMultiplicity(assoc.sourceMultiplicity);
            relationBase.targetMultiplicity = formatMultiplicity(assoc.targetMultiplicity);

            if (assoc.name && assoc.name.trim().length > 0) {
                relationBase.name = assoc.name;
            }
        }

        patches.push({
            op: 'add',
            path: `${relationPath}/-`,
            value: relationBase
        });
    });

    // ─── 3. Create InstanceSpecifications ───
    const instanceIdByName = new Map<string, string>();
    let instanceIndex = 0;

    const createSlot = (definingProperty: { id: string; name: string }, name: string, value: string) => {
        return {
            $type: 'Slot',
            __id: createId('Slot'),
            name: name,
            definingFeature: createReference(definingProperty.id, definingProperty.name),
            values: [
                {
                    $type: 'LiteralSpecification',
                    __id: createId('LiteralSpecification'),
                    name: value,
                    value: value
                }
            ]
        };
    };

    parsed.instances.forEach(inst => {
        const classId = classIdBy.get(inst.typeName);
        if (!classId) {
            throw new Error(`Cannot create instance "${inst.name}": no inferred class for type "${inst.typeName}".`);
        }

        const instanceId = createId('InstanceSpecification');
        instanceIdByName.set(inst.name, instanceId);

        const properties = classPropertyByFeature.get(inst.typeName) ?? new Map();
        const usedFeatures = new Set<string>();
        const slots = inst.slots.flatMap(slot => {
            const definingProperty = properties.get(slot.featureName);
            if (!definingProperty) {
                return [];
            }
            usedFeatures.add(slot.featureName);
            return [createSlot(definingProperty, definingProperty.name, normalizeLiteralToken(slot.value))];
        });

        const cls = classes.find(c => c.name === inst.typeName);
        cls?.properties.forEach(p => {
            if (p.isOptional && !usedFeatures.has(p.name)) {
                const definingProperty = properties.get(p.name);
                if (definingProperty) {
                    slots.push(createSlot(definingProperty, '_', '_'));
                }
            }
        });

        const col = instanceIndex % 4;
        const row = Math.floor(instanceIndex / 4);
        instanceIndex++;

        patches.push({
            op: 'add',
            path: `${entityPath}/-`,
            value: {
                $type: 'InstanceSpecification',
                __id: instanceId,
                name: inst.name,
                visibility: 'PUBLIC',
                classifier: createReference(classId, inst.typeName),
                slots,
                bounds: {
                    $type: 'Bounds',
                    x: 100 + col * 280,
                    y: 320 + row * 180,
                    width: 160,
                    height: Math.max(70, 40 + slots.length * 20)
                }
            }
        });
    });

    // ─── 4. Create InstanceLinks ───
    parsed.links.forEach(link => {
        const sourceId = instanceIdByName.get(link.sourceName);
        const targetId = instanceIdByName.get(link.targetName);
        if (!sourceId || !targetId) {
            return;
        }

        const sourceType = parsed.instances.find(i => i.name === link.sourceName)?.typeName;
        const targetType = parsed.instances.find(i => i.name === link.targetName)?.typeName;
        const associationKey = sourceType && targetType ? `${sourceType}→${targetType}` : undefined;
        const associationId = associationKey ? associationIdByPair.get(associationKey) : undefined;
        const associationName = associationKey ? associationNameByPair.get(associationKey) : undefined;
        const resolvedLinkName = normalizeLinkName(
            associationName ?? link.linkName ?? `${sourceType ?? link.sourceName}_${targetType ?? link.targetName}`
        );

        patches.push({
            op: 'add',
            path: `${relationPath}/-`,
            value: {
                $type: 'InstanceLink',
                __id: createId('InstanceLink'),
                name: resolvedLinkName,
                ...(associationId ? { association: createReference(associationId, associationName) } : {}),
                source: createReference(sourceId, link.sourceName),
                target: createReference(targetId, link.targetName)
            }
        });
    });

    return patches;
}

function normalizeLiteralToken(value: string): string {
    const trimmed = value.trim();
    const lower = trimmed.toLowerCase();

    let normalized = trimmed
        .replace(/[\s:]+/g, '_')
        .replace(/\s+/g, '-')
        .replace(/\./g, '_')
        .replace(/\//g, '-')
        .replace(/[^\w*-]/g, '');

    if (lower === 'true' || lower === 'false') {
        return `b_${lower}`;
    }

    const isDate = /^(\d{4}[-/]\d{2}[-/]\d{2})([-T ]\d{2,}([:]\d{2})?([:]\d{2})?)?$/.test(trimmed);
    if (isDate) {
        normalized = `t_${normalized}`; // Ensure consistent hyphens
    }

    const isNumeric = /^-?\d+(\.\d+)?$/.test(trimmed);

    if (isNumeric && normalized.length > 0 && !normalized.startsWith('n')) {
        normalized = `n_${normalized}`;
    }

    if (/^\d/.test(normalized)) {
        normalized = `_${normalized}`;
    }

    return normalized.length > 0 ? normalized : 'unknown';
}

function normalizeLinkName(value: string): string {
    const trimmed = value.trim();
    const normalized = trimmed
        .replace(/\s+/g, '_')
        .replace(/\./g, '_')
        .replace(/[^\w*-]/g, '');
    return normalized.length > 0 ? normalized : 'link';
}

/** A reference to the element with the given id in the same document, as the model server stores one. */
function createReference(id: string, name?: string): Record<string, unknown> {
    return { ref: { __id: id }, $refText: name ?? id };
}

/** The multiplicity of an association end: `*` for many, `1` otherwise. */
function formatMultiplicity(m?: string): string {
    const manyMarkers = ['*', 'many', 'n', '0..*', '1..*', '*..*', '0..n', '1..n'];
    return m && manyMarkers.includes(m.trim().toLowerCase()) ? '*' : '1';
}
