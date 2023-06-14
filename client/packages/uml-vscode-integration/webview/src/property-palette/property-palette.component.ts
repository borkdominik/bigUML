/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import {
    ElementBoolPropertyItem,
    ElementChoicePropertyItem,
    ElementReferencePropertyItem,
    ElementTextPropertyItem,
    PropertyPalette as Palette
} from '@borkdominik-biguml/uml-common';
import { css, html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BigUMLComponent } from '../webcomponents/component';

import '../vscode/toolkit';
import './property-palette-reference.component';

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
    palette?: Palette = undefined;

    override render(): TemplateResult<1> {
        return html`<div>${this.renderHeader()} ${this.renderBody()}</div>`;
    }

    protected renderHeader(): TemplateResult<1> {
        return html`<header><h3 class="title">Properties</h3></header>`;
    }

    protected renderBody(): TemplateResult<1> {
        if (this.palette === undefined) {
            return html`<span>Properties not available.</span>`;
        }

        const rows = this.palette.items.map(item => {
            if (ElementTextPropertyItem.is(item)) {
                return this.renderTextFieldItem(item);
            } else if (ElementBoolPropertyItem.is(item)) {
                return this.renderCheckboxItem(item);
            } else if (ElementChoicePropertyItem.is(item)) {
                return this.renderDropdownItem(item);
            }

            return html``;
        });

        const references = this.palette.items.map(item => {
            if (ElementReferencePropertyItem.is(item)) {
                return this.renderReferenceItem(item);
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

    protected renderTextFieldItem(item: ElementTextPropertyItem): TemplateResult<1> {
        return html`<vscode-data-grid-row>
            <vscode-data-grid-cell grid-column="1">${item.label}</vscode-data-grid-cell>
            <vscode-data-grid-cell grid-column="2">
                <vscode-text-field class="text-item" .value="${item.text}"></vscode-text-field>
            </vscode-data-grid-cell>
        </vscode-data-grid-row>`;
    }

    protected renderCheckboxItem(item: ElementBoolPropertyItem): TemplateResult<1> {
        return html`<vscode-data-grid-row>
            <vscode-data-grid-cell grid-column="1">${item.label}</vscode-data-grid-cell>
            <vscode-data-grid-cell grid-column="2">
                <vscode-checkbox class="bool-item" ?checked="${item.value}"></vscode-checkbox>
            </vscode-data-grid-cell>
        </vscode-data-grid-row>`;
    }

    protected renderDropdownItem(item: ElementChoicePropertyItem): TemplateResult<1> {
        return html`<vscode-data-grid-row>
            <vscode-data-grid-cell grid-column="1">${item.label}</vscode-data-grid-cell>
            <vscode-data-grid-cell grid-column="2">
                <vscode-dropdown .value="${item.choice}">
                    ${item.choices.map(choice => html`<vscode-option .value="${choice.value}">${choice.label}</vscode-option>`)}
                </vscode-dropdown>
            </vscode-data-grid-cell>
        </vscode-data-grid-row>`;
    }

    protected renderReferenceItem(item: ElementReferencePropertyItem): TemplateResult<1> {
        return html`<biguml-property-palette-reference .item="${item}"></biguml-property-palette-reference>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'biguml-property-palette': PropertyPalette;
    }
}
