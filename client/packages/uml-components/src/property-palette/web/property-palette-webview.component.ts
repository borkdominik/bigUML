/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import {
    ActionMessageNotification,
    ElementProperties,
    RefreshPropertyPaletteAction,
    SetPropertyPaletteAction
} from '@borkdominik-biguml/uml-protocol';
import { Action, ActionMessage } from '@eclipse-glsp/protocol';
import { TemplateResult, html } from 'lit';
import { query, state } from 'lit/decorators.js';
import { HOST_EXTENSION } from 'vscode-messenger-common';
import { BigElement } from '../../base/component';
import { useToolkit } from '../../toolkit';
import { messenger } from '../../vscode/messenger';
import { PropertyPalette } from '../property-palette.component';

export function definePropertyPaletteWebview(): void {
    customElements.define('big-property-palette-webview', PropertyPaletteWebview);
}

export class PropertyPaletteWebview extends BigElement {
    @query('#component')
    protected readonly component: PropertyPalette;

    @state()
    protected elementProperties?: ElementProperties;
    protected clientId?: string;

    override connectedCallback(): void {
        super.connectedCallback();
        useToolkit();

        document.addEventListener('contextmenu', event => {
            event.stopImmediatePropagation();
        });

        messenger.onNotification<ActionMessage>(ActionMessageNotification, message => {
            const { clientId, action } = message;
            if (SetPropertyPaletteAction.is(action)) {
                this.clientId = clientId;
                this.elementProperties = action.palette;
            } else {
                console.warn('Unsupported action', action);
            }
        });
        messenger.start();

        this.sendNotification(RefreshPropertyPaletteAction.create());
    }

    protected override render(): TemplateResult<1> {
        return html`<big-property-palette
            id="component"
            .clientId="${this.clientId}"
            .properties="${this.elementProperties}"
            @dispatch-action="${this.onDispatchAction}"
        ></big-property-palette>`;
    }

    protected onDispatchAction(event: CustomEvent<Action>): void {
        this.sendNotification(event.detail);
    }

    protected sendNotification(action: Action): void {
        messenger.sendNotification(ActionMessageNotification, HOST_EXTENSION, {
            clientId: this.clientId,
            action
        });
    }
}
