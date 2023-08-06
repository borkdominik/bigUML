/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Button as VSCodeButton } from '@vscode/webview-ui-toolkit';
import { css, html, PropertyValues, TemplateResult } from 'lit';
import { query } from 'lit/decorators.js';
import { BigElement } from '../base/component';
import '../global';
import { Tooltip } from '../tooltip/tooltip.component';
import { ContextMenu, ContextMenuItem } from './context-menu.component';

export function defineMenu(): void {
    customElements.define('big-menu', Menu);
    customElements.define('big-menu-item', MenuItem);
}

export class Menu extends BigElement {
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
    protected readonly contextMenu: ContextMenu;

    @query('#tooltip')
    protected readonly tooltip: Tooltip;

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
        return html`<big-tooltip .disabled=${this.contextMenu?.isVisible}>
                <vscode-button slot="anchor" id="menu-button" appearance="icon" @click="${this.toggle}">
                    <div class="codicon codicon-ellipsis"></div>
                </vscode-button>
                <span slot="text">More actions...</span>
            </big-tooltip>
            <big-context-menu id="context-menu" @visibility-change=${() => this.requestUpdate()}>
                <div id="menu-items">
                    <slot></slot>
                </div>
            </big-context-menu>`;
    }

    protected override firstUpdated(_changedProperties: PropertyValues<this>): void {
        this.contextMenu.anchorReference = this.menuButton;
    }
}

export class MenuItem extends ContextMenuItem {}
