/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { VSCodeContext } from '@borkdominik-biguml/big-components';
import {
    ApplyTransformationAction,
    ApplyTransformationResponse,
    RequestTransformationPreviewAction,
    TransformationPreviewResponse,
    type InferredClassPreview
} from '@borkdominik-biguml/big-object-to-class';
import { useCallback, useContext, useEffect, useState, type ReactElement } from 'react';

export function TransformationPreview(): ReactElement {
    const { listenAction, dispatchAction, clientId } = useContext(VSCodeContext);

    // 1. Create state for the text input
    const [mockInput, setMockInput] = useState<string>(
        JSON.stringify(
            {
                instances: [],
                links: []
            },
            null,
            2
        )
    );

    const [classes, setClasses] = useState<InferredClassPreview[]>([]);
    const [associations, setAssociations] = useState<any[]>([]);
    const [conflicts, setConflicts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | undefined>();
    const [merges, setMerges] = useState<Record<string, string>>({});
    const [schemaError, setSchemaError] = useState<string | undefined>();
    const [mergeTargets, setMergeTargets] = useState<Record<number, string>>({});

    const isReady = !!clientId;
    const schemaPreview = `{
  "instances": [],
  "links": []
}`;

    // 2. Listen for the backend results
    useEffect(() => {
        const disposable = listenAction(action => {
            // Debug: log incoming actions for preview troubleshooting
            console.debug('[Webview] received action', action);
            if (TransformationPreviewResponse.is(action)) {
                if (action.success) {
                    setClasses(action.classes);
                    setAssociations(action.associations);
                    setConflicts(action.conflicts);
                    setSchemaError(undefined);
                    setMessage(undefined);
                } else {
                    setClasses([]);
                    setAssociations([]);
                    setConflicts([]);
                    setSchemaError(action.message ?? 'Schema is invalid. Please follow the required format.');
                }
                setIsLoading(false);
            }
            if (ApplyTransformationResponse.is(action)) {
                setIsLoading(false);
                setMessage(action.success ? 'Successfully applied patches!' : 'Error applying patches.');
            }
        });
        return () => disposable.dispose();
    }, [listenAction]);

    // 3. Trigger Transformation
    const generatePreview = useCallback(() => {
        if (!isReady) {
            console.error('Cannot generate preview: Connection to Diagram not established.');
            return;
        }
        setIsLoading(true);
        setMessage(undefined);
        setSchemaError(undefined);
        // We might want to pass merges to the backend if the backend supports it
        try {
            dispatchAction(RequestTransformationPreviewAction.create({ mockData: mockInput }));
        } catch (error: any) {
            setIsLoading(false);
            setSchemaError(error?.message ?? 'Failed to send preview request.');
        }
    }, [dispatchAction, isReady, mockInput]);

    const apply = useCallback(() => {
        if (!isReady) return;
        setIsLoading(true);
        try {
            dispatchAction(ApplyTransformationAction.create({ mockData: mockInput }));
        } catch (error: any) {
            setIsLoading(false);
            setMessage(error?.message ?? 'Failed to apply transformation.');
        }
    }, [dispatchAction, isReady, mockInput]);

    const cancelPreview = useCallback(() => {
        setClasses([]);
        setAssociations([]);
        setConflicts([]);
        setMessage(undefined);
        setSchemaError(undefined);
        setIsLoading(false);
    }, []);

    const handleMerge = (names: string[], target: string) => {
        const newMerges = { ...merges };
        names.forEach(n => {
            if (n !== target) {
                newMerges[n] = target;
            }
        });
        setMerges(newMerges);

        // Update mock input to reflect the merge (simple replacement for now)
        let updatedInput = mockInput;
        names.forEach(n => {
            if (n !== target) {
                const regex = new RegExp(`"type":\\s*"${n}"`, 'g');
                updatedInput = updatedInput.replace(regex, `"type": "${target}"`);
            }
        });
        setMockInput(updatedInput);

        // Trigger preview refresh
        setIsLoading(true);
        dispatchAction(RequestTransformationPreviewAction.create({ mockData: updatedInput }));
    };

    return (
        <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
            {!isReady && (
                <div style={{ color: 'var(--vscode-errorForeground)', fontWeight: 'bold' }}>
                    ⚠️ Server Connection Offline. Please open a UML diagram.
                </div>
            )}

            <label style={{ fontWeight: 'bold' }}>Mock Input Data (JSON):</label>
            <textarea
                value={mockInput}
                onChange={e => setMockInput(e.target.value)}
                style={{
                    height: '150px',
                    fontFamily: 'monospace',
                    backgroundColor: 'var(--vscode-input-background)',
                    color: 'var(--vscode-input-foreground)',
                    border: '1px solid var(--vscode-input-border)',
                    padding: '5px',
                    fontSize: '11px'
                }}
            />

            <button
                onClick={generatePreview}
                disabled={isLoading}
                style={{
                    padding: '6px',
                    cursor: isLoading ? 'wait' : 'pointer',
                    backgroundColor: 'var(--vscode-button-background)',
                    color: 'var(--vscode-button-foreground)',
                    border: 'none'
                }}
            >
                {isLoading ? 'Processing...' : 'Generate Preview'}
            </button>

            <hr style={{ width: '100%', opacity: 0.3 }} />

            {schemaError && (
                <div style={{ color: 'var(--vscode-errorForeground)', marginBottom: '5px' }}>
                    <strong>Schema Error:</strong>
                    <div style={{ marginTop: '4px', fontSize: '11px' }}>{schemaError}</div>
                    <div style={{ marginTop: '6px', fontSize: '11px' }}>Expected format:</div>
                    <pre
                        style={{
                            marginTop: '4px',
                            padding: '6px',
                            backgroundColor: 'var(--vscode-editor-background)',
                            border: '1px solid var(--vscode-widget-border)',
                            whiteSpace: 'pre-wrap'
                        }}
                    >
                        {schemaPreview}
                    </pre>
                </div>
            )}

            {/* 1. Conflicts Section (Fixes TS6133: conflicts) */}
            {conflicts.length > 0 && (
                <div style={{ color: 'var(--vscode-warningForeground)', marginBottom: '5px' }}>
                    <strong>Potential Conflicts:</strong>
                    {conflicts.map((c, i) =>
                        (() => {
                            const defaultTarget = c.conflictingNames?.[0];
                            const selectedTarget = mergeTargets[i] ?? defaultTarget;
                            return (
                                <div
                                    key={i}
                                    style={{
                                        marginLeft: '10px',
                                        fontSize: '11px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '4px',
                                        marginTop: '4px',
                                        padding: '4px',
                                        borderLeft: '2px solid var(--vscode-warningForeground)'
                                    }}
                                >
                                    <div>• {c.message}</div>
                                    {c.kind === 'name_ambiguity' && c.conflictingNames && (
                                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                            <select
                                                value={selectedTarget}
                                                onChange={event => {
                                                    const next = event.target.value;
                                                    setMergeTargets(prev => ({ ...prev, [i]: next }));
                                                }}
                                                style={{
                                                    backgroundColor: 'var(--vscode-input-background)',
                                                    color: 'var(--vscode-input-foreground)',
                                                    border: '1px solid var(--vscode-input-border)',
                                                    padding: '2px 6px',
                                                    fontSize: '11px'
                                                }}
                                            >
                                                {c.conflictingNames.map((name: string) => (
                                                    <option key={name} value={name}>
                                                        {name}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={() => handleMerge(c.conflictingNames!, selectedTarget ?? c.conflictingNames[0])}
                                                style={{
                                                    fontSize: '11px',
                                                    padding: '4px 10px',
                                                    cursor: 'pointer',
                                                    backgroundColor: 'var(--vscode-button-background)',
                                                    color: 'var(--vscode-button-foreground)',
                                                    border: '1px solid var(--vscode-button-border)',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                Merge into "{selectedTarget ?? c.conflictingNames[0]}"
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })()
                    )}
                </div>
            )}

            {/* 2. Inferred Classes Section */}
            {classes.length > 0 && (
                <div>
                    <strong style={{ color: 'var(--vscode-symbolIcon-classForeground)' }}>Inferred Classes ({classes.length}):</strong>
                    {classes.map((c, i) => (
                        <div key={i} style={{ marginLeft: '10px', marginTop: '5px' }}>
                            • <strong>{c.name}</strong>
                            {c.properties &&
                                c.properties.map((p, pi) => (
                                    <div
                                        key={pi}
                                        style={{ marginLeft: '15px', fontSize: '11px', color: 'var(--vscode-descriptionForeground)' }}
                                    >
                                        {p.name}: {p.type}
                                        {p.isOptional ? '?' : ''}
                                    </div>
                                ))}
                        </div>
                    ))}
                </div>
            )}

            {/* 3. Inferred Associations Section (Fixes TS6133: associations) */}
            {associations.length > 0 && (
                <div style={{ marginTop: '5px' }}>
                    <strong style={{ color: 'var(--vscode-symbolIcon-interfaceForeground)' }}>
                        Inferred Associations ({associations.length}):
                    </strong>
                    {associations.map((a, i) => (
                        <div key={i} style={{ marginLeft: '10px', marginTop: '5px', fontSize: '11px' }}>
                            • {a.sourceTypeName} ({a.sourceMultiplicity}) ↔ {a.targetTypeName} ({a.targetMultiplicity})
                        </div>
                    ))}
                </div>
            )}

            {/* 4. Apply Action */}
            {(classes.length > 0 || associations.length > 0) && (
                <>
                    <button
                        onClick={apply}
                        disabled={isLoading}
                        style={{
                            marginTop: '10px',
                            backgroundColor: 'var(--vscode-button-background)',
                            color: 'var(--vscode-button-foreground)',
                            border: 'none',
                            padding: '8px',
                            fontWeight: 'bold',
                            cursor: isLoading ? 'wait' : 'pointer'
                        }}
                    >
                        Apply as JSON Patches
                    </button>
                    <button
                        onClick={cancelPreview}
                        disabled={isLoading}
                        style={{
                            backgroundColor: 'var(--vscode-button-secondaryBackground)',
                            color: 'var(--vscode-button-secondaryForeground)',
                            border: 'none',
                            padding: '8px',
                            fontWeight: 'bold',
                            cursor: isLoading ? 'wait' : 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                </>
            )}

            {/* 5. Status Messages */}
            {message && (
                <div
                    style={{
                        marginTop: '10px',
                        padding: '8px',
                        border: '1px solid var(--vscode-widget-border)',
                        backgroundColor: 'var(--vscode-editor-background)'
                    }}
                >
                    {message}
                </div>
            )}
        </div>
    );
}
