/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { SearchResult } from '../../common/searchresult.js';
import type { IMatcher } from './IMatcher.js';
import { SharedElementCollector } from './sharedcollector.js';

export class StateMachineDiagramMatcher implements IMatcher {
    supports(type: string): boolean {
        return [
            'statemachine',
            'region',
            'state',
            'pseudostate',
            'choice',
            'deephistory',
            'finalstate',
            'fork',
            'initialstate',
            'join',
            'shallowhistory',
            'transition'
        ].includes(type.toLowerCase());
    }

    match(model: any): SearchResult[] {
        const results: SearchResult[] = [];
        const idToName = new Map<string, string>();
        const visited = new Set<string>();
        const pendingTransitions: any[] = [];

        const sourceModel = model.getSourceModel();
        const rootElements = sourceModel?.packagedElement ?? [];

        const kindToTypeMap: Record<string, string> = {
            initial: 'InitialState',
            deephistory: 'DeepHistory',
            shallowhistory: 'ShallowHistory',
            choice: 'Choice',
            fork: 'Fork',
            join: 'Join'
        };

        SharedElementCollector.collectRecursively({ packagedElement: rootElements }, (element: any, parentName?: string) => {
            if (!element?.id) return;

            const uniqueKey = `${element.id}-${parentName ?? ''}`;
            if (visited.has(uniqueKey)) return;
            visited.add(uniqueKey);

            // Determine type
            let rawType = element.eClass?.split('#//')[1] ?? null;

            // fallback za kind ako nema eClass
            if (!rawType && element.kind) {
                const kind = element.kind.toLowerCase();
                rawType = kindToTypeMap[kind] ?? 'Pseudostate';
            }

            // fallback za transition (nema eClass, ali ima source/target)
            if (!rawType && element.source && element.target) {
                rawType = 'Transition';
            }

            if (!rawType) return;

            // Uključi precizne tipove za Pseudostate
            let type = rawType;
            if (type === 'Pseudostate' && element.kind) {
                const kind = element.kind.toLowerCase();
                type = kindToTypeMap[kind] ?? 'Pseudostate';
            }

            const normalizedType = type.toLowerCase();

            const name = element.name?.trim() !== '' ? element.name : type;
            idToName.set(element.id, name);

            const supportedTypes = [
                'statemachine',
                'region',
                'state',
                'pseudostate',
                'choice',
                'deephistory',
                'finalstate',
                'fork',
                'initialstate',
                'join',
                'shallowhistory',
                'transition'
            ];

            if (!supportedTypes.includes(normalizedType)) return;

            if (normalizedType === 'transition') {
                const fromId = element.source?.$ref ?? 'unknown';
                const toId = element.target?.$ref ?? 'unknown';
                const fromName = idToName.get(fromId) ?? fromId;

                pendingTransitions.push({
                    id: element.id,
                    type: 'Transition',
                    from: fromName,
                    toId,
                    parentName
                });
            } else {
                results.push({
                    id: element.id,
                    type,
                    name,
                    parentName
                });
            }
        });

        // Dodaj sve transition veze
        for (const rel of pendingTransitions) {
            const toName = idToName.get(rel.toId) ?? '(unknown)';
            results.push({
                id: rel.id,
                type: rel.type,
                name: `${rel.from} → ${toName}`,
                parentName: rel.parentName,
                details: `Transition from ${rel.from} to ${toName}`
            });
        }

        return results;
    }
}
