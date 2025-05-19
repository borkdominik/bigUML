/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { ReactElement } from 'react';
import { useState, useEffect, useContext } from 'react';
import { ImportTimelineModal } from './ImportTimelineModal.js';
import { ExportTimelineModal } from './ExportTimelineModal.js';
import { ConfirmRestoreModal } from './ConfirmRestoreModal.js';
import { VSCodeContext } from '@borkdominik-biguml/big-components';
import { FileSaveResponse } from '../common/file-save-action.js';
import { type Snapshot } from '../common/snapshot.js';

export function RevisionManagement(): ReactElement {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [timeline, setTimeline] = useState<Snapshot[]>([]);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [selectedSnapshot, setSelectedSnapshot] = useState<Snapshot | null>(null);

    const { listenAction } = useContext(VSCodeContext);

    useEffect(() => {
        listenAction(action => {
            if (FileSaveResponse.is(action)) {
                setTimeline(action.timeline);
            }
        });
    }, [listenAction]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const { data } = event;
            if (data?.action === 'import') setShowImportModal(true);
            else if (data?.action === 'export') setShowExportModal(true);
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return (
        <div style={{ padding: '0.25rem 0.5rem', fontFamily: 'var(--vscode-font-family)', color: 'var(--vscode-editor-foreground)' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {timeline.map((snapshot) => {
                    const isExpanded = expandedId === snapshot.id;

                    const handleRestore = (snapshot: Snapshot) => {
                        setSelectedSnapshot(snapshot);
                        setShowRestoreModal(true);
                    };

                    let viewBox = '0 0 800 600';
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(snapshot.svg, 'image/svg+xml');
                        const rawViewBox = doc.documentElement?.getAttribute('viewBox');
                        if (rawViewBox) viewBox = rawViewBox;
                    } catch {
                        console.warn('Failed to parse SVG viewBox.');
                    }

                    return (
                        <li
                            key={snapshot.id}
                            style={{ marginBottom: '0.5rem', cursor: 'pointer', position: 'relative' }}
                            onClick={() => setExpandedId(isExpanded ? null : snapshot.id)}
                        >
                            <div
                                style={{
                                    width: '8px',
                                    height: '8px',
                                    backgroundColor: 'transparent',
                                    border: '1px solid var(--vscode-editor-foreground)',
                                    borderRadius: '50%',
                                    position: 'absolute',
                                    top: '4px',
                                    left: '-14px'
                                }}
                            />
                            <div style={{ fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.2 }}>
                                {snapshot.message}
                            </div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>
                                {snapshot.author} • {new Date(snapshot.timestamp).toLocaleString()}
                            </div>
                            {isExpanded && (
                                <div style={{ marginTop: '0.4rem' }}>
                                    <div style={{
                                        width: '100%',
                                        aspectRatio: '4 / 3',
                                        backgroundColor: 'var(--vscode-editor-background)',
                                        border: '1px solid var(--vscode-editorWidget-border)',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        overflow: 'hidden'
                                    }}>
                                        <svg
                                            width="100%"
                                            height="100%"
                                            preserveAspectRatio="xMidYMid meet"
                                            viewBox={viewBox}
                                            dangerouslySetInnerHTML={{ __html: snapshot.svg }}
                                        />
                                    </div>

                                    <div style={buttonRowStyle}>
                                        <button onClick={() => handleRestore(snapshot)} style={cancelButtonStyle}>
                                            Restore
                                        </button>
                                        <button onClick={() => handleExportSnapshot(snapshot)} style={exportButtonStyle}>
                                            Export Snapshot
                                        </button>
                                    </div>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>

            {showImportModal && (
                <ImportTimelineModal
                    onClose={() => setShowImportModal(false)}
                    onImport={(file) => {
                        console.log('Imported file:', file.name);
                        // TODO: handle import
                    }}
                />
            )}
            {showExportModal && (
                <ExportTimelineModal onClose={() => setShowExportModal(false)} onExport={() => { /* ... */ }} />
            )}
            {showRestoreModal && selectedSnapshot && (
                <ConfirmRestoreModal
                    onCancel={() => {
                        setShowRestoreModal(false);
                        setSelectedSnapshot(null);
                    }}
                    onConfirm={() => {
                        console.log('[Confirmed Restore] Snapshot:', selectedSnapshot.id);
                        setShowRestoreModal(false);
                        setSelectedSnapshot(null);
                        // TODO: handle restore logic
                    }}
                />
            )}
        </div>
    );
}

const handleExportSnapshot = (snapshot: Snapshot) => {
    const blob = new Blob([snapshot.svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${snapshot.id}.svg`;
    a.click();
    URL.revokeObjectURL(url);
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
    minWidth: '100px',        // ensures buttons don’t collapse too much
    flexGrow: 1,              // allows buttons to take equal space in row
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
