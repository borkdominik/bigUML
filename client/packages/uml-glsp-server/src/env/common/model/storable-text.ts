/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

/**
 * What a typed value is stored as.
 *
 * Every string in the model file is a JSON string, written with `JSON.stringify` and read back with
 * `JSON.parse` (see the `STRING` terminal), so any character can be stored. What is taken out here is
 * only what the value is not: the blanks around it, and - for a value drawn in notation - the notation.
 */

/**
 * The characters notation wraps a free-text value in: the brackets of a guard, the braces of a property
 * string. They come back in the text when such a label is edited in place, and are taken off again here.
 */
const NOTATION_CHARACTER = /[[\]{}]/g;

/**
 * A free-text value as it is stored: without the notation it is drawn in, and `undefined` where nothing
 * is left of it - a property that holds nothing is removed rather than written empty.
 */
export function storableText(text: string): string | undefined {
    return text.replace(NOTATION_CHARACTER, '').trim() || undefined;
}

/** A note's text as it is stored - prose, which keeps every character it was written with. */
export function storableProse(text: string): string | undefined {
    return text.trim() || undefined;
}

/** A name as it is stored - any text at all, `[ok]`, `{abstract}`, `Schüler/in` and `List<T>` alike. */
export function storableName(text: string): string | undefined {
    return text.trim() || undefined;
}
