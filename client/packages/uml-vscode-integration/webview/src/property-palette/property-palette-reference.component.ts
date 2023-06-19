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
import { css, html, nothing, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { keyed } from 'lit/directives/keyed.js';
import { when } from 'lit/directives/when.js';
import Sortable from 'sortablejs';
import { BigUMLComponent } from '../webcomponents/component';

export interface PropertyDeleteEventDetail {
    elementIds: string[];
}

export interface PropertyNameChangeDetail {
    elementId: string;
    name: string;
}

export interface PropertyOrderDetail {
    element: ElementReferenceProperty;
    updates: {
        elementId: string;
        oldIndex: number;
        newIndex: number;
    }[];
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
                flex-direction: column;
                margin-bottom: 6px;
            }

            .reference-item-body > .label,
            .reference-item-body > .name {
                flex: 1;
                margin-right: 6px;
            }

            .reference-item-body > .name {
                display: flex;
                flex-direction: column;
            }

            .reference-item-body {
                display: flex;
                flex-direction: row;
                align-items: center;
            }

            .reference-item-body > .item-actions {
                display: flex;
                flex-direction: row;
            }

            .reference-item .hint-text {
                margin: 6px 0 6px 16px;
            }

            .reference-item-body .delete {
                color: var(--uml-errorForeground);
            }
        `
    ];

    @property({ type: Object })
    readonly item?: ElementReferenceProperty = undefined;

    @query('#items')
    protected readonly itemsElement: HTMLDivElement;

    protected sortable?: Sortable;

    protected override render(): TemplateResult<1> {
        if (this.item === undefined) {
            return html`<div>Item not available.</div>`;
        }

        return html`${this.renderHeader(this.item)} ${this.renderBody(this.item)}`;
    }

    protected override firstUpdated(): void {
        const item = this.item;
        if (item !== undefined && item.isOrderable) {
            let childNodes: ChildNode[] = [];
            // https://github.com/SortableJS/Sortable/issues/546
            this.sortable = Sortable.create(this.itemsElement, {
                animation: 100,
                handle: '.handle',
                onStart: e => {
                    const node = e.item as Node;
                    // Remember the list of child nodes when drag started.
                    childNodes = Array.prototype.slice.call(node.parentNode!.childNodes);
                    // Filter out the 'sortable-fallback' element used on mobile/old browsers.
                    childNodes = childNodes.filter(
                        node => node.nodeType != Node.ELEMENT_NODE || !(node as HTMLElement).classList.contains('sortable-fallback')
                    );
                },
                onEnd: e => {
                    const { oldIndex, newIndex } = e;

                    if (oldIndex === undefined || newIndex === undefined) {
                        return;
                    }

                    const elementId = e.item.getAttribute('data-id');
                    if (elementId === null) {
                        return;
                    }

                    // Undo DOM changes by re-adding all children in their original order.
                    const node = e.item as Node;
                    const parentNode = node.parentNode!;
                    for (const childNode of childNodes) {
                        parentNode.appendChild(childNode);
                    }
                    if (e.oldIndex == e.newIndex) return;
                    const element = this.item!.references.splice(oldIndex, 1)[0];
                    this.item!.references.splice(newIndex, 0, element!);
                    this.requestUpdate();

                    this.onOrderChange({
                        element: item,
                        updates: [
                            {
                                elementId,
                                oldIndex,
                                newIndex
                            }
                        ]
                    });
                }
            });
        }
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
                            <div class="codicon codicon-ellipsis"></div>
                        </vscode-button>
                    </biguml-vscode-menu>
                </div>
            </div>
        `;
    }

    protected renderBody(item: ElementReferenceProperty): TemplateResult<1> {
        return html`<div class="body">
            <div id="items">${item.references.map(ref => html`${this.renderItem(item, ref)}`)}</div>
            <div class="actions">
                <vscode-button appearance="primary" @click="${() => this.onCreate(item.creates[0])}"> Add </vscode-button>
            </div>
        </div>`;
    }

    protected renderItem(item: ElementReferenceProperty, ref: ElementReferenceProperty.Reference): TemplateResult<1> {
        return html`${keyed(
            ref.elementId,
            html`<div class="reference-item" data-id="${ref.elementId}">
                <div class="reference-item-body">
                    ${when(
                        item.isOrderable,
                        () => html`<div class="handle codicon codicon-gripper"></div>`,
                        () => nothing
                    )}
                    ${when(
                        ref.name === undefined,
                        () => html`<div class="label">${ref.label}</div>`,
                        () => html`<div class="name">
                            <vscode-text-field
                                .value="${ref.name}"
                                @change="${(event: any) => this.onNameChange(ref, event.target?.value)}"
                            >
                            </vscode-text-field>
                        </div>`
                    )}
                    <div class="item-actions">
                        <vscode-button appearance="icon" @click="${() => this.onDelete(ref.elementId)}">
                            <div class="codicon codicon-trash"></div>
                        </vscode-button>
                        <vscode-button appearance="icon" @click="${() => this.onNavigate(ref)}">
                            <div class="codicon codicon-chevron-right"></div>
                        </vscode-button>
                    </div>
                </div>
                ${when(
                    ref.hint !== undefined,
                    () => html`<div class="hint-text">${ref.hint}</div>`,
                    () => nothing
                )}
            </div>`
        )}`;
    }

    protected onNavigate(item: ElementReferenceProperty.Reference): void {
        /*this.dispatchEvent(
            new CustomEvent<ElementReferenceProperty.Reference>('property-navigate', {
                detail: item
            })
        );
        */
    }

    protected onOrderChange(detail: PropertyOrderDetail): void {
        this.dispatchEvent(
            new CustomEvent<PropertyOrderDetail>('property-order-change', {
                detail
            })
        );
    }

    protected onNameChange(item: ElementReferenceProperty.Reference, name: string): void {
        this.dispatchEvent(
            new CustomEvent<PropertyNameChangeDetail>('property-name-change', {
                detail: {
                    elementId: item.elementId,
                    name
                }
            })
        );
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
