/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { css } from 'lit';

export namespace PropertyPaletteStyle {
    export const style = css`
        .body {
            display: flex;
            flex-direction: column;
        }

        .search {
            margin-bottom: 6px;
        }

        .grid {
            display: grid;
            grid-template-columns: [label-start] minmax(0, 1fr) [value-start] minmax(0, 1fr);
            gap: 6px 6px;
            justify-items: stretch;
            align-items: center;
            margin: 6px 0;
        }

        .grid-label {
            grid-column-start: label-start;
        }

        .grid-value {
            grid-column-start: value-start;
        }

        .grid-flex {
            display: flex;
            flex-direction: column;
        }

        .dropdown-option {
            display: flex;
            flex-direction: column;
        }

        .reference-item .create-reference {
            color: var(--uml-successBackground);
        }

        .reference-item .delete {
            color: var(--uml-errorForeground);
        }
    `;
}
