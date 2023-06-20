/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import './toolkit';
import './vscode-context-menu.component';

import { VSCodeContextMenu, VSCodeContextMenuItem } from '../vscode/vscode-context-menu.component';

import { Button as VSCodeButton } from '@vscode/webview-ui-toolkit';
import { css, html, PropertyValueMap, TemplateResult } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { BigUMLComponent } from '../webcomponents/component';

@customElement('biguml-menu')
export class VSCodeMenu extends BigUMLComponent {
    static override styles = [
        ...super.styles,
        css`
            #menu-items {
                display: flex;
                flex-direction: column;
            }
        `
    ];

    @query('#menu-button')
    protected readonly menuButton: VSCodeButton;

    @query('#context-menu')
    protected readonly contextMenu: VSCodeContextMenu;

    show(): void {
        this.contextMenu.show();
    }

    hide(): void {
        this.contextMenu.hide();
    }

    toggle(): void {
        if (this.contextMenu.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    protected override render(): TemplateResult<1> {
        return html`<vscode-button id="menu-button" appearance="icon" @click="${this.toggle}">
                <div class="codicon codicon-ellipsis"></div>
            </vscode-button>
            <biguml-context-menu id="context-menu">
                <div id="menu-items">
                    <slot></slot>
                </div>
            </biguml-context-menu>`;
    }

    protected override firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        this.contextMenu.reference = this.menuButton;
    }
}

@customElement('biguml-menu-item')
export class VSCodeMenuItem extends VSCodeContextMenuItem {}

declare global {
    interface HTMLElementTagNameMap {
        'biguml-menu': VSCodeMenu;
        'biguml-menu-item': VSCodeMenuItem;
    }
}
