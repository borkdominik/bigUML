/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { ElementProperties, SetPropertyPaletteAction } from '@borkdominik-biguml/uml-common';
import { Action } from '@eclipse-glsp/protocol';
import { html, TemplateResult } from 'lit';
import { query, state } from 'lit/decorators.js';
import { BigElement } from '../../base/component';
import { useToolkit } from '../../toolkit';
import { VSCodeConnection } from '../../vscode/vscode-api';
import { PropertyPalette } from '../property-palette.component';

export function definePropertyPaletteWebview(): void {
    customElements.define('big-property-palette-webview', PropertyPaletteWebview);
}

export class PropertyPaletteWebview extends BigElement {
    @query('#component')
    protected readonly component: PropertyPalette;

    @state()
    protected elementProperties?: ElementProperties;

    protected connection = VSCodeConnection.instance();
    protected clientId?: string;

    override connectedCallback(): void {
        super.connectedCallback();
        useToolkit();

        document.addEventListener('contextmenu', event => {
            event.stopImmediatePropagation();
        });

        this.connection.listen(this.onConnectionAction.bind(this), Action.is);
    }

    protected override render(): TemplateResult<1> {
        return html`<big-property-palette
            id="component"
            .clientId="${this.clientId}"
            .properties="${this.elementProperties}"
            @dispatch-action="${this.onDispatchAction}"
        ></big-property-palette>`;
    }

    protected onConnectionAction(action: Action, clientId: string): void {
        if (SetPropertyPaletteAction.is(action)) {
            this.clientId = clientId;
            this.elementProperties = action.palette;
        } else {
            console.warn('Unsupported action', action);
        }
    }

    protected onDispatchAction(event: CustomEvent<Action>): void {
        this.connection.post<Action>({
            clientId: this.clientId,
            command: 'dispatch-action',
            payload: event.detail
        });
    }
}
