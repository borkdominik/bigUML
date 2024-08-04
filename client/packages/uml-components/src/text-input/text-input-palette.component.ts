/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import {
    ElementProperties,
    ElementProperty,
    ElementReferenceProperty,
    ElementTextProperty,
    UpdateElementPropertyAction
} from '@borkdominik-biguml/uml-protocol';
import { Action, CreateNodeOperation } from '@eclipse-glsp/protocol';
import { TextField as VSCodeTextField } from '@vscode/webview-ui-toolkit';
import { PropertyValues, TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { groupBy } from 'lodash';
import { BigElement } from '../base/component';
import '../global';
import { TextInputDeleteEventDetail, TextInputNameChangeDetail, TextInputOrderDetail } from './reference/text-input-palette-reference.component';
import { TextInputPaletteStyle } from './text-input-palette.style';

export function defineTextInputPalette(): void {
    customElements.define('big-text-input-palette', TextInputPalette);
}

export class TextInputPalette extends BigElement {
    static override styles = [...super.styles, TextInputPaletteStyle.style];

    @property()
    clientId?: string;

    @property({ type: Object })
    properties?: ElementProperties;

    @state() inputText = 'yoyoyo';

    @state()
    protected searchText?: string;

    @state()
    protected navigationIds: { [key: string]: { from: string; to: string }[] } = {};

    protected override render(): TemplateResult<1> {
        return html`<div>${this.headerTemplate()} ${this.bodyTemplate()}</div>`;
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
        return html`<header>Text Input Field</header>`;
        // return html`<header>
        //     ${when(
        //         this.clientId && this.navigationIds[this.clientId]?.length > 0,
        //         () => html`
        //             <vscode-button id="navigate-back" appearance="icon" @click="${this.onNavigateBack}"
        //                 ><span class="codicon codicon-chevron-left"></span
        //             ></vscode-button>
        //         `,
        //         () => nothing
        //     )}
        //     ${this.properties === undefined ? nothing : html`<h3 class="title">${this.properties?.label}</h3>`}
        // </header>`;
    }

    protected bodyTemplate(): TemplateResult<1> {
        return this.textFieldWithButtonTemplate();

        // if (this.properties === undefined) {
        //     return html`<div class="no-data-message">The active diagram does not provide property information.</div>`;
        // }

        // const items = this.properties.items;
        // const filteredItems = items.filter(item => {
        //     const label: string = (item as any)['label'];

        //     if (label !== undefined && this.searchText !== undefined) {
        //         return label.toLowerCase().includes(this.searchText.toLocaleLowerCase());
        //     }

        //     return true;
        // });
        // const { references: referenceItems, other: gridItems } = extractReferences(filteredItems);

        // const gridTemplates = gridItems.map(item => {
        //     if (ElementTextProperty.is(item)) {
        //         return this.textFieldTemplate(item);
        //     } else if (ElementBoolProperty.is(item)) {
        //         return this.checkboxTemplate(item);
        //     } else if (ElementChoiceProperty.is(item)) {
        //         return this.dropdownTemplate(item);
        //     }

        //     return html`${nothing}`;
        // });

        // const referenceTemplates = referenceItems.map(item => {
        //     if (ElementReferenceProperty.is(item)) {
        //         return this.referenceTemplate(item);
        //     }

        //     return html`${nothing}`;
        // });

        // return html`<div class="body">
        //     <vscode-text-field
        //         id="search"
        //         placeholder="Search"
        //         .value="${this.searchText}"
        //         @input="${(event: any) => (this.searchText = event.target?.value)}"
        //     >
        //         <span slot="start" class="codicon codicon-search"></span>
        //     </vscode-text-field>
        //     <vscode-divider></vscode-divider>
        //     ${when(
        //         gridTemplates.length > 0,
        //         () => html`<div class="grid">${gridTemplates}</div>`,
        //         () => nothing
        //     )}
        //     ${when(
        //         gridTemplates.length > 0 && referenceTemplates.length > 0,
        //         () => html`<vscode-divider></vscode-divider>`,
        //         () => nothing
        //     )}
        //     ${referenceTemplates}
        // </div>`;
    }

    protected async onStartIntent(): Promise<void> {
        const response = await fetch(`http://127.0.0.1:8000/intent/?user_query=${this.inputText}`, {
            headers: {
                accept: 'application/json'
            }
        })
        if (!response.ok) {
            console.error(response.text)
        }
        const json = await response.json();
        this.handleIntent(json.intent)
    }

    protected async handleIntent(intent: string) {

        enum Intents {
            CREATE_CLASS = "CreateClass",
            CREATE_RELATION = "CreateRelation",
          }
        
        switch(intent) {
            case Intents.CREATE_CLASS: {
                const response = await fetch(`http://127.0.0.1:8000/create-class/?user_query=${this.inputText}`, {
                    headers: {
                        accept: 'application/json'
                    }
                })
                if (!response.ok) {
                    console.error(response.text);
                }
                const json = await response.json();
                this.createClass(json);
                break;
            }
            default: {
                console.log("Buhu ;(");
            }
        }
    }

    protected createClass(info: any) {
            this.dispatchEvent(
                new CustomEvent('dispatch-action', {
                    detail: CreateNodeOperation.create(`CLASS__Class`, 
                    {
                        containerId: "_Ixd8AN8LEe6XScRLwR9PWg",
                        location: {
                            x: 1276,
                            y: 200
                        },
                        args: {
                            name: info.class_name
                        }
                    })
                })
            );
    }

    protected textFieldWithButtonTemplate(): TemplateResult<1> {
        return html`
            <div class="grid-value grid-flex">
                <vscode-text-field .value="${this.inputText}" @input="${(event: any) => (this.inputText = event.target?.value)}"></vscode-text-field>
                <vscode-button appearance="primary" @click="${this.onStartIntent}"> Do Smth </vscode-button>
            </div>
        `
    }

    protected textFieldTemplate(item: ElementTextProperty): TemplateResult<1> {
        const onChange = (event: CustomEvent): void => {
            const target = event.target as VSCodeTextField;
            this.onPropertyChange(item, target.value);
        };

        return html`<div class="grid-label">${item.label}</div>
            <div class="grid-value grid-flex">
                <vscode-text-field .value="${item.text}" @change="${onChange}" ?disabled="${item.disabled}"></vscode-text-field>
            </div>`;
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

    protected onOrderChange(event: CustomEvent<TextInputOrderDetail>): void {
        const { element, updates } = event.detail;

        this.dispatchEvent(
            new CustomEvent<Action>('dispatch-action', {
                detail: UpdateElementPropertyAction.create({
                    elementId: element.elementId,
                    propertyId: `${element.propertyId}_index`,
                    value: JSON.stringify(updates)
                })
            })
        );
    }

    // protected onPropertyNavigate(event: CustomEvent<ElementReferenceProperty.Reference>): void {
    //     const { elementId } = event.detail;
    //     if (this.properties && this.clientId) {
    //         this.navigationIds[this.clientId] = [
    //             ...(this.navigationIds[this.clientId] ?? []),
    //             {
    //                 from: this.properties.elementId,
    //                 to: elementId
    //             }
    //         ];
    //     }

    //     this.dispatchEvent(
    //         new CustomEvent<Action>('dispatch-action', {
    //             detail: RefreshPropertyPaletteAction.create({
    //                 elementId
    //             })
    //         })
    //     );
    // }

    protected onPropertyNameChange(event: CustomEvent<TextInputNameChangeDetail>): void {
        const { elementId, name } = event.detail;

        this.dispatchEvent(
            new CustomEvent<Action>('dispatch-action', {
                detail: UpdateElementPropertyAction.create({
                    elementId,
                    propertyId: 'name',
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

    protected onPropertyDelete(event: CustomEvent<TextInputDeleteEventDetail>): void {
        this.dispatchEvent(
            new CustomEvent<Action[]>('dispatch-action', {
                detail: event.detail.references.flatMap(r => r.deleteActions)
            })
        );
    }
}

export function extractReferences(items: ElementProperty[]): { references: ElementReferenceProperty[]; other: ElementProperty[] } {
    const group = groupBy(items, item => item.type === 'REFERENCE');

    return {
        references: (group['true'] as ElementReferenceProperty[]) ?? [],
        other: group['false'] ?? []
    };
}
