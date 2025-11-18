/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

// Stub VS Code webview API
vi.stubGlobal('acquireVsCodeApi', () => ({
    postMessage: vi.fn(),
    getState: vi.fn(() => undefined),
    setState: vi.fn()
}));

// Mock the entire big-components (avoid side-effects at import)
vi.mock('@borkdominik-biguml/big-components', () => {
    const VSCodeContext = React.createContext({
        clientId: undefined as string | undefined,
        dispatchAction: (_: unknown) => {},
        listenAction: (_: (a: unknown) => void) => {}
    });
    return { VSCodeContext };
});

// Mock the webview UI toolkit
vi.mock('@vscode/webview-ui-toolkit/react/index.js', () => {
    return {
        // Wrap input so children (the search icon) don't become input children
        VSCodeTextField: (props: any) => {
            const { children, ...rest } = props ?? {};
            return React.createElement(
                'div',
                { 'data-testid': 'vscode-textfield' },
                React.createElement('input', { 'data-testid': 'search-input', ...rest }),
                children
            );
        },
        VSCodeTag: (props: any) => {
            const { children, ...rest } = props ?? {};
            return React.createElement('span', { 'data-testid': 'tag', ...rest }, children);
        }
    };
});
