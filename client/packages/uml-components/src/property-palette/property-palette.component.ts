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
    ElementTextProperty,
    RefreshPropertyPaletteAction,
    UpdateElementPropertyAction
} from '@borkdominik-biguml/uml-common';
import { Action, DeleteElementOperation } from '@eclipse-glsp/protocol';
import { Checkbox as VSCodeCheckbox, Dropdown as VSCodeDropdown, TextField as VSCodeTextField } from '@vscode/webview-ui-toolkit';
import { html, nothing, PropertyValues, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { keyed } from 'lit/directives/keyed.js';
import { when } from 'lit/directives/when.js';
import { groupBy } from 'lodash';
import { BigElement } from '../base/component';
import '../global';
import { PropertyPaletteStyle } from './property-palette.style';
import { PropertyDeleteEventDetail, PropertyNameChangeDetail, PropertyOrderDetail } from './reference/property-palette-reference.component';

export function definePropertyPalette(): void {
    customElements.define('big-property-palette', PropertyPalette);
}

export class PropertyPalette extends BigElement {
    static override styles = [...super.styles, PropertyPaletteStyle.style];

    @property()
    clientId?: string;

    @property({ type: Object })
    properties?: ElementProperties = undefined;

    @state()
    protected searchText?: string;

    @state()
    protected navigationIds: { [key: string]: { from: string; to: string }[] } = {};

    protected override render(): TemplateResult<1> {
        return html`${keyed(this.properties?.elementId, html`<div>${this.headerTemplate()} ${this.bodyTemplate()}</div>`)}`;
    }

    protected override updated(changedProperties: PropertyValues<this>): void {
        if (changedProperties.has('properties') && this.clientId !== undefined) {
            const ids = this.navigationIds[this.clientId];

            if (this.properties === undefined || ids?.at(-1)?.to !== this.properties.elementId) {
                this.navigationIds[this.clientId] = [];
            }
        }
    }

    protected headerTemplate(): TemplateResult<1> {
        return html`<header>
            ${when(
                this.clientId && this.navigationIds[this.clientId]?.length > 0,
                () => html`
                    <vscode-button id="navigate-back" appearance="icon" @click="${this.onNavigateBack}"
                        ><span class="codicon codicon-chevron-left"></span
                    ></vscode-button>
                `,
                () => nothing
            )}
            <h3 class="title">Properties</h3>
            ${this.properties === undefined ? nothing : html`<h4 class="secondary-title">${this.properties?.label}</h4>`}
        </header>`;
    }

    protected bodyTemplate(): TemplateResult<1> {
        if (this.properties === undefined) {
            return html`<span class="no-data-message">The active diagram does not provide property information.</span>`;
        }

        const items = this.properties.items;
        const filteredItems = items.filter(item => {
            const label: string = (item as any)['label'];

            if (label !== undefined && this.searchText !== undefined) {
                return label.toLowerCase().includes(this.searchText.toLocaleLowerCase());
            }

            return true;
        });
        const { references: referenceItems, other: gridItems } = extractReferences(filteredItems);

        const gridTemplates = gridItems.map(item => {
            if (ElementTextProperty.is(item)) {
                return this.textFieldTemplate(item);
            } else if (ElementBoolProperty.is(item)) {
                return this.checkboxTemplate(item);
            } else if (ElementChoiceProperty.is(item)) {
                return this.dropdownTemplate(item);
            }

            return html`${nothing}`;
        });

        const referenceTemplates = referenceItems.map(item => {
            if (ElementReferenceProperty.is(item)) {
                return this.referenceTemplate(item);
            }

            return html`${nothing}`;
        });

        return html`<div class="body">
            <vscode-text-field
                id="search"
                placeholder="Search"
                .value="${this.searchText}"
                @input="${(event: any) => (this.searchText = event.target?.value)}"
            >
                <span slot="start" class="codicon codicon-search"></span>
            </vscode-text-field>
            <vscode-divider></vscode-divider>
            ${when(
                gridTemplates.length > 0,
                () => html`<div class="grid">${gridTemplates}</div>`,
                () => nothing
            )}
            ${when(
                gridTemplates.length > 0 && referenceTemplates.length > 0,
                () => html`<vscode-divider></vscode-divider>`,
                () => nothing
            )}
            ${referenceTemplates}
        </div>`;
    }

    protected textFieldTemplate(item: ElementTextProperty): TemplateResult<1> {
        const onChange = (event: CustomEvent): void => {
            const target = event.target as VSCodeTextField;
            this.onPropertyChange(item, target.value);
        };

        return html`<div class="grid-label">${item.label}</div>
            <div class="grid-value grid-flex">
                <vscode-text-field .value="${item.text}" @change="${onChange}"></vscode-text-field>
            </div>`;
    }

    protected checkboxTemplate(item: ElementBoolProperty): TemplateResult<1> {
        const onChange = (event: CustomEvent): void => {
            const target = event.target as VSCodeCheckbox;
            this.onPropertyChange(item, '' + target.checked);
        };

        return html`<div class="grid-label">${item.label}</div>
            <div class="grid-value">
                <vscode-checkbox class="bool-item" ?checked="${item.value}" @change="${onChange}"></vscode-checkbox>
            </div>`;
    }

    protected dropdownTemplate(item: ElementChoiceProperty): TemplateResult<1> {
        const onChange = (event: CustomEvent): void => {
            const target = event.target as VSCodeDropdown;
            this.onPropertyChange(item, target.value);
        };

        return html`<div class="grid-label">${item.label}</div>
            <div class="grid-value grid-flex">
                <vscode-dropdown .value="${item.choice}" @change="${onChange}">
                    <div slot="selected-value">${item.choices.find(c => c.value === item.choice)?.label}</div>
                    ${item.choices.map(
                        choice =>
                            html`<vscode-option .value="${choice.value}">
                                <div class="dropdown-option">
                                    <span>${choice.label}</span>
                                    ${when(
                                        choice.secondaryText,
                                        () => html`<small>${choice.secondaryText}</small>`,
                                        () => nothing
                                    )}
                                </div>
                            </vscode-option>`
                    )}
                </vscode-dropdown>
            </div>`;
    }

    protected referenceTemplate(item: ElementReferenceProperty): TemplateResult<1> {
        return html`<big-property-palette-reference
            .item="${item}"
            @property-navigate="${this.onPropertyNavigate}"
            @property-order-change="${this.onOrderChange}"
            @property-name-change="${this.onPropertyNameChange}"
            @property-create="${this.onPropertyCreate}"
            @property-delete="${this.onPropertyDelete}"
        ></big-property-palette-reference>`;
    }

    protected onNavigateBack(): void {
        if (this.clientId) {
            const ids = this.navigationIds[this.clientId];
            if (ids.length > 0) {
                const elementId = ids.pop()?.from;
                this.dispatchEvent(
                    new CustomEvent<Action>('dispatch-action', {
                        detail: RefreshPropertyPaletteAction.create({
                            elementId
                        })
                    })
                );
            }
        }
    }

    protected onPropertyChange(item: ElementProperty, value: string): void {
        const { elementId, propertyId } = item;

        this.dispatchEvent(
            new CustomEvent<Action>('dispatch-action', {
                detail: UpdateElementPropertyAction.create({
                    elementId,
                    propertyId,
                    value
                })
            })
        );
    }

    protected onOrderChange(event: CustomEvent<PropertyOrderDetail>): void {
        const { element, updates } = event.detail;

        this.dispatchEvent(
            new CustomEvent<Action>('dispatch-action', {
                detail: UpdateElementPropertyAction.create({
                    elementId: element.elementId,
                    propertyId: `${element.propertyId}_INDEX`,
                    value: JSON.stringify(updates)
                })
            })
        );
    }

    protected onPropertyNavigate(event: CustomEvent<ElementReferenceProperty.Reference>): void {
        const { elementId } = event.detail;
        if (this.properties && this.clientId) {
            this.navigationIds[this.clientId] = [
                ...(this.navigationIds[this.clientId] ?? []),
                {
                    from: this.properties.elementId,
                    to: elementId
                }
            ];
        }

        this.dispatchEvent(
            new CustomEvent<Action>('dispatch-action', {
                detail: RefreshPropertyPaletteAction.create({
                    elementId
                })
            })
        );
    }

    protected onPropertyNameChange(event: CustomEvent<PropertyNameChangeDetail>): void {
        const { elementId, name } = event.detail;

        this.dispatchEvent(
            new CustomEvent<Action>('dispatch-action', {
                detail: UpdateElementPropertyAction.create({
                    elementId,
                    propertyId: 'NAME',
                    value: name
                })
            })
        );
    }

    protected onPropertyCreate(event: CustomEvent<ElementReferenceProperty.CreateReference>): void {
        this.dispatchEvent(
            new CustomEvent<Action>('dispatch-action', {
                detail: event.detail.action
            })
        );
    }

    protected onPropertyDelete(event: CustomEvent<PropertyDeleteEventDetail>): void {
        this.dispatchEvent(
            new CustomEvent<Action>('dispatch-action', {
                detail: DeleteElementOperation.create(event.detail.elementIds)
            })
        );
    }
}

function extractReferences(items: ElementProperty[]): { references: ElementReferenceProperty[]; other: ElementProperty[] } {
    const group = groupBy(items, item => item.type === 'REFERENCE');

    return {
        references: (group['true'] as ElementReferenceProperty[]) ?? [],
        other: group['false'] ?? []
    };
}
