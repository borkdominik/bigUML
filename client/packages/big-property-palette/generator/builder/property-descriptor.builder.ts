/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { type Declaration, Decorator, lcFirst, type Property, toConstant, toHuman } from '@borkdominik-biguml/uml-language-tooling';
import { optionConstant } from '../utils/declaration.utils.js';

export interface PropertyDescriptor {
    type: 'text' | 'bool' | 'choice' | 'reference';
    id: string;
    label: string;
    valueExpr?: string;
    choicesExpr?: string;
    choiceExpr?: string;
    referencesExpr?: string;
    createsExpr?: string;
}

export function buildPropertyDescriptor(prop: Property, declarations: Declaration[]): PropertyDescriptor | undefined {
    if (Decorator.has(prop.decorators, 'skip')) return;

    const dynDec = Decorator.find(prop.decorators, 'dynamic');
    if (dynDec) {
        const typeName = Decorator.getArg<string>(dynDec) ?? '';
        const choicesVar = `${lcFirst(typeName)}Choices`;
        return {
            type: 'choice',
            id: prop.name,
            label: toHuman(prop.name),
            choicesExpr: choicesVar,
            choiceExpr: `(semanticElement.${prop.name} as any)?.ref?.__id ? (semanticElement.${prop.name} as any).ref.__id + '_refValue' : ''`
        };
    }

    if (Decorator.has(prop.decorators, 'reference')) return;
    if (prop.types?.[0]?.type === 'constant') return;

    const id = prop.name;
    const first = prop.types?.[0];
    const mult = prop.multiplicity;

    if (mult === '*') {
        const typeName = first?.typeName ?? 'Element';
        const modelConst = toConstant(typeName);
        const label = toHuman(typeName);
        return {
            type: 'reference',
            id,
            label: toHuman(id),
            referencesExpr: [
                `(semanticElement.${id} ?? [])`,
                `.filter((e: any) => !!e && !!e.__id)`,
                `.map((e: any) => ({`,
                `    elementId: e.__id,`,
                `    label: e.name ?? '(unnamed ${toConstant(typeName).toLowerCase()})',`,
                `    name: e.name ?? '',`,
                `    deleteActions: [DeleteElementOperation.create([e.__id])]`,
                `}))`
            ].join('\n                            '),
            createsExpr: `[{ label: 'Create ${label}', action: CreateNodeOperation.create(ClassDiagramNodeTypes.${modelConst}, { containerId: semanticElement.__id }) }]`
        };
    }

    if (first?.typeName === 'boolean') {
        return { type: 'bool', id, label: id, valueExpr: `!!semanticElement.${id}` };
    }

    if (first?.typeName === 'string' || first?.typeName === 'number') {
        const val = first.typeName === 'number' ? `String(semanticElement.${id})` : `semanticElement.${id}`;
        return { type: 'text', id, label: toHuman(id), valueExpr: `${val}!` };
    }

    const constant = optionConstant(first?.typeName ?? '', declarations);
    if (constant) {
        return {
            type: 'choice',
            id,
            label: toHuman(first!.typeName),
            choicesExpr: `PropertyPaletteChoices.${constant}`,
            choiceExpr: `semanticElement.${id}!`
        };
    }

    return;
}
