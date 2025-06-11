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

export class InformationFlowDiagramMatcher implements IMatcher {
    supports(type: string): boolean {
        return ['informationflow', 'actor', 'class'].includes(type.toLowerCase());
    }

    match(model: any): SearchResult[] {
        const results: SearchResult[] = [];
        const idToName = new Map<string, string>();
        const pendingRelations: any[] = [];

        const sourceModel = model.getSourceModel();
        const rootElements = sourceModel?.packagedElement ?? [];

        SharedElementCollector.collectRecursively({ packagedElement: rootElements }, (element, parentName) => {
            const type = element.eClass?.split('#//')[1];
            if (!type) return;

            const name = element.name ?? `<<${type}>>`;
            idToName.set(element.id, name);

            const anyElement = element as any;

            if (type === 'Actor' || type === 'Class') {
                results.push({
                    id: element.id,
                    type,
                    name,
                    parentName
                });
            }

            if (type === 'InformationFlow') {
                const fromId = anyElement.informationSource?.[0]?.$ref ?? 'unknown';
                const toId = anyElement.informationTarget?.[0]?.$ref ?? 'unknown';
                const fromName = idToName.get(fromId) ?? fromId;
                const toName = idToName.get(toId) ?? toId;

                results.push({
                    id: element.id,
                    type: 'InformationFlow',
                    name: `${fromName} → ${toName}`,
                    parentName,
                    details: `Information flows from ${fromName} to ${toName}`
                });
            }
        });

        for (const rel of pendingRelations) {
            const toName = idToName.get(rel.toId) ?? '(unknown)';
            results.push({
                id: rel.id,
                type: rel.type,
                name: `${rel.from} → ${toName}`,
                parentName: rel.parentName,
                details: `${rel.type} from ${rel.from} to ${toName}`
            });
        }

        return results;
    }
}
