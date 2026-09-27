/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { type Classifier, isClassifier } from '@borkdominik-biguml/uml-model-server/grammar';
import { type AstNode, AstUtils } from 'langium';

/**
 * The type of a property or a parameter is stored in one of two properties, never both: a reference to
 * a type of the model, which follows that type when it is renamed, or a name typed in for anything the
 * model does not declare. This names the pairs, text first - the text property is the one the palette
 * and the canvas edit, and what they show is whichever of the two is set.
 */
export const TYPED_PROPERTIES: Readonly<Record<string, string>> = {
    propertyType: 'propertyTypeRef',
    parameterType: 'parameterTypeRef'
};

export function isTypedProperty(property: string): boolean {
    return property in TYPED_PROPERTIES;
}

interface TypeReference {
    ref?: { name?: string };
}

/**
 * The type an element is shown with: the name of the type it references, or the name typed in for it.
 * `property` is the text property of the pair - `propertyType` or `parameterType`.
 */
export function typeNameOf(element: unknown, property: string): string | undefined {
    const values = element as Record<string, unknown> | undefined;
    const reference = values?.[TYPED_PROPERTIES[property]] as TypeReference | undefined;
    return reference?.ref?.name ?? (values?.[property] as string | undefined);
}

/** The types of the model `element` is part of that it can be typed with, in the order they are declared. */
export function classifiersOf(element: AstNode): Classifier[] {
    return AstUtils.streamAllContents(AstUtils.findRootNode(element))
        .filter(isClassifier)
        .filter(classifier => !!classifier.name)
        .toArray();
}

/**
 * The type of the model a typed name stands for: the one type called exactly that. A name that matches
 * none stays text; one that matches several is not guessed at and stays text too.
 */
export function classifierNamed(element: AstNode, name: string): Classifier | undefined {
    const matches = classifiersOf(element).filter(classifier => classifier.name === name);
    return matches.length === 1 ? matches[0] : undefined;
}
