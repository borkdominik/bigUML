/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { ElementReferenceProperty } from '@borkdominik-biguml/uml-common';
import { Combobox as FCombobox } from '@microsoft/fast-components';
import { html, nothing, TemplateResult } from 'lit';
import { property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { keyed } from 'lit/directives/keyed.js';
import { when } from 'lit/directives/when.js';
// eslint-disable-next-line import/no-named-as-default
import Sortable from 'sortablejs';
import { BigElement } from '../../base/component';
import '../../global';
import { PropertyPaletteReferenceStyle } from './property-palette-reference.style';

export function definePropertyPaletteReference(): void {
    customElements.define('big-property-palette-reference', PropertyPaletteReference);
}

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

export class PropertyPaletteReference extends BigElement {
    static override styles = [...super.styles, PropertyPaletteReferenceStyle.style];

    @property({ type: Object })
    item?: ElementReferenceProperty = undefined;

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
                dragClass: 'sortable-drag',
                onStart: e => {
                    const node = e.item as Node;
                    // Remember the list of child nodes when drag started.
                    childNodes = Array.prototype.slice.call(node.parentNode!.childNodes);
                    // Filter out the 'sortable-fallback' element used on mobile/old browsers.
                    childNodes = childNodes.filter(
                        childNode =>
                            childNode.nodeType !== Node.ELEMENT_NODE || !(childNode as HTMLElement).classList.contains('sortable-fallback')
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
                    if (e.oldIndex === e.newIndex) {
                        return;
                    }
                    const element = this.item!.references.splice(oldIndex, 1)[0];
                    this.item!.references.splice(newIndex, 0, element);
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
                    <big-menu>
                        <big-menu-item
                            icon="codicon-trash"
                            @click="${() => this.onDelete(item.references.filter(r => r.isDeleteable).map(i => i.elementId))}"
                            >Delete all</big-menu-item
                        >
                    </big-menu>
                </div>
            </div>
        `;
    }

    protected renderBody(item: ElementReferenceProperty): TemplateResult<1> {
        return html`<div class="body">
            ${when(item.isAutocomplete, () => this.renderAutocomplete(item))}
            <div id="items">${item.references.map(ref => html`${this.renderItem(item, ref)}`)}</div>
            ${when(
                item.creates.length > 0 && !item.isAutocomplete,
                () => html`<div class="actions">
                    <vscode-button appearance="primary" @click="${() => this.onCreate(item.creates[0])}"> Add </vscode-button>
                </div>`
            )}
        </div>`;
    }

    protected renderAutocomplete(item: ElementReferenceProperty): TemplateResult<1> {
        const onChange = (event: CustomEvent): void => {
            const target = event.target as FCombobox;
            this.onCreate(item.creates[target.selectedIndex]);
            target.value = '';
        };

        return html`<vscode-combobox class="autocomplete" autocomplete="both" placeholder="Search for classifiers" @change="${onChange}">
            ${item.creates.map(c => html`<vscode-option>${c.label}</vscode-option>`)}
        </vscode-combobox>`;
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
                        ${when(
                            ref.isDeleteable,
                            () => html`<big-tooltip>
                                <vscode-button slot="anchor" appearance="icon" @click="${() => this.onDelete([ref.elementId])}">
                                    <div class="codicon codicon-trash"></div>
                                </vscode-button>
                                <span slot="text">Delete</span>
                            </big-tooltip>`
                        )}
                        <big-tooltip>
                            <vscode-button slot="anchor" appearance="icon" @click="${() => this.onNavigate(ref)}">
                                <div class="codicon codicon-chevron-right"></div>
                            </vscode-button>
                            <span slot="text">Navigate</span>
                        </big-tooltip>
                    </div>
                </div>
                ${when(
                    ref.hint !== undefined,
                    () => html`<div class=${classMap({ 'hint-text': true, 'handle-empty': item.isOrderable })}>${ref.hint}</div>`,
                    () => nothing
                )}
            </div>`
        )}`;
    }

    protected onNavigate(item: ElementReferenceProperty.Reference): void {
        this.dispatchEvent(
            new CustomEvent<ElementReferenceProperty.Reference>('property-navigate', {
                detail: item
            })
        );
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

    protected onDelete(elementIds: string[]): void {
        if (elementIds.length > 0) {
            this.dispatchEvent(
                new CustomEvent<PropertyDeleteEventDetail>('property-delete', {
                    detail: {
                        elementIds
                    }
                })
            );
        }
    }
}
