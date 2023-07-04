/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { css } from 'lit';

export namespace ContextMenuStyle {
    export const style = css`
        #context-menu {
            display: none;
            width: max-content;
            position: absolute;
            top: 0;
            left: 0;
            min-width: 160px;
            outline: 1px solid var(--vscode-menu-border);
            border-radius: 5px;
            color: var(--vscode-menu-foreground);
            background-color: var(--vscode-menu-background);
            box-shadow: 0 2px 8px var(--vscode-widget-shadow);
            z-index: 9100;
        }

        #context-menu[popup-show] {
            display: block;
        }

        .action-bar {
            padding: 4px 0;
        }

        .actions-container {
            display: flex;
            flex-direction: column;
        }
    `;
}

export namespace ContextMenuItemStyle {
    export const style = css`
        .action-item {
            display: flex;
            flex-direction: row;
            height: 2em;
            text-decoration: none;
            color: var(--vscode-menu-foreground);
            outline-offset: -1px;
            align-items: center;
            position: relative;
            margin: 0 4px;
            border-radius: 4px;
            cursor: pointer;
        }

        .action-item:hover {
            color: var(--vscode-menu-selectionForeground);
            background-color: var(--vscode-menu-selectionBackground);
            outline: 1px solid var(--vscode-menu-selectionBorder);
            outline-offset: -1px;
        }

        .action-item .action-icon {
            position: absolute;
            width: 2em;
            font-size: 13px;
            line-height: 13px;
        }

        .action-item .action-label {
            flex: 1 1 auto;
            padding: 0 2em;
            font-size: 13px;
            line-height: 13px;
        }
    `;
}
