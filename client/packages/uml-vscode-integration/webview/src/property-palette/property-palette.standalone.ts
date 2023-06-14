/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import '../../css/reset.css';

import { ElementProperties, ElementReferenceProperty, SetPropertyPaletteAction } from '@borkdominik-biguml/uml-common';
import { html, TemplateResult } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { DATA_CONTEXT_MENU } from '../vscode/constants';
import { initializeToolkit } from '../vscode/toolkit';
import { VSCodeApi } from '../vscode/vscode-api';
import { BigUMLComponent } from '../webcomponents/component';
import { PropertyDeleteEventDetail } from './property-palette-reference.component';
import { PropertyChangeEventDetail, PropertyPalette } from './property-palette.component';

@customElement('biguml-property-palette-standalone')
export class PropertyPaletteStandalone extends BigUMLComponent {
    protected vscode: VSCodeApi;

    @query('biguml-property-palette')
    protected readonly component: PropertyPalette;

    @state()
    protected properties?: ElementProperties;

    override connectedCallback(): void {
        super.connectedCallback();
        initializeToolkit();

        this.vscode = acquireVsCodeApi();

        document.addEventListener('contextmenu', event => {
            const path = event.composedPath();

            if (path.some(p => p instanceof HTMLElement && p.hasAttribute(DATA_CONTEXT_MENU))) {
                const shadowTarget = path[0];
                Object.defineProperty(event, 'target', { writable: false, value: shadowTarget });
            } else {
                event.stopImmediatePropagation();
            }
        });

        window.addEventListener('message', this.onMessage.bind(this));
    }

    protected onMessage(event: MessageEvent<any>) {
        if (SetPropertyPaletteAction.is(event.data)) {
            this.properties = event.data.palette;
        } else {
            console.warn('Unknown message', event);
        }
    }

    protected postMessage(message: any) {
        this.vscode.postMessage(message);
    }

    protected override render(): TemplateResult<1> {
        return html`<biguml-property-palette
            .properties="${this.properties}"
            @property-change="${this.onPropertyChanged}"
            @property-create="${this.onPropertyCreate}"
            @property-delete="${this.onPropertyDelete}"
        ></biguml-property-palette>`;
    }

    protected onPropertyChanged(event: CustomEvent<PropertyChangeEventDetail>) {
        console.log('Custom Event', event);
    }

    protected onPropertyCreate(event: CustomEvent<ElementReferenceProperty.CreateReference>): void {
        console.log('OUTSIDE', event);
    }

    protected onPropertyDelete(event: CustomEvent<PropertyDeleteEventDetail>): void {
        console.log('OUTSIDE', event);
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'biguml-property-palette-standalone': PropertyPaletteStandalone;
    }
}
