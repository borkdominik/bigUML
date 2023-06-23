/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { autoUpdate, computePosition, flip, shift } from '@floating-ui/dom';
import { html, nothing, TemplateResult } from 'lit';
import { property, query } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { BigElement } from '../base/component';
import { ContextMenuItemStyle, ContextMenuStyle } from './context-menu.style';

export function defineContextMenu(): void {
    customElements.define('big-context-menu', ContextMenu);
    customElements.define('big-context-menu-item', ContextMenuItem);
}

export class ContextMenu extends BigElement {
    static override styles = [ContextMenuStyle.style];

    get isVisible(): boolean {
        return this.contextMenu.hasAttribute('popup-show');
    }

    @property({ type: Object })
    anchorReference: HTMLElement;

    @query('#context-menu')
    protected readonly contextMenu: HTMLDivElement;

    protected disposables: (() => void)[] = [];

    show(): void {
        this.contextMenu.setAttribute('popup-show', '');
        this.updateContextMenu();
        this.disposables.push(autoUpdate(this.anchorReference, this.contextMenu, () => this.updateContextMenu()));
    }

    hide(): void {
        this.contextMenu.removeAttribute('popup-show');
        this.disposables.forEach(cb => cb());
    }

    override connectedCallback(): void {
        super.connectedCallback();
        document.addEventListener('click', this.handleDocumentClick.bind(this));
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        document.removeEventListener('click', this.handleDocumentClick);
    }

    protected override render(): TemplateResult<1> {
        return html`<div id="context-menu" @blur="${this.hide}">
            <div class="action-bar">
                <div class="actions-container">
                    <slot></slot>
                </div>
            </div>
        </div>`;
    }

    protected override updated(changedProperties: Map<string, any>): void {
        if (changedProperties.has('reference') && this.anchorReference !== undefined) {
            this.updateContextMenu();
        }
    }

    protected handleDocumentClick(event: MouseEvent): void {
        const target = event.composedPath()[0];
        if (target === undefined) {
            return;
        }

        if (target instanceof HTMLElement) {
            if (
                event
                    .composedPath()
                    .filter(p => p instanceof HTMLElement)
                    .slice(1)
                    .some(p => [this.anchorReference].includes(p as HTMLElement))
            ) {
                event.preventDefault();
            } else {
                this.hide();
            }
        }
    }

    protected updateContextMenu(): void {
        computePosition(this.anchorReference, this.contextMenu, {
            placement: 'bottom-start',
            middleware: [flip(), shift()]
        }).then(({ x, y }) => {
            Object.assign(this.contextMenu.style, {
                left: `${x}px`,
                top: `${y}px`
            });
        });
    }
}

export class ContextMenuItem extends BigElement {
    static override styles = [...super.styles, ContextMenuItemStyle.style];

    @property()
    icon?: string;

    protected override render(): TemplateResult<1> {
        return html`<div class="action-item">
            ${when(
                this.icon !== undefined,
                () => html`<span class="codicon ${this.icon} action-icon"></span>`,
                () => nothing
            )}
            <span class="action-label"><slot></slot></span>
        </div>`;
    }
}
