/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    ElementBoolProperty,
    ElementChoiceProperty,
    ElementProperties,
    ElementProperty,
    ElementReferenceProperty,
    ElementTextProperty
} from '@borkdominik-biguml/biguml-protocol';

export class PropertyPalette {
    static builder(): PropetyPaletteBuilder {
        return new PropetyPaletteBuilder();
    }
    static DEFAULT_VISIBILITY_CHOICES = [
        { label: 'public', value: 'PUBLIC' },
        { label: 'private', value: 'PRIVATE' },
        { label: 'protected', value: 'PROTECTED' },
        { label: 'package', value: 'PACKAGE' }
    ];
    static DEFAULT_AGGREGATION_CHOICES = [
        { label: 'none', value: 'NONE' },
        { label: 'shared', value: 'SHARED' },
        { label: 'composite', value: 'COMPOSITE' }
    ];
    static DEFAULT_CONCURRENCY_CHOICES = [
        { label: 'sequential', value: 'SEQUENTIAL' },
        { label: 'guarded', value: 'GUARDED' },
        { label: 'concurrent', value: 'CONCURRENT' }
    ];
    static DEFAULT_PARAMETER_DIRECTION_CHOICES = [
        { label: 'in', value: 'IN' },
        { label: 'out', value: 'OUT' },
        { label: 'inout', value: 'INOUT' },
        { label: 'return', value: 'RETURN' }
    ];
    static DEFAULT_EFFECT_CHOICES = [
        { label: 'create', value: 'CREATE' },
        { label: 'read', value: 'READ' },
        { label: 'update', value: 'UPDATE' },
        { label: 'delete', value: 'DELETE' }
    ];
}

export class PropetyPaletteBuilder {
    proxy: {
        elementId?: string;
        label?: string;
        items: Array<ElementProperty>;
    } = { items: [] };

    elementId(elementId: string): PropetyPaletteBuilder {
        this.proxy.elementId = elementId;
        return this;
    }
    label(label: string): PropetyPaletteBuilder {
        this.proxy.label = label;
        return this;
    }

    text(elementId: string, propertyId: string, text: string, label: string): PropetyPaletteBuilder {
        this.proxy.items.push({
            elementId,
            propertyId,
            type: 'TEXT',
            disabled: false,
            text,
            label
        } as ElementTextProperty);
        return this;
    }

    bool(elementId: string, propertyId: string, value: boolean, label: string): PropetyPaletteBuilder {
        this.proxy.items.push({
            elementId,
            propertyId,
            type: 'BOOL',
            value,
            label
        } as ElementBoolProperty);
        return this;
    }

    choice(
        elementId: string,
        propertyId: string,
        choices: Array<{ label: string; value: string }>,
        choice: string,
        label: string
    ): PropetyPaletteBuilder {
        this.proxy.items.push({
            elementId,
            propertyId,
            type: 'CHOICE',
            choices,
            choice,
            label
        } as ElementChoiceProperty);
        return this;
    }

    reference(
        elementId: string,
        propertyId: string,
        label: string,
        references: ElementReferenceProperty.Reference[],
        creates: ElementReferenceProperty.CreateReference[]
    ): PropetyPaletteBuilder {
        this.proxy.items.push({
            elementId,
            propertyId,
            disabled: false,
            type: 'REFERENCE',
            references,
            creates,
            label,
            isOrderable: false,
            isAutocomplete: false
        } as ElementReferenceProperty);
        return this;
    }

    build(): { elementId: string; palette?: ElementProperties } {
        return {
            elementId: this.proxy.elementId,
            palette: {
                elementId: this.proxy.elementId,
                label: this.proxy.label,
                items: this.proxy.items
            }
        };
    }
}
