/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { CSSProperties } from 'react';

const baseButtonStyle: CSSProperties = {
    padding: '6px 14px',
    border: 'none',
    cursor: 'pointer',
    marginLeft: '8px'
};

/** Primary action button — themed with the VS Code button colors. */
export const buttonStyle: CSSProperties = {
    ...baseButtonStyle,
    backgroundColor: 'var(--vscode-button-background)',
    color: 'var(--vscode-button-foreground)'
};

/** Secondary action button — white/light background. */
export const secondaryButtonStyle: CSSProperties = {
    ...baseButtonStyle,
    backgroundColor: '#ffffff',
    color: '#333333',
    border: '1px solid #cccccc'
};

/** Applies the disabled visual treatment on top of a themed button style. */
export function withDisabled(style: CSSProperties, disabled?: boolean): CSSProperties {
    return disabled ? { ...style, opacity: 0.5, cursor: 'not-allowed' } : style;
}
