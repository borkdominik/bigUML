/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { autoUpdate, computePosition, flip, shift } from '@floating-ui/dom';
import { css, html, nothing, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { BigUMLComponent } from '../webcomponents/component';

@customElement('biguml-context-menu')
export class VSCodeContextMenu extends BigUMLComponent {
    static override styles = [
        css`
            #context-menu {
                display: none;
                width: max-content;
                position: absolute;
                top: 0;
                left: 0;
                min-width: 160px;
                outline: 1px solid var(--vscode-menu-border);
                border-radius: 5px;
                color: var(--vscode-menu-foreground);
                background-color: var(--vscode-menu-background);
                box-shadow: 0 2px 8px var(--vscode-widget-shadow);
                z-index: 9999;
            }

            #context-menu[popup-show] {
                display: block;
            }

            .action-bar {
                padding: 4px 0;
            }

            .actions-container {
                display: flex;
                flex-direction: column;
            }
        `
    ];

    get isVisible(): boolean {
        return this.contextMenu.hasAttribute('popup-show');
    }

    @property({ type: Object })
    reference: HTMLElement;

    @query('#context-menu')
    protected readonly contextMenu: HTMLDivElement;

    protected disposables: (() => void)[] = [];

    show(): void {
        this.contextMenu.setAttribute('popup-show', '');
        this.updateContextMenu();
        this.disposables.push(autoUpdate(this.reference, this.contextMenu, () => this.updateContextMenu()));
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
        return html`<div id="context-menu" @focus="${this.show}" @blur="${this.hide}">
            <div class="action-bar">
                <div class="actions-container">
                    <slot></slot>
                </div>
            </div>
        </div>`;
    }

    protected override updated(changedProperties: Map<string, any>): void {
        if (changedProperties.has('reference') && this.reference !== undefined) {
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
                    .some(p => [this.reference].includes(p as HTMLElement))
            ) {
                event.preventDefault();
            } else {
                this.hide();
            }
        }
    }

    protected updateContextMenu(): void {
        computePosition(this.reference, this.contextMenu, {
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

@customElement('biguml-context-menu-item')
export class VSCodeContextMenuItem extends BigUMLComponent {
    static override styles = [
        ...super.styles,
        css`
            .action-item {
                display: flex;
                flex-direction: row;
                height: 2em;
                text-decoration: none;
                color: var(--vscode-menu-foreground);
                outline-offset: -1px;
                align-items: center;
                position: relative;
                margin: 0 4px;
                border-radius: 4px;
                cursor: pointer;
            }

            .action-item:hover {
                color: var(--vscode-menu-selectionForeground);
                background-color: var(--vscode-menu-selectionBackground);
                outline: 1px solid var(--vscode-menu-selectionBorder);
                outline-offset: -1px;
            }

            .action-item .action-icon {
                position: absolute;
                width: 2em;
                font-size: 13px;
                line-height: 13px;
            }

            .action-item .action-label {
                flex: 1 1 auto;
                padding: 0 2em;
                font-size: 13px;
                line-height: 13px;
            }
        `
    ];

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

declare global {
    interface HTMLElementTagNameMap {
        'biguml-context-menu': VSCodeContextMenu;
        'biguml-context-menu-item': VSCodeContextMenuItem;
    }
}
