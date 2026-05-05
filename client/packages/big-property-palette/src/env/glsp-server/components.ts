/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type {
    ElementBoolProperty,
    ElementChoiceProperty,
    ElementProperty,
    ElementReferenceProperty,
    ElementTextProperty
} from '@borkdominik-biguml/big-property-palette';
import type { PropertyPaletteNode, PropertyPaletteResult } from '../jsx/jsx-namespace.js';
import { normalizeChildren } from '../jsx/utils.js';

// ============================================================================
// PropertyPalette — top-level container component
// ============================================================================

export interface PropertyPaletteProps {
    elementId: string;
    label?: string;
    children?: PropertyPaletteNode;
}

export function PropertyPalette(props: PropertyPaletteProps): PropertyPaletteResult {
    const items = normalizeChildren(props.children) as ElementProperty[];
    return {
        elementId: props.elementId,
        palette: {
            elementId: props.elementId,
            label: props.label,
            items
        }
    };
}

// ============================================================================
// TextProperty
// ============================================================================

export interface TextPropertyProps {
    elementId: string;
    propertyId: string;
    text: string;
    label: string;
    disabled?: boolean;
}

export function TextProperty(props: TextPropertyProps): ElementTextProperty {
    return {
        elementId: props.elementId,
        propertyId: props.propertyId,
        type: 'TEXT',
        disabled: props.disabled ?? false,
        text: props.text,
        label: props.label
    };
}

// ============================================================================
// BoolProperty
// ============================================================================

export interface BoolPropertyProps {
    elementId: string;
    propertyId: string;
    value: boolean;
    label: string;
    disabled?: boolean;
}

export function BoolProperty(props: BoolPropertyProps): ElementBoolProperty {
    return {
        elementId: props.elementId,
        propertyId: props.propertyId,
        type: 'BOOL',
        disabled: props.disabled ?? false,
        value: props.value,
        label: props.label
    };
}

// ============================================================================
// ChoiceProperty
// ============================================================================

export interface ChoicePropertyProps {
    elementId: string;
    propertyId: string;
    choices: ReadonlyArray<{ label: string; value: string; secondaryText?: string }>;
    choice: string;
    label: string;
    disabled?: boolean;
}

export function ChoiceProperty(props: ChoicePropertyProps): ElementChoiceProperty {
    return {
        elementId: props.elementId,
        propertyId: props.propertyId,
        type: 'CHOICE',
        disabled: props.disabled ?? false,
        choices: props.choices as ElementChoiceProperty['choices'],
        choice: props.choice,
        label: props.label
    };
}

// ============================================================================
// ReferenceProperty
// ============================================================================

export interface ReferencePropertyProps {
    elementId: string;
    propertyId: string;
    label: string;
    references: ElementReferenceProperty.Reference[];
    creates: ElementReferenceProperty.CreateReference[];
    disabled?: boolean;
    isOrderable?: boolean;
    isAutocomplete?: boolean;
}

export function ReferenceProperty(props: ReferencePropertyProps): ElementReferenceProperty {
    return {
        elementId: props.elementId,
        propertyId: props.propertyId,
        type: 'REFERENCE',
        disabled: props.disabled ?? false,
        label: props.label,
        references: props.references,
        creates: props.creates,
        isOrderable: props.isOrderable ?? false,
        isAutocomplete: props.isAutocomplete ?? false
    };
}
