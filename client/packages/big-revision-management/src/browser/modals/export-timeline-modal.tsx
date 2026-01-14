/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import type { Snapshot } from '../../common/snapshot.js';

interface ExportTimelineModalProps {
    timeline: Snapshot[];
    onClose: () => void;
    onExport: (scope: { type: 'all' | 'last'; count?: number }) => void;
}

export function ExportTimelineModal({ onClose, onExport }: ExportTimelineModalProps): ReactElement {
    const [exportType, setExportType] = useState<'all' | 'last'>('last');

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const [entryCountText, setEntryCountText] = useState('1');

    const handleExport = () => {
        const count = Math.max(1, Number(entryCountText) || 1);
        const scope = exportType === 'all'
            ? { type: 'all' as const }
            : { type: 'last' as const, count };

        onExport(scope);
        onClose();
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <button onClick={onClose} style={closeButtonStyle}>×</button>
                <h3 style={titleStyle}>Export Timeline</h3>
                <hr style={dividerStyle} />

                <div style={sectionStyle}>
                    <label style={labelStyle}>Export Scope</label>
                    <label style={radioStyle}>
                        <input
                            type="radio"
                            name="scope"
                            checked={exportType === 'all'}
                            onChange={() => setExportType('all')}
                        />
                        <span style={{ marginLeft: '0.4rem' }}>Export entire timeline</span>
                    </label>
                    <label style={radioStyle}>
                        <input
                            type="radio"
                            name="scope"
                            checked={exportType === 'last'}
                            onChange={() => setExportType('last')}
                        />
                        <span style={{ marginLeft: '0.4rem' }}>
                            Export only the last{' '}
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                placeholder="n"
                                value={entryCountText}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^\d*$/.test(val)) {
                                        setEntryCountText(val);
                                    }
                                }}
                                style={numberInputStyle}
                            />
                        </span>
                    </label>

                    <span style={{
                        display: 'block',
                        fontSize: '11px',
                        marginLeft: '1.6rem',
                        opacity: 0.6
                    }}>
                        If the number exceeds total entries, the full timeline will be exported.
                    </span>
                </div>

                <div style={buttonRowStyle}>
                    <button onClick={onClose} style={cancelButtonStyle}>Cancel</button>
                    <button onClick={handleExport} style={exportButtonStyle}>Export</button>
                </div>
            </div>
        </div>
    );
}


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
    fontSize: '14px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '240px'
};

const titleStyle: React.CSSProperties = {
    fontSize: '15px',
    fontWeight: 'bold',
    marginBottom: '1rem'
};

const sectionStyle: React.CSSProperties = {
    marginBottom: '1.5rem'
};

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontWeight: 500,
    marginBottom: '0.5rem'
};

const radioStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.5rem'
};

const numberInputStyle: React.CSSProperties = {
    width: '40px',
    marginLeft: '0.5rem',
    backgroundColor: 'var(--vscode-input-background)',
    color: 'var(--vscode-input-foreground)',
    border: '1px solid var(--vscode-input-border)',
    borderRadius: '3px',
    padding: '0.1rem 0.3rem',
    fontSize: '12px',
    textAlign: 'center'
};

const dividerStyle: React.CSSProperties = {
    border: 'none',
    borderTop: '1px solid var(--vscode-panel-border)',
    margin: '0.75rem 0'
};

const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    background: 'none',
    color: 'var(--vscode-editor-foreground)',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer'
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