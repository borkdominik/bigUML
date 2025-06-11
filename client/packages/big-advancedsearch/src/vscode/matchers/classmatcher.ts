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

export class ClassDiagramMatcher implements IMatcher {
    supports(type: string): boolean {
        return [
            'class',
            'interface',
            'enumeration',
            'primitivetype',
            'datatype',
            'attribute',
            'method',
            'literal',
            'association',
            'generalization',
            'dependency',
            'realization',
            'abstraction',
            'usage',
            'interfaceRealization',
            'substitution',
            'aggregation',
            'composition'
        ].includes(type.toLowerCase());
    }

    match(model: any): SearchResult[] {
        const results: SearchResult[] = [];
        const idToName = new Map<string, string>();
        const propertyIdToTypeId = new Map<string, string>();
        const pendingRelations: any[] = [];

        const sourceModel = model.getSourceModel();
        const rootElements = sourceModel?.packagedElement ?? [];

        SharedElementCollector.collectRecursively({ packagedElement: rootElements }, (element, parentName) => {
            const type = element.eClass?.split('#//')[1];
            if (!type) return;

            const name = element.name ?? `<<${type}>>`;
            idToName.set(element.id, name);

            const relevantTypes = ['Class', 'Interface', 'Enumeration', 'PrimitiveType', 'DataType'];
            if (relevantTypes.includes(type)) {
                results.push({ id: element.id, type, name, parentName });
            }

            const anyElement = element as any;

            if (anyElement.ownedAttribute) {
                for (const attr of anyElement.ownedAttribute) {
                    if (attr.type?.$ref) {
                        propertyIdToTypeId.set(attr.id, attr.type.$ref);
                    }
                    results.push({
                        id: attr.id,
                        type: 'Attribute',
                        name: attr.name ?? 'Unnamed',
                        parentName: name,
                        details: `In ${type} ${name}`
                    });
                }
            }

            if (anyElement.ownedOperation) {
                for (const op of anyElement.ownedOperation) {
                    results.push({
                        id: op.id,
                        type: 'Method',
                        name: op.name ?? 'Unnamed',
                        parentName: name,
                        details: `In ${type} ${name}`
                    });
                }
            }

            if (anyElement.ownedLiteral) {
                for (const lit of anyElement.ownedLiteral) {
                    results.push({
                        id: lit.id,
                        type: 'Literal',
                        name: lit.name ?? 'Unnamed',
                        parentName: name,
                        details: `In Enumeration ${name}`
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

            if (type === 'Association' && anyElement.memberEnd?.length === 2) {
                const [end1Id, end2Id] = anyElement.memberEnd.map((m: any) => m.$ref ?? 'unknown');
                pendingRelations.push({
                    id: element.id,
                    type: 'Association',
                    end1: end1Id,
                    end2: end2Id,
                    parentName
                });
            }

            const binaryRelations = [
                'Abstraction',
                'Dependency',
                'Usage',
                'Realization',
                'InterfaceRealization',
                'Substitution',
                'Aggregation',
                'Composition'
            ];

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

        // Obrada relacija nakon skupljanja imena
        for (const rel of pendingRelations) {
            if (rel.type === 'Association') {
                const type1 = propertyIdToTypeId.get(rel.end1);
                const type2 = propertyIdToTypeId.get(rel.end2);
                const name1 = type1 ? (idToName.get(type1) ?? '(unknown)') : '(unknown)';
                const name2 = type2 ? (idToName.get(type2) ?? '(unknown)') : '(unknown)';
                results.push({
                    id: rel.id,
                    type: 'Association',
                    name: `${name1} — ${name2}`,
                    parentName: rel.parentName,
                    details: `Association between ${name1} and ${name2}`
                });
                continue;
            }

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
