/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import '../vscode/toolkit';
import '../vscode/vscode-menu.component';

import { ElementReferenceProperty } from '@borkdominik-biguml/uml-common';
import { css, html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BigUMLComponent } from '../webcomponents/component';

export interface PropertyDeleteEventDetail {
    elementIds: string[];
}

@customElement('biguml-property-palette-reference')
export class PropertyPaletteReference extends BigUMLComponent {
    static override styles = [
        ...super.styles,
        css`
            :host {
                display: flex;
                flex-direction: column;
            }

            .header {
                display: flex;
                flex-direction: row;
            }

            .header > .title {
                flex: 1;
                font-size: 11px;
            }

            .header > .actions {
                display: flex;
                flex-direction: column;
                justify-content: center;
            }

            .body > .actions {
                display: flex;
                flex-direction: row;
            }

            .reference-item {
                display: flex;
                flex-direction: row;
                margin-bottom: 6px;
            }

            .reference-item > .label {
                flex: 1;
            }

            .reference-item .delete {
                color: var(--uml-errorForeground);
            }
        `
    ];

    @property()
    readonly item?: ElementReferenceProperty = undefined;

    override render(): TemplateResult<1> {
        if (this.item === undefined) {
            return html`<span>Item not available.</span>`;
        }

        return html`${this.renderHeader(this.item)} ${this.renderBody(this.item)}`;
    }

    protected renderHeader(item: ElementReferenceProperty): TemplateResult<1> {
        return html`
            <div class="header">
                <h4 class="title">${item.label}</h4>
                <div class="actions">
                    <biguml-vscode-menu
                        data-context-menu
                        data-vscode-context='{"webviewSection": "property-item-reference-menu", "preventDefaultContextMenuItems": true}'
                    >
                        <vscode-button appearance="icon">
                            <span class="codicon codicon-ellipsis"></span>
                        </vscode-button>
                    </biguml-vscode-menu>
                </div>
            </div>
        `;
    }

    protected renderBody(item: ElementReferenceProperty): TemplateResult<1> {
        return html`<div class="body">
            ${item.references.map(
                ref => html`<div class="reference-item">
                    <span class="label">${ref.label}</span>
                    <vscode-button appearance="icon" @click="${() => this.onDelete(ref.elementId)}">
                        <span class="codicon codicon-trash"></span>
                    </vscode-button>
                </div>`
            )}
            <div class="actions">
                <vscode-button appearance="primary" @click="${() => this.onCreate(item.creates[0])}"> Add </vscode-button>
            </div>
        </div>`;
    }

    protected onCreate(create: ElementReferenceProperty.CreateReference): void {
        this.dispatchEvent(
            new CustomEvent<ElementReferenceProperty.CreateReference>('property-create', {
                detail: {
                    ...create
                }
            })
        );
    }

    protected onDelete(elementId: string): void {
        this.dispatchEvent(
            new CustomEvent<PropertyDeleteEventDetail>('property-delete', {
                detail: {
                    elementIds: [elementId]
                }
            })
        );
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'biguml-property-palette-reference': PropertyPaletteReference;
    }
}
