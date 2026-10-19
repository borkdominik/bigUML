/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { ParsedInstance, ParsedInstanceData, ParsedLink } from './types.js';

/**
 * 6a — Parse a mock data JSON string into the intermediate representation.
 *
 * Expected input shape:
 * {
 *   "instances": [
 *     { "name": "alice", "type": "Person", "slots": { "name": "Alice", "age": 30 } }
 *   ],
 *   "links": [
 *     { "source": "alice", "target": "addr1", "name": "livesAt" }
 *   ]
 * }
 */
export function parseMockData(json: string): ParsedInstanceData {
    const raw = JSON.parse(json);
    if (typeof raw !== 'object' || raw == null) {
        throw new Error('Mock data must be a JSON object.');
    }

    if (!Array.isArray(raw.instances)) {
        throw new Error('Mock data must contain an "instances" array.');
    }
    if (raw.links != null && !Array.isArray(raw.links)) {
        throw new Error('"links" must be an array when provided.');
    }

    const instances: ParsedInstance[] = raw.instances.map((inst: any, index: number) => {
        const name = typeof inst?.name === 'string' ? inst.name.trim() : '';
        const typeName = typeof inst?.type === 'string' ? inst.type.trim() : '';
        if (!name) {
            throw new Error(`Instance at index ${index} is missing a non-empty "name".`);
        }
        if (!typeName) {
            throw new Error(`Instance "${name}" is missing a non-empty "type".`);
        }

        const slotsObject = inst?.slots ?? {};
        if (typeof slotsObject !== 'object' || slotsObject == null || Array.isArray(slotsObject)) {
            throw new Error(`Instance "${name}" has invalid "slots" (expected object).`);
        }

        return {
            name,
            typeName,
            slots: Object.entries(slotsObject).map(([featureName, value]) => ({
                featureName: String(featureName),
                value: String(value)
            }))
        };
    });

    const links: ParsedLink[] = (raw.links ?? []).map((link: any, index: number) => {
        const sourceName = typeof link?.source === 'string' ? link.source.trim() : '';
        const targetName = typeof link?.target === 'string' ? link.target.trim() : '';
        if (!sourceName || !targetName) {
            throw new Error(`Link at index ${index} must contain non-empty "source" and "target".`);
        }
        const linkName = typeof link?.name === 'string' ? link.name.trim() : undefined;
        return {
            sourceName,
            targetName,
            linkName: linkName && linkName.length > 0 ? linkName : undefined
        };
    });

    const existingInstanceNames = new Set(instances.map(i => i.name));
    for (const link of links) {
        if (!existingInstanceNames.has(link.sourceName)) {
            throw new Error(`Link source "${link.sourceName}" does not match any instance name.`);
        }
        if (!existingInstanceNames.has(link.targetName)) {
            throw new Error(`Link target "${link.targetName}" does not match any instance name.`);
        }
    }

    return { instances, links };
}
