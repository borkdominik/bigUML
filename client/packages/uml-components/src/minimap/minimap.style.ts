/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { css } from 'lit';

export namespace MinimapPaletteStyle {
    export const style = css`
        .body {
            display: flex;
            flex-direction: column;
        }

        .no-data-message {
            margin-top: 6px;
        }

        .svg {
            width: auto; 
            height: auto;
        }

        #navigate-back {
            position: absolute;
            left: 0;
            top: 18px;
        }

        #search {
            margin-bottom: 6px;
        }
    `;
}
