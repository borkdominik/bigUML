/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { css } from 'lit';

export const defaultStyle = css`
    .title {
        text-transform: uppercase;
        margin: 6px 0;
        word-wrap: break-word;
    }

    h4.secondary-title {
        margin: -1em 0 1em 0;
    }

    .no-data-message {
        opacity: 0.5;
    }

    .hint-text {
        opacity: 0.5;
    }
`;
