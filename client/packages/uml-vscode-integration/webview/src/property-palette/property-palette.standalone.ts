/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import '../../css/reset.css';

import { ElementProperties, SetPropertyPaletteAction } from '@borkdominik-biguml/uml-common';
import { Action } from '@eclipse-glsp/protocol';
import { html, TemplateResult } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { DATA_CONTEXT_MENU } from '../vscode/constants';
import { initializeToolkit } from '../vscode/toolkit';
import { VSCodeConnection } from '../vscode/vscode-api';
import { BigUMLComponent } from '../webcomponents/component';
import { PropertyPalette } from './property-palette.component';

@customElement('biguml-property-palette-standalone')
export class PropertyPaletteStandalone extends BigUMLComponent {
    protected connection = VSCodeConnection.instance();

    @query('biguml-property-palette')
    protected readonly component: PropertyPalette;

    @state()
    protected properties?: ElementProperties;

    override connectedCallback(): void {
        super.connectedCallback();
        initializeToolkit();

        document.addEventListener('contextmenu', event => {
            const path = event.composedPath();

            if (path.some(p => p instanceof HTMLElement && p.hasAttribute(DATA_CONTEXT_MENU))) {
                const shadowTarget = path[0];
                Object.defineProperty(event, 'target', { writable: false, value: shadowTarget });
            } else {
                event.stopImmediatePropagation();
            }
        });

        this.connection.listen(this.onConnectionAction.bind(this), Action.is);
    }

    protected override render(): TemplateResult<1> {
        return html`<biguml-property-palette
            .properties="${this.properties}"
            @dispatch-action="${this.onDispatchAction}"
        ></biguml-property-palette>`;
    }

    protected onConnectionAction(action: Action): void {
        if (SetPropertyPaletteAction.is(action)) {
            this.properties = action.palette;
        } else {
            console.warn('Unsupported action', action);
        }
    }

    protected onDispatchAction(event: CustomEvent<Action>): void {
        this.connection.post<Action>({
            command: 'dispatch-action',
            payload: event.detail
        });
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'biguml-property-palette-standalone': PropertyPaletteStandalone;
    }
}
