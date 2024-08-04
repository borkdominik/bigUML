/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { css } from 'lit';

export namespace TextInputPaletteStyle {
    export const style = css`
        .body {
            display: flex;
            flex-direction: column;
        }

        .no-data-message {
            margin-top: 6px;
        }

        #navigate-back {
            position: absolute;
            left: 0;
            top: 18px;
        }

        #search {
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
    `;
}
