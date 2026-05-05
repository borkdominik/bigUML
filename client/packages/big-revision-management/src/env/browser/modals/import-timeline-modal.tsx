/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/


// ImportTimelineModal.tsx
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';

interface ImportTimelineModalProps {
    onClose: () => void;
    onImport: (file: File, scope: { type: 'all' | 'last'; count?: number }) => void;
}

export function ImportTimelineModal({ onClose, onImport }: ImportTimelineModalProps): ReactElement {
    const [file, setFile] = useState<File | null>(null);
    const [importType, setImportType] = useState<'all' | 'last'>('last');
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] ?? null;
        setFile(selected);
    };

    const handleImport = () => {
        if (!file) return;
        if (importType === 'last' && (!count || count < 1)) {
            alert("Please enter a valid number.");
            return;
        }
        onImport(file, importType === 'all' ? { type: 'all' } : { type: 'last', count: count! });
        onClose();
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <button onClick={onClose} style={closeButtonStyle}>×</button>
                <h3 style={titleStyle}>Import Timeline</h3>

                <hr style={dividerStyle} />

                <div style={sectionStyle}>
                    <label style={labelStyle}>Upload JSON File</label>
                    <div style={fileRowStyle}>
                        <label htmlFor="file-upload" style={customFileLabelStyle}>Browse...</label>
                        <span style={fileNameStyle}>{file?.name || 'No file chosen'}</span>
                        <input
                            id="file-upload"
                            type="file"
                            accept=".json"
                            onChange={handleFileChange}
                            style={hiddenFileInputStyle}
                        />
                    </div>
                </div>

                <hr style={dividerStyle} />

                <div style={sectionStyle}>
                    <label style={labelStyle}>Import Scope</label>
                    <label style={radioStyle}>
                        <input
                            type="radio"
                            name="importScope"
                            checked={importType === 'all'}
                            onChange={() => setImportType('all')}
                        />
                        <span style={{ marginLeft: '0.4rem' }}>Import entire timeline</span>
                    </label>
                    <label style={radioStyle}>
                        <input
                            type="radio"
                            name="importScope"
                            checked={importType === 'last'}
                            onChange={() => setImportType('last')}
                        />
                        <span style={{ marginLeft: '0.4rem' }}>
                            Import only the last{' '}
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                placeholder="n"
                                value={count === null ? '' : count}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^\d*$/.test(val)) {
                                        setCount(val === '' ? null : Number(val));
                                    }
                                }}
                                style={numberInputStyle}
                            />
                        </span>
                    </label>
                </div>

                <div style={buttonRowStyle}>
                    <button onClick={onClose} style={cancelButtonStyle}>Cancel</button>
                    <button onClick={handleImport} style={importButtonStyle}>Import</button>

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
    padding: '0.15rem 0.3rem',
    fontSize: '12px',
    textAlign: 'center'
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

const hiddenFileInputStyle: React.CSSProperties = {
    display: 'none'
};

const dividerStyle: React.CSSProperties = {
    border: 'none',
    borderTop: '1px solid var(--vscode-panel-border)',
    margin: '0.75rem 0'
};

const fileRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
};

const customFileLabelStyle: React.CSSProperties = {
    backgroundColor: 'var(--vscode-button-secondaryBackground)',
    color: 'var(--vscode-button-secondaryForeground)',
    padding: '0.2rem 0.8rem',
    borderRadius: '3px',
    fontSize: '12px',
    cursor: 'pointer',
    border: '1px solid var(--vscode-button-secondaryBorder)'
};

const fileNameStyle: React.CSSProperties = {
    fontSize: '12px',
    color: 'var(--vscode-editor-foreground)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '180px'
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

const importButtonStyle: React.CSSProperties = {
    ...buttonBaseStyle,
    backgroundColor: 'var(--vscode-button-background)',
    color: 'var(--vscode-button-foreground)',
    border: 'none'
};
