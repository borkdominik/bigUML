/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import '../vscode/toolkit';
import './property-palette-reference.component';

import {
    ElementBoolProperty,
    ElementChoiceProperty,
    ElementProperties,
    ElementProperty,
    ElementReferenceProperty,
    ElementTextProperty
} from '@borkdominik-biguml/uml-common';
import { Checkbox as VSCodeCheckbox, Dropdown as VSCodeDropdown, TextField as VSCodeTextField } from '@vscode/webview-ui-toolkit';
import { css, html, nothing, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BigUMLComponent } from '../webcomponents/component';
import { PropertyDeleteEventDetail } from './property-palette-reference.component';

export interface PropertyChangeEventDetail {
    elementId: string;
    propertyId: string;
    value: string;
}

@customElement('biguml-property-palette')
export class PropertyPalette extends BigUMLComponent {
    static override styles = [
        ...super.styles,
        css`
            .body {
                display: flex;
                flex-direction: column;
            }

            .search {
                margin-bottom: 6px;
            }

            vscode-data-grid-row > vscode-data-grid-cell:first-child {
                padding-left: 0;
            }

            vscode-data-grid-row > vscode-data-grid-cell:last-child {
                padding-right: 0;
            }

            vscode-data-grid-row vscode-dropdown {
                width: 100%;
            }

            .reference-item .create-reference {
                color: var(--uml-successBackground);
            }

            .reference-item .delete {
                color: var(--uml-errorForeground);
            }
        `
    ];

    @property()
    properties?: ElementProperties = undefined;

    override render(): TemplateResult<1> {
        return html`<div>${this.renderHeader()} ${this.renderBody()}</div>`;
    }

    protected renderHeader(): TemplateResult<1> {
        return html`<header>
            <h3 class="title">Properties</h3>
            <h4 class="secondary-title">${this.properties?.label ?? nothing}</h4>
        </header>`;
    }

    protected renderBody(): TemplateResult<1> {
        if (this.properties === undefined) {
            return html`<span>Properties are not available.</span>`;
        }

        const rows = this.properties.items.map(item => {
            if (ElementTextProperty.is(item)) {
                return this.renderTextFieldElement(item);
            } else if (ElementBoolProperty.is(item)) {
                return this.renderCheckboxElement(item);
            } else if (ElementChoiceProperty.is(item)) {
                return this.renderDropdownElement(item);
            }

            return html``;
        });

        const references = this.properties.items.map(item => {
            if (ElementReferenceProperty.is(item)) {
                return this.renderReferenceElement(item);
            }

            return html``;
        });

        return html`<div class="body">
            <vscode-text-field class="search" placeholder="Search">
                <span slot="start" class="codicon codicon-search"></span>
            </vscode-text-field>
            <vscode-divider></vscode-divider>
            <vscode-data-grid grid-template-columns="1fr 1fr"> ${rows} </vscode-data-grid>
            <vscode-divider></vscode-divider>
            ${references}
        </div>`;
    }

    protected renderTextFieldElement(item: ElementTextProperty): TemplateResult<1> {
        const onChange = (event: CustomEvent): void => {
            const target = event.target as VSCodeTextField;
            this.onPropertyChange(item, target.value);
        };

        return html`<vscode-data-grid-row>
            <vscode-data-grid-cell grid-column="1">${item.label}</vscode-data-grid-cell>
            <vscode-data-grid-cell grid-column="2">
                <vscode-text-field class="text-item" .value="${item.text}" @change="${onChange}"></vscode-text-field>
            </vscode-data-grid-cell>
        </vscode-data-grid-row>`;
    }

    protected renderCheckboxElement(item: ElementBoolProperty): TemplateResult<1> {
        const onChange = (event: CustomEvent): void => {
            const target = event.target as VSCodeCheckbox;
            this.onPropertyChange(item, '' + target.checked);
        };

        return html`<vscode-data-grid-row>
            <vscode-data-grid-cell grid-column="1">${item.label}</vscode-data-grid-cell>
            <vscode-data-grid-cell grid-column="2">
                <vscode-checkbox class="bool-item" ?checked="${item.value}" @change="${onChange}"></vscode-checkbox>
            </vscode-data-grid-cell>
        </vscode-data-grid-row>`;
    }

    protected renderDropdownElement(item: ElementChoiceProperty): TemplateResult<1> {
        const onChange = (event: CustomEvent): void => {
            const target = event.target as VSCodeDropdown;
            this.onPropertyChange(item, target.value);
        };

        return html`<vscode-data-grid-row>
            <vscode-data-grid-cell grid-column="1">${item.label}</vscode-data-grid-cell>
            <vscode-data-grid-cell grid-column="2">
                <vscode-dropdown .value="${item.choice}" @change="${onChange}">
                    ${item.choices.map(choice => html`<vscode-option .value="${choice.value}">${choice.label}</vscode-option>`)}
                </vscode-dropdown>
            </vscode-data-grid-cell>
        </vscode-data-grid-row>`;
    }

    protected renderReferenceElement(item: ElementReferenceProperty): TemplateResult<1> {
        return html`<biguml-property-palette-reference
            .item="${item}"
            @property-create="${this.onPropertyCreate}"
            @property-delete="${this.onPropertyDelete}"
        ></biguml-property-palette-reference>`;
    }

    protected onPropertyChange(item: ElementProperty, value: string) {
        this.dispatchEvent(
            new CustomEvent<PropertyChangeEventDetail>('property-change', {
                detail: {
                    elementId: item.elementId,
                    propertyId: item.propertyId,
                    value
                }
            })
        );
    }

    protected onPropertyCreate(event: CustomEvent<ElementReferenceProperty.CreateReference>): void {
        this.dispatchEvent(new CustomEvent('property-create', event));
    }

    protected onPropertyDelete(event: CustomEvent<PropertyDeleteEventDetail>): void {
        this.dispatchEvent(new CustomEvent('property-delete', event));
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'biguml-property-palette': PropertyPalette;
    }
}
