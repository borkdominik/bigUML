/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { VSCodeContext } from '@borkdominik-biguml/big-components';
import { useCallback, useContext, useEffect, useState, type ReactElement } from 'react';
import {
    StartTrackingSessionAction,
    StopTrackingSessionAction,
    ExportInteractionDataAction,
    OpenStandaloneEyeTrackingAction,
    InteractionTrackingStatusAction,
    UploadSessionToServerAction
} from '../common/index.js';

export function EyeTracking(): ReactElement {
    const { listenAction, dispatchAction, clientId } = useContext(VSCodeContext);
    const [isTrackingSession, setIsTrackingSession] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string>('Connecting...');
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Listen for status updates from the extension
        listenAction(action => {
            if (InteractionTrackingStatusAction.is(action)) {
                setIsReady(true);
                setIsTrackingSession(action.isSessionActive);
                if (action.message) {
                    setStatusMessage(action.message);
                }
            }
        });
    }, [listenAction]);

    // Interaction tracking functions
    const startTrackingSession = useCallback(() => {
        if (!clientId) {
            setStatusMessage('Client not ready, please wait...');
            return;
        }

        dispatchAction(StartTrackingSessionAction.create());
        setIsTrackingSession(true);
        setStatusMessage('Interaction tracking session started');
    }, [clientId, dispatchAction]);

    const stopTrackingSession = useCallback(() => {
        if (!clientId) return;

        dispatchAction(StopTrackingSessionAction.create());
        setIsTrackingSession(false);
        setStatusMessage('Interaction tracking session stopped');
    }, [clientId, dispatchAction]);

    const exportInteractionData = useCallback(() => {
        if (!clientId) return;

        dispatchAction(ExportInteractionDataAction.create());
        setStatusMessage('Interaction data export requested');
    }, [clientId, dispatchAction]);

    const openStandaloneEyeTracking = useCallback(() => {
        if (!clientId) {
            setStatusMessage('Client not ready, please wait...');
            return;
        }

        dispatchAction(OpenStandaloneEyeTrackingAction.create());
        setStatusMessage('Opening standalone eye tracking demo...');
    }, [clientId, dispatchAction]);

    const uploadSessionToServer = useCallback(() => {
        if (!clientId) {
            setStatusMessage('Client not ready, please wait...');
            return;
        }

        dispatchAction(UploadSessionToServerAction.create());
        setStatusMessage('Opening file selector...');
    }, [clientId, dispatchAction]);

    const isConnected = isReady && !!clientId;

    return (
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Interaction Tracking Section */}
            <div style={{ 
                padding: '12px', 
                border: '2px solid var(--vscode-charts-blue)', 
                borderRadius: '4px',
                backgroundColor: 'var(--vscode-editor-background)'
            }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: 'var(--vscode-charts-blue)' }}>
                    Interaction Tracking
                </h3>
                <div style={{ fontSize: '13px', color: 'var(--vscode-descriptionForeground)', marginBottom: '12px' }}>
                    Track all VS Code interactions (file edits, selections, clicks) for UX research.
                    <br />
                    <strong>Status:</strong> 
                    <span style={{ 
                        marginLeft: '8px',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '11px',
                        backgroundColor: isTrackingSession ? 'var(--vscode-testing-iconPassed)' : 'var(--vscode-testing-iconFailed)',
                        color: 'white'
                    }}>
                        {isTrackingSession ? 'Recording' : 'Inactive'}
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button 
                        onClick={isTrackingSession ? stopTrackingSession : startTrackingSession}
                        disabled={!isConnected}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: isTrackingSession 
                                ? 'var(--vscode-button-secondaryBackground)' 
                                : 'var(--vscode-button-background)',
                            color: 'var(--vscode-button-foreground)',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: isConnected ? 'pointer' : 'not-allowed',
                            opacity: !isConnected ? 0.6 : 1
                        }}
                    >
                        {isTrackingSession ? '⏹ Stop Session' : '▶ Start Session'}
                    </button>
                    <button 
                        onClick={exportInteractionData}
                        disabled={!isConnected || !isTrackingSession}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: 'var(--vscode-button-secondaryBackground)',
                            color: 'var(--vscode-button-foreground)',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: isConnected && isTrackingSession ? 'pointer' : 'not-allowed',
                            opacity: (!isConnected || !isTrackingSession) ? 0.6 : 1
                        }}
                    >
                        View Stats
                    </button>
                    <button 
                        onClick={openStandaloneEyeTracking}
                        disabled={!isConnected}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: 'var(--vscode-button-secondaryBackground)',
                            color: 'var(--vscode-button-foreground)',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: isConnected ? 'pointer' : 'not-allowed',
                            opacity: !isConnected ? 0.6 : 1
                        }}
                    >
                        Eye Tracking
                    </button>
                    <button 
                        onClick={uploadSessionToServer}
                        disabled={!isConnected}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: 'var(--vscode-button-secondaryBackground)',
                            color: 'var(--vscode-button-foreground)',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: isConnected ? 'pointer' : 'not-allowed',
                            opacity: !isConnected ? 0.6 : 1
                        }}
                    >
                        Upload to Server
                    </button>
                </div>
                <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--vscode-descriptionForeground)' }}>
                    💡 <strong>Tip:</strong> Open & set up eye-tracking in a standalone browser before starting the Interaction-Tracking
                    session to capture gaze points aswell.
                    <br />
                    Data is automatically saved to: <code>workspace/interaction-logs/</code>
                    <br />
                    Gaze points need to manually be exported via the standalone browser.
                </div>
            </div>

            {/* Status Message */}
            {statusMessage && (
                <div style={{ 
                    padding: '8px 12px', 
                    fontSize: '12px', 
                    fontStyle: 'italic',
                    color: 'var(--vscode-descriptionForeground)',
                    backgroundColor: 'var(--vscode-editor-background)',
                    borderRadius: '4px',
                    border: '1px solid var(--vscode-editorWidget-border)'
                }}>
                    {statusMessage}
                </div>
            )}
        </div>
    );
}
