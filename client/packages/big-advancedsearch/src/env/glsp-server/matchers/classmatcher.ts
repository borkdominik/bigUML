/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

// classmatcher.ts

import type { ClassDiagram, ClassDiagramEdges, ClassDiagramNodes } from '@borkdominik-biguml/uml-model-server/grammar';

import { EDITABLE_SPECS } from '../../common/search-filter-spec.js';
import type { SearchResult } from '../../common/searchresult.js';
import type { IMatcher } from './IMatcher.js';
import { matchesCriteriaOnElement } from './matcher-utils.js';
import type { SearchCriteria } from './search-ast.js';
import { SharedElementCollector } from './sharedcollector.js';

export class ClassDiagramMatcher implements IMatcher {
    private readonly supportedTypes = [
        'class',
        'abstractclass',
        'interface',
        'enumeration',
        'enumerationliteral',
        'primitivetype',
        'datatype',
        'package',
        'instancespecification',
        'slot',
        'literalspecification',
        'property',
        'operation',
        'parameter',
        'association',
        'aggregation',
        'composition',
        'generalization',
        'dependency',
        'abstraction',
        'usage',
        'realization',
        'interfacerealization',
        'substitution',
        'packageimport',
        'packagemerge'
    ];

    supports(type: string): boolean {
        return this.supportedTypes.includes(type.toLowerCase());
    }

    supportsPartial(partialType: string): boolean {
        return this.supportedTypes.some(type => type.startsWith(partialType.toLowerCase()));
    }

    supportsList(): string[] {
        return this.supportedTypes;
    }

    match(diagram: ClassDiagram): SearchResult[] {
        const results: SearchResult[] = [];
        const idToName = this.collectIdToName(diagram);

        this.collectNodeResults(diagram, results);
        this.collectRelationResults(diagram, results, idToName);

        return results;
    }

    matchAdvanced(diagram: ClassDiagram, criteria: SearchCriteria): SearchResult[] {
        const candidates = this.match(diagram);
        const diagramIndex = this.buildDiagramIndex(diagram);

        return candidates.filter(candidate => {
            const element = diagramIndex.get(candidate.id);
            return matchesCriteriaOnElement(element, criteria, diagramIndex);
        });
    }

    private collectIdToName(diagram: ClassDiagram): Map<string, string> {
        const idToName = new Map<string, string>();

        SharedElementCollector.collectRecursively(diagram as any, element => {
            if (element.__id && element.$type) {
                idToName.set(element.__id, element.name ?? `<<${element.$type}>>`);
            }
        });

        return idToName;
    }

    private collectNodeResults(diagram: ClassDiagram, results: SearchResult[]): void {
        SharedElementCollector.collectRecursively(diagram as any, (element, parentName) => {
            const type = element.$type;
            const id = element.__id;

            if (!type || !id) {
                return;
            }

            const name = element.name ?? `<<${type}>>`;
            const properties = this.extractProperties(element);

            switch (type) {
                case 'Class':
                case 'AbstractClass':
                case 'Interface':
                case 'DataType':
                case 'Enumeration':
                case 'PrimitiveType':
                case 'Package':
                case 'InstanceSpecification':
                case 'LiteralSpecification':
                    results.push({ id, type, name, parentName, properties });
                    break;

                case 'Property':
                    results.push({
                        id,
                        type,
                        name,
                        parentName,
                        details: this.buildTypedDetails(element.propertyType?.$refText, parentName),
                        properties
                    });
                    break;

                case 'Operation':
                    results.push({
                        id,
                        type,
                        name,
                        parentName,
                        details: parentName ? `In ${parentName}` : undefined,
                        properties
                    });
                    break;

                case 'Parameter':
                    results.push({
                        id,
                        type,
                        name,
                        parentName,
                        details: this.buildTypedDetails(element.parameterType?.$refText, parentName),
                        properties
                    });
                    break;

                case 'EnumerationLiteral':
                    results.push({
                        id,
                        type,
                        name,
                        parentName,
                        details: parentName ? `In Enumeration ${parentName}` : undefined,
                        properties
                    });
                    break;

                case 'Slot':
                    results.push({
                        id,
                        type,
                        name,
                        parentName,
                        details: element.definingFeature?.$refText ? `Feature: ${element.definingFeature.$refText}` : undefined,
                        properties
                    });
                    break;
            }
        });
    }

    private collectRelationResults(diagram: ClassDiagram, results: SearchResult[], idToName: Map<string, string>): void {
        for (const relation of diagram.relations ?? []) {
            const type = relation.$type;

            if (!type || !relation.__id) {
                continue;
            }

            const sourceId = relation.source?.ref?.__id;
            const targetId = relation.target?.ref?.__id;

            const sourceName = relation.source?.ref?.name ?? relation.source?.$refText ?? idToName.get(sourceId ?? '') ?? '(unknown)';

            const targetName = relation.target?.ref?.name ?? relation.target?.$refText ?? idToName.get(targetId ?? '') ?? '(unknown)';
            const relationName =
                'name' in relation && relation.name ? `${relation.name}: ${sourceName} → ${targetName}` : `${sourceName} → ${targetName}`;

            results.push({
                id: relation.__id,
                type,
                name: relationName,
                details: `${type} from ${sourceName} to ${targetName}`,
                properties: this.extractProperties(relation),
                sourceId,
                targetId
            });
        }
    }

    private extractProperties(element: any): Record<string, string> | undefined {
        const props: Record<string, string> = {};

        for (const spec of EDITABLE_SPECS) {
            const raw = element[spec.astField ?? spec.key];

            if (spec.valueType === 'boolean') {
                if (typeof raw === 'boolean') {
                    props[spec.key] = String(raw);
                }
            } else if (typeof raw === 'string' && raw.trim().length > 0) {
                props[spec.key] = raw;
            }
        }

        return Object.keys(props).length > 0 ? props : undefined;
    }

    private buildTypedDetails(typeName?: string, parentName?: string): string | undefined {
        if (typeName) {
            return `${typeName} in ${parentName ?? ''}`;
        }

        if (parentName) {
            return `In ${parentName}`;
        }

        return undefined;
    }

    private buildDiagramIndex(diagram: ClassDiagram): Map<string, ClassDiagramNodes | ClassDiagramEdges> {
        const diagramIndex = new Map<string, ClassDiagramNodes | ClassDiagramEdges>();

        SharedElementCollector.collectRecursively(diagram as any, element => {
            if (element?.__id) {
                diagramIndex.set(element.__id, element);
            }
        });

        for (const relation of diagram.relations ?? []) {
            if (relation.__id) {
                diagramIndex.set(relation.__id, relation);
            }
        }

        return diagramIndex;
    }
}