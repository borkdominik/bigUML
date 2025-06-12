/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { VSCodeContext } from '@borkdominik-biguml/big-components';
import type { ReactElement } from 'react';
import { useContext, useEffect, useState } from 'react';
import { FileSaveResponse } from '../common/actions/file-save-action.js';
import { RequestExportSnapshotAction } from '../common/actions/request-export-snapshot-action.js';
import { RequestImportSnapshotAction } from '../common/actions/request-import-snapshot-action.js';
import { RequestRestoreSnapshotAction } from '../common/actions/request-restore-snapshot-action.js';
import { type Snapshot } from '../common/snapshot.js';
import { ConfirmRestoreModal } from './modals/confirm-restore-modal.js';
import { ExportTimelineModal } from './modals/export-timeline-modal.js';
import { ImportTimelineModal } from './modals/import-timeline-modal.js';

export function RevisionManagement(): ReactElement {
    const { listenAction, dispatchAction } = useContext(VSCodeContext);

    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [timeline, setTimeline] = useState<Snapshot[]>([]);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [selectedSnapshot, setSelectedSnapshot] = useState<Snapshot | null>(null);

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

    const handleExportSnapshot = () => {
        dispatchAction(RequestExportSnapshotAction.create());
    };

    const handleRestore = (snapshot: Snapshot) => {
        setSelectedSnapshot(snapshot);
        setShowRestoreModal(true);
    };

    return (
        <div style={{ padding: '0.25rem 0.5rem', fontFamily: 'var(--vscode-font-family)', color: 'var(--vscode-editor-foreground)' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[...timeline].reverse().map((snapshot) => {
                    const isExpanded = expandedId === snapshot.id;


                    const bounds = snapshot.bounds ?? { x: 0, y: 0, width: 800, height: 600 };

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
                            <div style={{ fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.2 }}>{snapshot.message}</div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{new Date(snapshot.timestamp).toLocaleString()}</div>

                            {isExpanded && (
                                <div style={{ marginTop: '0.4rem' }}>
                                    <div style={{
                                        maxHeight: '200px',
                                        minWidth: '150px'

                                    }}>
                                        <svg
                                            viewBox={`0 0 ${bounds.width} ${bounds.height}`}
                                            style={{ display: 'block', border: '1px solid var(--vscode-panel-border)' }}
                                        >
                                            <g dangerouslySetInnerHTML={{ __html: snapshot.svg }} />
                                        </svg>
                                    </div>


                                    <div style={buttonRowStyle}>
                                        <button onClick={() => handleRestore(snapshot)} style={cancelButtonStyle}>Restore</button>
                                        <button onClick={() => handleExportSnapshot()} style={exportButtonStyle}>Export Snapshot</button>
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
                        console.log('Imported file type:', file instanceof File);
                        const reader = new FileReader();

                        reader.onload = () => {
                            console.log('onload triggered');
                            try {
                                const text = reader.result as string;
                                console.log('Imported file content:', text);
                                const importedSnapshots = JSON.parse(text) as Array<Snapshot>;
                                console.log('Imported file snapshots:', importedSnapshots);
                                dispatchAction(RequestImportSnapshotAction.create(importedSnapshots));
                            } catch (error) {
                                console.error("Error parsing JSON:", error);
                            }
                        };

                        reader.onerror = () => {
                            console.error("File reading error:", reader.error);
                        };

                        reader.readAsText(file);
                    }}
                />
            )}
            {showExportModal && (
                <ExportTimelineModal
                    timeline={timeline}
                    onClose={() => setShowExportModal(false)}
                    onExport={({ type, count }) => {
                        const toExport = type === 'all'
                            ? timeline
                            : timeline.slice(-Math.max(1, count ?? 1));

                        const blob = new Blob([JSON.stringify(toExport, null, 2)], {
                            type: 'application/json'
                        });

                        const url = URL.createObjectURL(blob);
                        const anchor = document.createElement('a');
                        anchor.href = url;
                        anchor.download = 'timeline-export.json';
                        anchor.click();
                        URL.revokeObjectURL(url);
                    }}
                />
            )}

            {showRestoreModal && selectedSnapshot && (
                <ConfirmRestoreModal
                    onCancel={() => {
                        setShowRestoreModal(false);
                        setSelectedSnapshot(null);
                    }}
                    onConfirm={() => {
                        dispatchAction(RequestRestoreSnapshotAction.create(selectedSnapshot.id));
                        setShowRestoreModal(false);
                        setSelectedSnapshot(null);
                    }}
                />

            )}
        </div>
    );
}

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
    minWidth: '100px',
    flexGrow: 1,
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