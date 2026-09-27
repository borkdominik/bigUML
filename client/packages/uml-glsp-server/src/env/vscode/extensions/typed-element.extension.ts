/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { storableText } from '@borkdominik-biguml/uml-glsp-server';
import type * as jsonpatch from 'fast-json-patch';
import { injectable } from 'inversify';
import type { AstNode } from 'langium';
import type { LabelEdit, MutationExtension, PropertyUpdate } from '../features/mutation/extension/mutation-extension.js';
import { classifierNamed, isTypedProperty, TYPED_PROPERTIES } from '../notation/typed-element.js';

/**
 * The type of a property or a parameter, typed in the property palette or on the canvas. What is typed
 * is stored as a reference where it names exactly one type of the model, and as the text itself where
 * it does not - one or the other, the property left over being removed (see `TYPED_PROPERTIES`).
 */
@injectable()
export class TypedElementExtension implements MutationExtension {
    updateProperty({ operation, element, elementPath }: PropertyUpdate): jsonpatch.Operation[] | undefined {
        if (!isTypedProperty(operation.property) || typeof operation.value !== 'string') {
            return undefined;
        }
        if (!element || !elementPath) {
            return [];
        }
        return typePatch(elementPath, element, operation.property, operation.value);
    }

    editLabel({ node, property, elementPath, text }: LabelEdit): jsonpatch.Operation[] | undefined {
        if (!property || !isTypedProperty(property)) {
            return undefined;
        }
        return typePatch(elementPath, node, property, text);
    }
}

function typePatch(elementPath: string, element: AstNode, property: string, text: string): jsonpatch.Operation[] {
    const referenceProperty = TYPED_PROPERTIES[property];
    const stored = element as unknown as Record<string, unknown>;
    // Filtered the way any other text property is: a bracket the grammar has no terminal for would be
    // written, and the file would not read back.
    const typed = storableText(text);
    const classifier = typed !== undefined ? classifierNamed(element, typed) : undefined;

    const patch: jsonpatch.Operation[] = [];
    const remove = (name: string): void => {
        if (stored[name] !== undefined) {
            patch.push({ op: 'remove', path: `${elementPath}/${name}` });
        }
    };

    if (classifier) {
        patch.push({
            op: 'add',
            path: `${elementPath}/${referenceProperty}`,
            value: { ref: { __id: classifier.__id, __documentUri: classifier.$document?.uri }, $refText: classifier.__id }
        });
        remove(property);
    } else {
        if (typed !== undefined) {
            patch.push({ op: 'add', path: `${elementPath}/${property}`, value: typed });
        } else {
            remove(property);
        }
        remove(referenceProperty);
    }
    return patch;
}
