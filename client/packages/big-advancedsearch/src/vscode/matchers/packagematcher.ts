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

export class PackageDiagramMatcher implements IMatcher {
    supports(type: string): boolean {
        return ['package', 'class', 'elementimport', 'packageimport', 'packagemerge', 'dependency', 'usage', 'abstraction'].includes(
            type.toLowerCase()
        );
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

            if (type === 'Package' || type === 'Class') {
                results.push({ id: element.id, type, name, parentName });
            }

            if (anyElement.packageImport) {
                for (const imp of anyElement.packageImport) {
                    pendingRelations.push({
                        id: imp.id ?? `pkgimport-${element.id}`,
                        type: 'PackageImport',
                        from: name,
                        toId: imp.importedPackage?.$ref ?? 'unknown',
                        parentName
                    });
                }
            }

            if (anyElement.packageMerge) {
                for (const merge of anyElement.packageMerge) {
                    pendingRelations.push({
                        id: merge.id ?? `pkgmerge-${element.id}`,
                        type: 'PackageMerge',
                        from: name,
                        toId: merge.mergedPackage?.$ref ?? 'unknown',
                        parentName
                    });
                }
            }

            if (anyElement.elementImport) {
                for (const imp of anyElement.elementImport) {
                    pendingRelations.push({
                        id: imp.id ?? `elemimport-${element.id}`,
                        type: 'ElementImport',
                        from: name,
                        toId: imp.importedElement?.$ref ?? 'unknown',
                        parentName
                    });
                }
            }

            const binaryRelations = ['Dependency', 'Abstraction', 'Usage'];
            if (binaryRelations.includes(type) && anyElement.client?.length && anyElement.supplier?.length) {
                const clientId = anyElement.client[0]?.$ref ?? 'unknown';
                const supplierId = anyElement.supplier[0]?.$ref ?? 'unknown';
                pendingRelations.push({
                    id: element.id,
                    type,
                    from: idToName.get(clientId) ?? clientId,
                    toId: supplierId,
                    parentName
                });
            }
        });

        for (const rel of pendingRelations) {
            const toName = idToName.get(rel.toId) ?? '(unknown)';
            const arrow = `${rel.from} → ${toName}`;
            const details = `${rel.type} from ${rel.from} to ${toName}`;

            results.push({
                id: rel.id,
                type: rel.type,
                name: arrow,
                parentName: rel.parentName,
                details
            });
        }

        return results;
    }
}
