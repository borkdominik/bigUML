/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { VSCodeContext } from '@borkdominik-biguml/big-components';
import type { ReactElement } from 'react';
import { useContext, useEffect, useState } from 'react';
import { FileSaveResponse } from '../common/actions/file-save-action.js';
import { RequestChangeSnapshotNameAction } from '../common/actions/request-change-snapshot-name-action.js';
import { RequestDeleteSnapshotAction } from '../common/actions/request-delete-snapshot-action.js';
import { RequestExportSnapshotAction } from '../common/actions/request-export-snapshot-action.js';
import { RequestImportSnapshotAction } from '../common/actions/request-import-snapshot-action.js';
import { RequestRestoreSnapshotAction } from '../common/actions/request-restore-snapshot-action.js';
import { RequestSaveFileAction } from '../common/actions/request-save-file-action.js';
import type { Snapshot } from '../common/snapshot.js';
import { ConfirmDeleteModal } from './modals/confirm-delete-modal.js';
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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedSnapshot, setSelectedSnapshot] = useState<Snapshot | null>(null);
    const [deleting, setDeleting] = useState<Snapshot | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingMessage, setEditingMessage] = useState<string>('');

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

    const startEditing = (snapshot: Snapshot) => {
        setEditingId(snapshot.id);
        setEditingMessage(snapshot.message);
    };

    const submitEdit = (id: string) => {
        dispatchAction(RequestChangeSnapshotNameAction.create(id, editingMessage));
        setEditingId(null);
        setEditingMessage('');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditingMessage('');
    };

    const handleSave = () => {
        dispatchAction(RequestSaveFileAction.create());
    };

    return (
        <div style={{ padding: '0.25rem 0.5rem', fontFamily: 'var(--vscode-font-family)', color: 'var(--vscode-editor-foreground)' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', gap: '0.5rem' }}>
                <button
                    onClick={handleSave}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        background: 'var(--vscode-button-background)',
                        color: 'var(--vscode-button-foreground)',
                        border: 'none',
                        borderRadius: '3px',
                        padding: '0.4rem 0.8rem',
                        fontSize: '13px',
                        cursor: 'pointer'
                    }}
                >
                    <span className="codicon codicon-add" aria-hidden="true" />
                    Create New Timeline Entry
                </button>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[...timeline].reverse().map(snapshot => {
                    const isExpanded = expandedId === snapshot.id;
                    const isEditing = editingId === snapshot.id;
                    const bounds = snapshot.bounds ?? { x: 0, y: 0, width: 800, height: 600 };

                    return (
                        <li
                            key={snapshot.id}
                            style={{ marginBottom: '0.5rem', position: 'relative' }}
                        >
                            <div
                                style={{
                                    width: '8px', height: '8px', backgroundColor: 'transparent',
                                    border: '1px solid var(--vscode-editor-foreground)', borderRadius: '50%',
                                    position: 'absolute', top: '4px', left: '-14px'
                                }}
                            />

                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.25rem' }}>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editingMessage}
                                        onChange={e => setEditingMessage(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                submitEdit(snapshot.id);
                                            }
                                        }}
                                        style={{
                                            fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.2,
                                            flex: 1, color: 'var(--vscode-editor-foreground)',
                                            background: 'var(--vscode-input-background)',
                                            border: '1px solid var(--vscode-panel-border)', borderRadius: '2px', padding: '2px 4px'
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.2,
                                            flex: 1, cursor: 'pointer'
                                        }}
                                        onClick={() => setExpandedId(isExpanded ? null : snapshot.id)}
                                    >
                                        {snapshot.message}
                                    </div>
                                )}

                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={() => submitEdit(snapshot.id)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    cursor: 'pointer', background: 'none', border: 'none', padding: 0,
                                                    color: 'var(--vscode-editor-foreground)'
                                                }}
                                            >
                                                <span title="Save" className="codicon codicon-save" aria-hidden="true" />
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                style={{
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    cursor: 'pointer', background: 'none', border: 'none', padding: 0,
                                                    color: 'var(--vscode-editor-foreground)'
                                                }}
                                            >
                                                <span title="Cancel edit" className="codicon codicon-close" aria-hidden="true" />
                                            </button>
                                        </>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => startEditing(snapshot)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    cursor: 'pointer', background: 'none', border: 'none', padding: 0,
                                                    color: 'var(--vscode-editor-foreground)'
                                                }}
                                            >
                                                <span title="Edit entry name" className="codicon codicon-edit" aria-hidden="true" />
                                            </button>
                                            <button
                                                onClick={() => { setDeleting(snapshot); setShowDeleteModal(true); }}
                                                style={{
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    cursor: 'pointer', background: 'none', border: 'none', padding: 0,
                                                    color: 'var(--vscode-editor-foreground)'
                                                }}
                                            >
                                                <span title="Delete entry" className="codicon codicon-trash" aria-hidden="true" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: '0.1rem' }}>
                                {new Date(snapshot.timestamp).toLocaleString()}
                            </div>

                            {isExpanded && (
                                <div style={{ marginTop: '0.4rem' }}>
                                    <div style={{ maxHeight: '200px', minWidth: '150px' }}>
                                        <svg
                                            viewBox={`0 0 ${bounds.width} ${bounds.height}`}
                                            style={{ display: 'block', border: '1px solid var(--vscode-panel-border)' }}
                                        >
                                            <g dangerouslySetInnerHTML={{ __html: snapshot.svg! }} />
                                        </svg>
                                    </div>

                                    <div style={buttonRowStyle}>
                                        <button onClick={() => handleRestore(snapshot)} style={exportButtonStyle}>Restore</button>
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
                    onImport={file => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            try {
                                const importedSnapshots = JSON.parse(reader.result as string) as Snapshot[];
                                dispatchAction(RequestImportSnapshotAction.create(importedSnapshots));
                            } catch (error) {
                                console.error("Error parsing JSON:", error);
                            }
                        };
                        reader.onerror = () => console.error("File reading error:", reader.error);
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
                        const blob = new Blob([JSON.stringify(toExport, null, 2)], { type: 'application/json' });
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
                    onCancel={() => { setShowRestoreModal(false); setSelectedSnapshot(null); }}
                    onConfirm={() => {
                        dispatchAction(RequestRestoreSnapshotAction.create(selectedSnapshot.id));
                        setShowRestoreModal(false);
                        setSelectedSnapshot(null);
                    }}
                />
            )}

            {showDeleteModal && deleting && (
                <ConfirmDeleteModal
                    name={deleting.message}
                    onCancel={() => { setShowDeleteModal(false); setDeleting(null); }}
                    onConfirm={() => {
                        dispatchAction(RequestDeleteSnapshotAction.create(deleting?.id, deleting?.message));
                        setShowDeleteModal(false);
                        setDeleting(null);
                    }}
                />
            )}
        </div>
    );
}

const buttonRowStyle: React.CSSProperties = {
    display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center',
    gap: '0.4rem', borderTop: '1px solid var(--vscode-panel-border)', paddingTop: '0.75rem', marginTop: '1rem'
};

const buttonBaseStyle: React.CSSProperties = {
    fontSize: '13px', padding: '0.35rem 1.1rem', borderRadius: '3px', cursor: 'pointer',
    minWidth: '100px', flexGrow: 1, textAlign: 'center', whiteSpace: 'nowrap', lineHeight: '1.4'
};

const exportButtonStyle: React.CSSProperties = {
    ...buttonBaseStyle,
    backgroundColor: 'var(--vscode-button-background)',
    color: 'var(--vscode-button-foreground)',
    border: 'none'
};
