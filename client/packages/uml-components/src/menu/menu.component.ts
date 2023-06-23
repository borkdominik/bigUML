/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Button as VSCodeButton } from '@vscode/webview-ui-toolkit';
import { html, PropertyValues, TemplateResult } from 'lit';
import { query } from 'lit/decorators.js';
import { BigElement } from '../base/component';
import '../global';
import { Tooltip } from '../tooltip/tooltip.component';
import { ContextMenu, ContextMenuItem } from './context-menu.component';
import { MenuStyle } from './menu.style';

export function defineMenu(): void {
    customElements.define('big-menu', Menu);
    customElements.define('big-menu-item', MenuItem);
}

export class Menu extends BigElement {
    static override styles = [...super.styles, MenuStyle.style];

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
        return html`<vscode-button id="menu-button" appearance="icon" @click="${this.toggle}">
                <div class="codicon codicon-ellipsis"></div>
            </vscode-button>
            <big-context-menu id="context-menu">
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
