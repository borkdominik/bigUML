/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { css } from 'lit';

export namespace TextInputPaletteReferenceStyle {
    export const style = css`
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

        .sortable-drag {
            opacity: 0.6;
            background: var(--vscode-editor-background);
        }

        .reference-item {
            display: flex;
            flex-direction: column;
            margin-bottom: 6px;
        }

        .reference-item-body > .label,
        .reference-item-body > .name {
            flex: 1;
            margin-right: 6px;
        }

        .reference-item-body > .label {
            margin-left: 12px;
        }

        .reference-item-body > .name {
            display: flex;
            flex-direction: column;
        }

        .reference-item-body {
            display: flex;
            flex-direction: row;
            align-items: center;
        }

        .reference-item-body > .item-actions {
            display: flex;
            flex-direction: row;
        }

        .reference-item-body .delete {
            color: var(--uml-errorForeground);
        }

        .reference-item .hint-text {
            margin: 6px 48px 6px 12px;
        }

        .reference-item .handle-empty {
            margin-left: 24px;
        }

        .autocomplete {
            margin-bottom: 6px;
            width: 100%;
        }
    `;
}
