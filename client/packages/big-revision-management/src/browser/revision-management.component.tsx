/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { VSCodeContext } from '@borkdominik-biguml/big-components';
import { useContext, useEffect, useState, type ReactElement } from 'react';
import { FileSaveResponse } from '../common/file-save-action.js';
import { type Snapshot } from '../common/snapshot.js';

export function RevisionManagement(): ReactElement {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [timeline, setTimeline] = useState<Snapshot[]>([]);

    const { listenAction } = useContext(VSCodeContext);
    useEffect(() => {
        listenAction(action => {
            if (FileSaveResponse.is(action)) {
                setTimeline(action.timeline);
            }
        });
    }, [listenAction]);

    return (
        <div style={{ padding: '0.25rem 0.5rem', fontFamily: 'var(--vscode-font-family)', color: 'var(--vscode-editor-foreground)' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {timeline.map((snapshot) => {
                    const isExpanded = expandedId === snapshot.id;

                    return (
                        <li
                            key={snapshot.id}
                            style={{
                                marginBottom: '0.5rem',
                                cursor: 'pointer',
                                position: 'relative'
                            }}
                            onClick={() => setExpandedId(isExpanded ? null : snapshot.id)}
                        >
                            {/* Dot floating in front of text */}
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
                                <svg
                                    width="200"
                                    height="200"
                                    viewBox="0 0 200 200"
                                    style={{
                                        marginTop: '0.4rem',
                                        border: '1px solid var(--vscode-editorWidget-border)',
                                        backgroundColor: 'white'
                                    }}
                                >
                                    <g dangerouslySetInnerHTML={{ __html: snapshot.svg }} />
                                </svg>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

