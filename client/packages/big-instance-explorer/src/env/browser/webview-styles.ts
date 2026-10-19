/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { CSSProperties } from 'react';

/**
 * Shared webview control styling for the Instance Explorer package.
 *
 * These mirror the button/checkbox design used by the Object-to-Class
 * Transformation feature so every panel renders consistent controls: plain
 * VS Code-themed buttons (no custom borders) and accent-colored checkboxes.
 */

const baseButtonStyle: CSSProperties = {
    padding: '6px 14px',
    border: 'none',
    cursor: 'pointer'
};

/** Primary action button — themed with the VS Code button colors. */
export const primaryButtonStyle: CSSProperties = {
    ...baseButtonStyle,
    backgroundColor: 'var(--vscode-button-background)',
    color: 'var(--vscode-button-foreground)'
};

/** Secondary / cancel button — themed with the VS Code secondary button colors. */
export const secondaryButtonStyle: CSSProperties = {
    ...baseButtonStyle,
    backgroundColor: 'var(--vscode-button-secondaryBackground)',
    color: 'var(--vscode-button-secondaryForeground)'
};

/** Checkbox styling that ties the native control into the VS Code button theme. */
export const checkboxStyle: CSSProperties = {
    accentColor: 'var(--vscode-button-background)',
    cursor: 'pointer'
};

/** Applies the disabled visual treatment on top of a themed button style. */
export function withDisabled(style: CSSProperties, disabled?: boolean): CSSProperties {
    return disabled ? { ...style, opacity: 0.5, cursor: 'not-allowed' } : style;
}
