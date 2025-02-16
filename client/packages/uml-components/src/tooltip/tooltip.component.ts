/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
import { css, html, PropertyValueMap, TemplateResult } from 'lit';
import { property, query, queryAssignedElements } from 'lit/decorators.js';
import { BigElement } from '../base/index.js';

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
                z-index: 9000;
            }

            #tooltip[popup-show] {
                display: block;
                animation: 0.5s ease 0s normal forwards 1 fadein;
            }

            #arrow {
                position: absolute;
                margin-top: 6px;
                margin-left: -6px;
            }

            #arrow:before,
            #arrow:after {
                position: absolute;
                width: 0;
                height: 0;
                content: '';
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-bottom-width: 6px;
                border-bottom-style: solid;
            }
            #arrow:before {
                top: -8px; /* extra -1 pixel offset at the top */
                border-bottom-color: var(--vscode-menu-border);
            }
            #arrow:after {
                top: -6px;
                border-bottom-color: var(--vscode-menu-background);
            }

            @keyframes fadein {
                0% {
                    opacity: 0;
                }
                99% {
                    opacity: 0;
                }
                100% {
                    opacity: 1;
                }
            }

            @-webkit-keyframes fadein {
                99% {
                    opacity: 0;
                }
                66% {
                    opacity: 0;
                }
                100% {
                    opacity: 1;
                }
            }
        `
    ];

    @property({ type: Boolean, reflect: true })
    disabled: boolean;

    @queryAssignedElements({ slot: 'anchor', flatten: true })
    protected readonly anchorReference: HTMLElement[];

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
    @query('#arrow')
    protected readonly arrowElement: HTMLDivElement;

    show(): void {
        this.tooltip.setAttribute('popup-show', '');
        this.updateTooltip(this.anchorReference[0], this.tooltip);
        this.disposables.push(
            autoUpdate(this.anchorReference[0], this.tooltip, () => this.updateTooltip(this.anchorReference[0], this.tooltip))
        );
    }

    hide(): void {
        this.tooltip.removeAttribute('popup-show');
        this.disposables.forEach(cb => cb());
    }

    protected override render(): TemplateResult<1> {
        return html`<div>
            <slot name="anchor" @slotchange=${this.handleAnchorChanged}></slot>
            <div id="tooltip">
                <div id="arrow"></div>
                <slot name="text" @slotchange=${this.handleTextChanged}></slot>
            </div>
        </div>`;
    }

    protected override updated(changedProperties: PropertyValueMap<this>): void {
        if (changedProperties.has('disabled')) {
            if (this.disabled) {
                this.hide();
            }
        }
    }

    protected handleTextChanged(): void {
        this.updateTooltip(this.anchorReference[0], this.tooltip);
    }

    protected handleAnchorChanged(): void {
        if (this.anchorReference.length > 0) {
            if (this.oldAnchorReference !== undefined) {
                this.unregisterEvents(this.oldAnchorReference);
            }

            if (this.anchorReference.length > 0) {
                this.oldAnchorReference = this.anchorReference[0];
                this.registerEvents(this.anchorReference[0]);
                this.updateTooltip(this.anchorReference[0], this.tooltip);
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

    protected updateTooltip(anchor: HTMLElement, tooltip: HTMLElement): void {
        computePosition(anchor, tooltip, {
            placement: 'bottom-start',
            middleware: [offset(12), flip(), shift({ padding: 5 }), arrow({ element: this.arrowElement })]
        }).then(({ placement, x, y, middlewareData }) => {
            Object.assign(this.tooltip.style, {
                left: `${x}px`,
                top: `${y}px`
            });

            // Accessing the data
            const { x: arrowX, y: arrowY } = middlewareData.arrow as { x: number; y: number };

            const sides: { [key: string]: string } = {
                top: 'bottom',
                right: 'left',
                bottom: 'top',
                left: 'right'
            };
            const staticSide = sides[placement.split('-')[0]];

            Object.assign(this.arrowElement.style, {
                left: arrowX != null ? `${arrowX}px` : '',
                top: arrowY != null ? `${arrowY}px` : '',
                right: '',
                bottom: '',
                [staticSide]: '-4px'
            });
        });
    }
}
