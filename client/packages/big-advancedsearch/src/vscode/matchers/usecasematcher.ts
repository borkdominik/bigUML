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

export class UseCaseDiagramMatcher implements IMatcher {
    private readonly supportedTypes = ['usecase', 'actor', 'subject', 'association', 'extend', 'include', 'generalization'];

    supports(type: string): boolean {
        return this.supportedTypes.includes(type.toLowerCase());
    }

    supportsPartial(partialType: string): boolean {
        return this.supportedTypes.some(t => t.startsWith(partialType.toLowerCase()));
    }

    supportsList(): string[] {
        return this.supportedTypes;
    }

    match(model: any): SearchResult[] {
        const results: SearchResult[] = [];
        const idToName = new Map<string, string>();
        const pendingRelations: any[] = [];

        const sourceModel = model.getSourceModel();
        const rootElements = sourceModel?.packagedElement ?? [];

        SharedElementCollector.collectRecursively({ packagedElement: rootElements }, (element, parentName) => {
            console.log('Debug element:', {
                id: element.id,
                name: element.name,
                eClass: element.eClass,
                keys: Object.keys(element)
            });

            let type = element.eClass?.split('#//')[1];

            // Ako nema eClass, pokušaj prepoznati UseCase ručno
            if (!type) {
                if (element.name && !element.$ref && !element.x && !element.y && !element.width && !element.height) {
                    type = 'UseCase';
                } else {
                    return;
                }
            }

            // Spriječi false-positive UseCase unutar StateMachine
            if (parentName?.toLowerCase().includes('statemachine') || parentName?.toLowerCase().includes('region')) {
                if (!['Actor', 'UseCase', 'Subject'].includes(type)) {
                    return;
                }
            }

            const name = element.name ?? `<<${type}>>`;
            idToName.set(element.id, name);

            const allowedTypes = ['usecase', 'actor', 'subject', 'association', 'extend', 'include', 'generalization'];
            if (!allowedTypes.includes(type.toLowerCase())) return;

            // Dodaj osnovne elemente
            if (['Actor', 'Subject', 'UseCase'].includes(type)) {
                results.push({ id: element.id, type, name, parentName });
            }

            // Relacije
            const anyElement = element as any;

            if (anyElement.include) {
                for (const inc of anyElement.include) {
                    pendingRelations.push({
                        id: inc.id ?? `include-${element.id}`,
                        type: 'Include',
                        from: name,
                        toId: inc.addition?.$ref ?? 'unknown',
                        parentName
                    });
                }
            }

            if (anyElement.extend) {
                for (const ext of anyElement.extend) {
                    pendingRelations.push({
                        id: ext.id ?? `extend-${element.id}`,
                        type: 'Extend',
                        from: name,
                        toId: ext.extendedCase?.$ref ?? 'unknown',
                        parentName
                    });
                }
            }

            if (anyElement.generalization) {
                for (const gen of anyElement.generalization) {
                    pendingRelations.push({
                        id: gen.id ?? `gen-${element.id}`,
                        type: 'Generalization',
                        from: name,
                        toId: gen.general?.$ref ?? 'unknown',
                        parentName
                    });
                }
            }

            // Association (samo ako obje strane imaju reference)
            if (type === 'Association' && anyElement.memberEnd?.length === 2) {
                const [end1, end2] = anyElement.memberEnd;
                const name1 = idToName.get(end1?.$ref ?? '') ?? '(unknown)';
                const name2 = idToName.get(end2?.$ref ?? '') ?? '(unknown)';
                results.push({
                    id: element.id,
                    type: 'Association',
                    name: `${name1} — ${name2}`,
                    parentName,
                    details: `Association between ${name1} and ${name2}`
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
