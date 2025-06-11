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

export class ActivityDiagramMatcher implements IMatcher {
    supports(type: string): boolean {
        return [
            'activity',
            'accepteventaction',
            'action',
            'sendsignalaction',
            'activitypartition',
            'activityfinalnode',
            'decisionnode',
            'flowfinalnode',
            'forknode',
            'initialnode',
            'joinnode',
            'mergenode',
            'activityparameternode',
            'centralbuffernode',
            'inputpin',
            'outputpin',
            'controlflow'
        ].includes(type.toLowerCase());
    }

    match(model: any): SearchResult[] {
        const results: SearchResult[] = [];
        const idToName = new Map<string, string>();
        const visited = new Set<string>();
        const pendingControlFlows: any[] = [];

        const sourceModel = model.getSourceModel();
        const rootElements = sourceModel?.packagedElement ?? [];

        // 1. Prvo prođemo sve elemente da mapiramo id → name
        SharedElementCollector.collectRecursively({ packagedElement: rootElements }, (element: any) => {
            if (element?.id) {
                const rawType = element.eClass?.split('#//')[1];
                const type = rawType ?? 'Unknown';
                const name = element.name ?? type;
                idToName.set(element.id, name);
            }
        });

        // 2. Sada idemo na stvarnu obradu
        SharedElementCollector.collectRecursively({ packagedElement: rootElements }, (element: any, parentName?: string) => {
            if (!element?.id) return;

            const uniqueKey = `${element.id}-${parentName ?? ''}`;
            if (visited.has(uniqueKey)) return;
            visited.add(uniqueKey);

            const rawType = element.eClass?.split('#//')[1];
            if (!rawType) return;

            const type = rawType;
            const normalizedType = type.toLowerCase();

            const name = element.name ?? type;

            // Ako postoji inPartition → koristi njegov naziv kao parentName
            let resolvedParentName = parentName;
            if (element.inPartition?.length > 0) {
                const refId = element.inPartition[0]?.$ref;
                if (refId && idToName.has(refId)) {
                    resolvedParentName = idToName.get(refId);
                }
            }

            const supportedTypes = [
                'activity',
                'accepteventaction',
                'sendsignalaction',
                'action',
                'activitypartition',
                'activityfinalnode',
                'decisionnode',
                'flowfinalnode',
                'forknode',
                'initialnode',
                'joinnode',
                'mergenode',
                'activityparameternode',
                'centralbuffernode',
                'inputpin',
                'outputpin',
                'controlflow'
            ];

            if (!supportedTypes.includes(normalizedType)) return;

            if (normalizedType === 'controlflow') {
                const fromId = element.source?.$ref ?? 'unknown';
                const toId = element.target?.$ref ?? 'unknown';
                const fromName = idToName.get(fromId) ?? fromId;

                pendingControlFlows.push({
                    id: element.id,
                    type: 'ControlFlow',
                    from: fromName,
                    toId,
                    parentName: resolvedParentName
                });
            } else {
                results.push({
                    id: element.id,
                    type,
                    name,
                    parentName: resolvedParentName
                });
            }
        });

        for (const rel of pendingControlFlows) {
            const toName = idToName.get(rel.toId) ?? '(unknown)';
            results.push({
                id: rel.id,
                type: rel.type,
                name: `${rel.from} → ${toName}`,
                parentName: rel.parentName,
                details: `ControlFlow from ${rel.from} to ${toName}`
            });
        }

        return results;
    }
}
