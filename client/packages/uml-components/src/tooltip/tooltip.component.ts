/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
import { css, html, TemplateResult } from 'lit';
import { property, query } from 'lit/decorators.js';
import { BigElement } from '../base';

export function defineTooltip(): void {
    customElements.define('big-tooltip', Tooltip);
}

export class Tooltip extends BigElement {
    static override styles = [
        css`
            #tooltip {
                display: none;
                width: max-content;
                position: absolute;
                top: 0;
                left: 0;
                padding: 4px;
                outline: 1px solid var(--vscode-menu-border);
                border-radius: 5px;
                color: var(--vscode-menu-foreground);
                background-color: var(--vscode-menu-background);
                box-shadow: 0 2px 8px var(--vscode-widget-shadow);
                z-index: 9999;
            }

            #tooltip[popup-show] {
                display: block;
            }
        `
    ];

    @property({ type: Object })
    anchorReference: HTMLElement;

    protected oldAnchorReference?: HTMLElement;
    protected disposables: (() => void)[] = [];
    protected readonly events = [
        ['mouseenter', this.show],
        ['mouseleave', this.hide],
        ['focus', this.show],
        ['blur', this.hide]
    ] as const;

    @query('#tooltip')
    protected readonly tooltip: HTMLDivElement;

    show(): void {
        this.tooltip.setAttribute('popup-show', '');
        this.updateTooltip();
        this.disposables.push(autoUpdate(this.anchorReference, this.tooltip, () => this.updateTooltip()));
    }

    hide(): void {
        this.tooltip.removeAttribute('popup-show');
        this.disposables.forEach(cb => cb());
    }

    protected override render(): TemplateResult<1> {
        return html`<div id="tooltip">
            <slot></slot>
        </div>`;
    }

    protected override updated(changedProperties: Map<string, any>): void {
        if (changedProperties.has('anchorReference')) {
            if (this.oldAnchorReference !== undefined) {
                this.unregisterEvents(this.oldAnchorReference);
            }

            if (this.anchorReference !== undefined) {
                this.oldAnchorReference = this.anchorReference;
                this.registerEvents(this.anchorReference);
                this.updateTooltip();
            }
        }
    }

    protected registerEvents(reference: HTMLElement): void {
        this.events.forEach(([event, listener]) => {
            reference.addEventListener(event, listener.bind(this));
        });
    }

    protected unregisterEvents(reference: HTMLElement): void {
        this.events.forEach(([event, listener]) => {
            reference.removeEventListener(event, listener);
        });
    }

    protected updateTooltip(): void {
        computePosition(this.anchorReference, this.tooltip, {
            placement: 'bottom-start',
            middleware: [offset(6), flip(), shift({ padding: 5 })]
        }).then(({ x, y }) => {
            Object.assign(this.tooltip.style, {
                left: `${x}px`,
                top: `${y}px`
            });
        });
    }
}
