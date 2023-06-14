/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { css, CSSResult, unsafeCSS } from 'lit';

const codiconCSS = document.getElementById('codicon-css') as HTMLLinkElement | null;
if (codiconCSS === null) {
    throw Error("No codicon css with id 'codicon-css' found. Please add it to your document.");
}
const codiconStyleSheet = [...document.styleSheets].find(s => s.href === codiconCSS.href)!;

function convert(style: CSSStyleSheet): CSSResult {
    const rules = Object.values(style.cssRules)
        .map(rule => rule.cssText)
        .join('\n');
    return css`
        ${unsafeCSS(rules)}
    `;
}

export const codiconStyle = convert(codiconStyleSheet);
export const defaultStyle = css`
    .title {
        text-transform: uppercase;
    }

    h4.secondary-title {
        margin: -1em 0 1em 0;
    }
`;
