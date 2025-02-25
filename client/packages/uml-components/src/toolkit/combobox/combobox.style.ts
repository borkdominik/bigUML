/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { css } from '@microsoft/fast-element';
import { ComboboxOptions, disabledCursor, display, ElementDefinitionContext, focusVisible } from '@microsoft/fast-foundation';
import {
    borderWidth,
    cornerRadius,
    designUnit,
    disabledOpacity,
    dropdownBackground,
    dropdownBorder,
    dropdownListMaxHeight,
    focusBorder,
    fontFamily,
    foreground,
    inputHeight,
    inputMinWidth,
    listActiveSelectionBackground,
    listActiveSelectionForeground,
    typeRampBaseFontSize,
    typeRampBaseLineHeight
} from '@vscode/webview-ui-toolkit/dist/design-tokens';

export const bigComboxboxStyles = (_context: ElementDefinitionContext, _definition: ComboboxOptions) => css`
    ${display('inline-flex')} :host {
        background: ${dropdownBackground};
        box-sizing: border-box;
        color: ${foreground};
        contain: contents;
        font-family: ${fontFamily};
        height: calc(${inputHeight} * 1px);
        position: relative;
        user-select: none;
        min-width: ${inputMinWidth};
        outline: none;
        vertical-align: top;
    }
    .control {
        align-items: center;
        box-sizing: border-box;
        border: calc(${borderWidth} * 1px) solid ${dropdownBorder};
        border-radius: calc(${cornerRadius} * 1px);
        cursor: pointer;
        display: flex;
        font-family: inherit;
        font-size: ${typeRampBaseFontSize};
        line-height: ${typeRampBaseLineHeight};
        min-height: 100%;
        padding: 2px 6px 2px 8px;
        width: 100%;
    }
    .listbox {
        background: ${dropdownBackground};
        border: calc(${borderWidth} * 1px) solid ${focusBorder};
        border-radius: calc(${cornerRadius} * 1px);
        box-sizing: border-box;
        display: inline-flex;
        flex-direction: column;
        left: 0;
        max-height: ${dropdownListMaxHeight};
        padding: 0 0 calc(${designUnit} * 1px) 0;
        overflow-y: auto;
        position: absolute;
        width: 100%;
        z-index: 1;
    }
    .listbox[hidden] {
        display: none;
    }
    :host(:${focusVisible}) .control {
        border-color: ${focusBorder};
    }
    :host(:not([disabled]):hover) {
        background: ${dropdownBackground};
        border-color: ${dropdownBorder};
    }
    :host(:${focusVisible}) ::slotted([aria-selected="true"][role="option"]:not([disabled])) {
        background: ${listActiveSelectionBackground};
        border: calc(${borderWidth} * 1px) solid ${focusBorder};
        color: ${listActiveSelectionForeground};
    }
    :host([disabled]) {
        cursor: ${disabledCursor};
        opacity: ${disabledOpacity};
    }
    :host([disabled]) .control {
        cursor: ${disabledCursor};
        user-select: none;
    }
    :host([disabled]:hover) {
        background: ${dropdownBackground};
        color: ${foreground};
        fill: currentcolor;
    }
    :host(:not([disabled])) .control:active {
        border-color: ${focusBorder};
    }
    :host(:empty) .listbox {
        display: none;
    }
    :host([open]) .control {
        border-color: ${focusBorder};
    }
    :host([open][position='above']) .listbox,
    :host([open][position='below']) .control {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }
    :host([open][position='above']) .control,
    :host([open][position='below']) .listbox {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }
    :host([open][position='above']) .listbox {
        bottom: calc(${inputHeight} * 1px);
    }
    :host([open][position='below']) .listbox {
        top: calc(${inputHeight} * 1px);
    }
    .selected-value {
        flex: 1 1 auto;
        font-family: inherit;
        overflow: hidden;
        text-align: start;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .indicator {
        flex: 0 0 auto;
        margin-inline-start: 1em;
    }
    slot[name='listbox'] {
        display: none;
        width: 100%;
    }
    :host([open]) slot[name='listbox'] {
        display: flex;
        position: absolute;
    }
    .end {
        margin-inline-start: auto;
    }
    .start,
    .end,
    .indicator,
    .select-indicator,
    ::slotted(svg),
    ::slotted(span) {
        fill: currentcolor;
        height: 1em;
        min-height: calc(${designUnit} * 4px);
        min-width: calc(${designUnit} * 4px);
        width: 1em;
    }
    ::slotted([role='option']),
    ::slotted(option) {
        flex: 0 0 auto;
    }

    .selected-value {
        -webkit-appearance: none;
        font: inherit;
        background: transparent;
        border: 0;
        color: inherit;
        height: calc(100% - (${designUnit} * 1px));
        width: 100%;
        margin-top: auto;
        margin-bottom: auto;
        border: none;
        padding: 0 calc(${designUnit} * 2px + 1px);
        font-size: ${typeRampBaseFontSize};
        line-height: ${typeRampBaseLineHeight};
    }
    .selected-value:hover,
	.selected-value:${focusVisible},
	.selected-value:disabled,
	.selected-value:active {
        outline: none;
    }
    :host([readonly]) .selected-value,
    :host([disabled]) .selected-value {
        cursor: ${disabledCursor};
    }
    :host([disabled]) .selected-value {
        border-color: ${dropdownBorder};
    }
`;
