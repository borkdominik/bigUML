/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { LitElement, TemplateResult, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('biguml-property-palette')
export class PropertyPalette extends LitElement {
    static override styles = css`
        :host {
            display: block;
            border: solid 1px gray;
            padding: 16px;
            max-width: 800px;
        }
    `;

    @property()
    name = 'World';

    @property({ type: Number })
    count = 0;

    override render(): TemplateResult<1> {
        return html`
            <h1>${this.sayHello(this.name)}!</h1>
            <vscode-button appearance="primary" @click=${this._onClick}>Click Count: ${this.count}</vscode-button>
            <slot></slot>
        `;
    }

    private _onClick(): void {
        this.count++;
        this.dispatchEvent(new CustomEvent('count-changed'));
    }

    sayHello(name: string): string {
        return `Hello, ${name}`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'biguml-property-palette': PropertyPalette;
    }
}
