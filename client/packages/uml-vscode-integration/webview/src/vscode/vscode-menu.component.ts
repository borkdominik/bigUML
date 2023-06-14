/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { css, html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BigUMLComponent } from '../webcomponents/component';

import './toolkit';

@customElement('biguml-vscode-menu')
export class VSCodeMenu extends BigUMLComponent {
    static override styles = [
        css`
            :host {
                display: flex;
                flex-direction: column;
            }

            .header {
                display: flex;
                flex-direction: row;
            }

            .header > .title {
                flex: 1;
                font-size: 11px;
            }

            .header > .actions {
                display: flex;
                flex-direction: column;
                justify-content: center;
            }

            .body > .actions {
                display: flex;
                flex-direction: row;
            }

            .reference-item {
                display: flex;
                flex-direction: row;
                margin-bottom: 6px;
            }

            .reference-item > .label {
                flex: 1;
            }

            .reference-item .delete {
                color: var(--uml-errorForeground);
            }
        `
    ];

    override render(): TemplateResult<1> {
        return html`<slot @slotchange=${this.handleSlotChange}></slot>`;
    }

    protected handleSlotChange(e: any): void {
        const elements = e.target.assignedElements({ flatten: false }) as HTMLElement[];
        elements.forEach(element => {
            element.addEventListener('click', this.onClicked);
        });
    }

    protected onClicked(event: MouseEvent): void {
        const bound = this.getBoundingClientRect();
        const evt = new MouseEvent('contextmenu', {
            bubbles: true,
            composed: true,
            clientX: bound.x,
            clientY: bound.y + bound.height
        });
        event.target?.dispatchEvent(evt);
        event.stopImmediatePropagation();
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'biguml-vscode-menu': VSCodeMenu;
    }
}
