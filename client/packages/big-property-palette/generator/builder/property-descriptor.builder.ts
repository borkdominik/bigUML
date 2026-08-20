/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { type Declaration, Decorator, lcFirst, type Property, toConstant, toHuman } from '@borkdominik-biguml/uml-language-tooling';
import { isAbstractType, isEdgeType, isInDiagramTypes, optionConstant } from '../utils/declaration.utils.js';

export interface PropertyDescriptor {
    type: 'text' | 'bool' | 'choice' | 'reference';
    id: string;
    label: string;
    /** Label taken from the property's type, preferred over `label` where it is unambiguous. */
    typeLabel?: string;
    valueExpr?: string;
    choicesExpr?: string;
    choiceExpr?: string;
    referencesExpr?: string;
    createsExpr?: string;
}

export function buildPropertyDescriptor(prop: Property, declarations: Declaration[], diagramName: string): PropertyDescriptor | undefined {
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
            choiceExpr: `(context.semanticElement.${prop.name} as any)?.ref?.__id ? (context.semanticElement.${prop.name} as any).ref.__id + '_refValue' : ''`
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

        let createsExpr: string | undefined;
        if (!isAbstractType(typeName, declarations) && isInDiagramTypes(typeName, diagramName, declarations)) {
            // A relation cannot be created the way a contained node is. `CreateNodeOperation` carries a
            // container and nothing else, but a relation is defined by the two elements it runs between -
            // one made this way would be stored with no source and no target, and every reader of the
            // model has to filter those out rather than draw them. Arming the edge creation tool instead
            // lets the two ends be picked on the canvas, which is the only place they can come from.
            createsExpr = isEdgeType(typeName, declarations)
                ? `[{ label: 'Create ${label}', action: TriggerEdgeCreationAction.create(context.languageMetadata.convertToElementType('${typeName}')) }]`
                : `[{ label: 'Create ${label}', action: CreateNodeOperation.create(context.languageMetadata.convertToElementType('${typeName}'), { containerId: context.semanticElement.__id }) }]`;
        }

        return {
            type: 'reference',
            id,
            label: toHuman(id),
            referencesExpr: [
                `(context.semanticElement.${id} ?? [])`,
                `.filter((e: any) => !!e && !!e.__id)`,
                `.map((e: any) => ({`,
                `    elementId: e.__id,`,
                `    label: e.name ?? '(unnamed ${toConstant(typeName).toLowerCase()})',`,
                `    name: e.name ?? '',`,
                `    deleteActions: [DeleteElementOperation.create([e.__id])]`,
                `}))`
            ].join('\n                            '),
            createsExpr: createsExpr ?? '[]'
        };
    }

    if (first?.typeName === 'boolean') {
        return { type: 'bool', id, label: id, valueExpr: `!!context.semanticElement.${id}` };
    }

    if (first?.typeName === 'string' || first?.typeName === 'number') {
        // A number is written out to be typed into a text field. Only where it is set, though: an unset
        // one went through `String(undefined)` and showed the field holding the word `undefined`, which
        // reads as a value someone put there.
        const val =
            first.typeName === 'number'
                ? `context.semanticElement.${id} !== undefined ? String(context.semanticElement.${id}) : ''`
                : `context.semanticElement.${id}!`;
        return { type: 'text', id, label: toHuman(id), valueExpr: val };
    }

    const constant = optionConstant(first?.typeName ?? '', declarations);
    if (constant) {
        return {
            type: 'choice',
            id,
            // The type name is the better label where it can be used - `TransitionKind` says more than
            // `kind` - so it is offered as `typeLabel` and the renderer prefers it. But a type is shared
            // and a property name is not: two properties of one type would both be labelled with it, and
            // a transition's two connection points would come out as two fields called "Connection
            // Point" with nothing to tell them apart. The property name is the fallback for that case,
            // which only the renderer can detect, since it is the first place all of an element's
            // properties are known at once.
            label: toHuman(id),
            typeLabel: toHuman(first!.typeName),
            choicesExpr: `PropertyPaletteChoices.${constant}`,
            choiceExpr: `context.semanticElement.${id}!`
        };
    }

    return;
}
