/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { ReactElement } from 'react';

interface ConfirmDeleteModalProps {
    name: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDeleteModal({ name, onConfirm, onCancel }: ConfirmDeleteModalProps): ReactElement {
    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h3 style={titleStyle}>Delete Timeline Entry</h3>
                <hr style={dividerStyle} />
                <p style={textStyle}>Are you sure you want to delete the timeline entry <b>{name}</b>?</p>
                <div style={buttonRowStyle}>
                    <button onClick={onCancel} style={cancelButtonStyle}>Cancel</button>
                    <button onClick={onConfirm} style={exportButtonStyle}>Delete</button>
                </div>
            </div>
        </div>
    );
}

const dividerStyle: React.CSSProperties = {
    border: 'none',
    borderTop: '1px solid var(--vscode-panel-border)',
    margin: '0.20rem 0 0.15rem 0'
};

const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(var(--vscode-editor-background-rgb), 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999
};

const modalStyle: React.CSSProperties = {
    backgroundColor: 'var(--vscode-editor-background)',
    color: 'var(--vscode-editor-foreground)',
    padding: '1.25rem 1.25rem',
    borderRadius: '6px',
    width: '90%',
    maxWidth: '320px',
    boxShadow: 'var(--vscode-editor-widget-shadow)',
    fontSize: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
};

const titleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 'bold'
};

const textStyle: React.CSSProperties = {
    fontSize: '13px',
    lineHeight: 1.5,
    marginTop: '0.25rem'
};

const buttonRowStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '0.4rem',
    borderTop: '1px solid var(--vscode-panel-border)',
    paddingTop: '0.75rem',
    marginTop: '1rem'
};

const buttonBaseStyle: React.CSSProperties = {
    fontSize: '13px',
    padding: '0.35rem 1.1rem',
    borderRadius: '3px',
    cursor: 'pointer',
    minWidth: 'auto',
    display: 'inline-block',
    height: 'auto',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    lineHeight: '1.4'
};

const cancelButtonStyle: React.CSSProperties = {
    ...buttonBaseStyle,
    backgroundColor: 'var(--vscode-button-secondaryBackground)',
    color: 'var(--vscode-button-secondaryForeground)',
    border: '1px solid var(--vscode-button-secondaryBorder)'
};

const exportButtonStyle: React.CSSProperties = {
    ...buttonBaseStyle,
    backgroundColor: 'var(--vscode-button-background)',
    color: 'var(--vscode-button-foreground)',
    border: 'none'
};