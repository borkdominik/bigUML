/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { ActionMessageNotification, MinimapExportSvgAction } from '@borkdominik-biguml/uml-protocol';
import { InitializeCanvasBoundsAction } from '@eclipse-glsp/client';
import { Action, ActionMessage, ExportSvgAction, SetViewportAction } from '@eclipse-glsp/protocol';
import { TemplateResult, html } from 'lit';
import { query, state } from 'lit/decorators.js';
import { HOST_EXTENSION } from 'vscode-messenger-common';
import { BigElement } from '../../base/component';
import { useToolkit } from '../../toolkit';
import { messenger } from '../../vscode/messenger';
import { Minimap } from '../minimap.component';

export function defineMinimapWebview(): void {
    customElements.define('big-minimap-webview', MinimapWebview);
}

export class MinimapWebview extends BigElement {
    @query('#component')
    protected readonly component: Minimap;

    @state()
    protected svg?: string;
    protected elementId?: string;
    protected clientId?: string;
    protected modelBounds?: { x: number; y: number; width: number; height: number };

    override connectedCallback(): void {
        super.connectedCallback();
        useToolkit();

        document.addEventListener('contextmenu', event => {
            event.stopImmediatePropagation();
        });
        // We get the send actions from sendActionToWebview from minimap.provider.ts
        messenger.onNotification<ActionMessage>(ActionMessageNotification, message => {
            const { clientId, action } = message;
            if (MinimapExportSvgAction.is(action)) {
                this.clientId = clientId;
                this.svg = action.svg;
                this.modelBounds = action.modelBounds;
                this.elementId = action.elementId;
            } else if (ExportSvgAction.is(action)) {
                this.clientId = clientId;
                this.svg = action.svg;
            } else if (SetViewportAction.is(action)) {
                const { scroll, zoom } = action.newViewport;
                const viewPort = {
                    scroll: {
                        x: scroll.x,
                        y: scroll.y
                    },
                    zoom: zoom
                };
                this.component.viewPort = viewPort;
            } else if (InitializeCanvasBoundsAction.KIND === action.kind) {
                this.clientId = clientId;
                this.component.canvasBounds = (action as InitializeCanvasBoundsAction).newCanvasBounds;
            } else {
                console.warn('Unsupported action', action);
            }
        });

        // Ensure the component is ready before adding the event listener
        setTimeout(() => {
            const minimapElement = this.shadowRoot?.querySelector('big-minimap');
            if (minimapElement) {
                minimapElement.addEventListener(
                    'viewport-change',
                    event => {
                        const newViewport = (event as CustomEvent).detail;
                        this.sendNotification(SetViewportAction.create(this.elementId || '', newViewport));
                    },
                    false
                );
            }
        }, 0);

        messenger.start();

        this.sendNotification({ kind: 'minimapIsReady' });
    }

    // Over this method it is possible to forward parameters to Google Lit, in this case `minimap.component.ts`
    protected override render(): TemplateResult<1> {
        return html`<big-minimap
            id="component"
            .clientId="${this.clientId}"
            .svg="${this.svg}"
            .modelBounds="${this.modelBounds}"
            @dispatch-action="${this.onDispatchAction}"
        ></big-minimap>`;
    }

    protected onDispatchAction(event: CustomEvent<Action>): void {
        this.sendNotification(event.detail);
    }

    // With this method it is possible to send messages to the extension, in this case minimap-webview.component.ts
    protected sendNotification(action: Action): void {
        messenger.sendNotification(ActionMessageNotification, HOST_EXTENSION, {
            clientId: this.clientId,
            action
        });
    }
}
