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

export class DeploymentDiagramMatcher implements IMatcher {
    supports(type: string): boolean {
        return [
            'artifact',
            'deploymentspecification',
            'device',
            'executionenvironment',
            'model',
            'node',
            'package',
            'operation',
            'property',
            'communicationpath',
            'dependency',
            'generalization',
            'manifestation'
        ].includes(type.toLowerCase());
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

            const allowedElements = [
                'Artifact',
                'DeploymentSpecification',
                'Device',
                'ExecutionEnvironment',
                'Model',
                'Node',
                'Package',
                'Operation',
                'Property'
            ];
            if (allowedElements.includes(type)) {
                results.push({ id: element.id, type, name, parentName });
            }

            const anyElement = element as any;

            if (['CommunicationPath', 'Dependency', 'Deployment', 'Generalization', 'Manifestation'].includes(type)) {
                let fromName = '';
                let toId = '';

                switch (type) {
                    case 'CommunicationPath':
                        fromName = idToName.get(anyElement.source?.$ref ?? '') ?? 'unknown';
                        toId = anyElement.target?.$ref ?? 'unknown';
                        break;
                    case 'Dependency':
                    case 'Manifestation':
                        fromName = idToName.get(anyElement.client?.[0]?.$ref ?? '') ?? 'unknown';
                        toId = anyElement.supplier?.[0]?.$ref ?? 'unknown';
                        break;
                    case 'Deployment':
                        fromName = idToName.get(anyElement.location?.$ref ?? '') ?? 'unknown';
                        toId = idToName.get(anyElement.deployedArtifact?.[0]?.$ref ?? '') ?? 'unknown';
                        break;
                    case 'Generalization':
                        fromName = idToName.get(anyElement.specific?.$ref ?? '') ?? 'unknown';
                        toId = anyElement.general?.$ref ?? 'unknown';
                        break;
                }

                pendingRelations.push({
                    id: element.id,
                    type,
                    from: fromName,
                    toId,
                    parentName
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
