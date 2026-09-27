/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

/**
 * How a label's id names the property it stands for.
 *
 * A label is `<elementId>_<property>_label`, with the property written in snake case - `_name_label`,
 * `_body_label`, `_guard_label`, `_source_modifiers_label`. The renderers write ids this way and the
 * label edit handler reads them back, which is what lets an edit on any label land in the right
 * property without the handler knowing which element it was on.
 */

const LABEL_SUFFIX = '_label';

/** The id of the label standing for `property` of the element with `elementId`. */
export function propertyLabelId(elementId: string, property: string): string {
    return `${elementId}_${toSnakeCase(property)}${LABEL_SUFFIX}`;
}

/**
 * The property a label stands for, given the id of the element the label belongs to - or `undefined`
 * for a label whose id does not follow the convention.
 */
export function labelProperty(labelId: string, elementId: string): string | undefined {
    if (!labelId.startsWith(`${elementId}_`) || !labelId.endsWith(LABEL_SUFFIX)) {
        return undefined;
    }
    const property = labelId.slice(elementId.length + 1, -LABEL_SUFFIX.length);
    return property.length > 0 ? toCamelCase(property) : undefined;
}

function toSnakeCase(property: string): string {
    return property.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
}

function toCamelCase(property: string): string {
    return property.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
}
