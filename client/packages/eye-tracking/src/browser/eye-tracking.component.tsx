/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { VSCodeContext } from '@borkdominik-biguml/big-components';
import { useCallback, useContext, useEffect, useRef, useState, type ReactElement } from 'react';
import webgazer from 'webgazer';
import {
    EyeTrackingDataAction,
    EyeTrackingStatusAction,
    StartEyeTrackingAction,
    StopEyeTrackingAction,
    StartTrackingSessionAction,
    StopTrackingSessionAction,
    ExportInteractionDataAction
} from '../common/index.js';

export function EyeTracking(): ReactElement {
    const { listenAction, dispatchAction, clientId } = useContext(VSCodeContext);
    const [isActive, setIsActive] = useState(false);
    const [isWebGazerLoaded, setIsWebGazerLoaded] = useState(true);
    const [isCalibrating, setIsCalibrating] = useState(false);
    const [isTrackingSession, setIsTrackingSession] = useState(false);
    const [gazeData, setGazeData] = useState<Array<{x: number, y: number, timestamp: number}>>([]);
    const [statusMessage, setStatusMessage] = useState<string>('WebGazer ready');
    
    const gazeDataRef = useRef<Array<{x: number, y: number, timestamp: number}>>([]);

    useEffect(() => {
        listenAction(action => {
            if (EyeTrackingStatusAction.is(action)) {
                setIsActive(action.isActive);
                setIsWebGazerLoaded(action.isWebGazerLoaded);
                if (action.message) {
                    setStatusMessage(action.message);
                }
            }
        });
    }, [listenAction]);

    const startEyeTracking = useCallback(async () => {
        if (!clientId) {
            setStatusMessage('Client not ready, please wait...');
            return;
        }

        try {
            setStatusMessage('Starting eye tracking...');
            // Add this diagnostic code
            console.log('Is in iframe:', window.self !== window.top);
            //setStatusMessage('Requesting camera permission...');
            //const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            //stream.getTracks().forEach(track => track.stop());
            
            await webgazer
                .setRegression('ridge')
                .setTracker('TFFacemesh')
                .setGazeListener((data: any) => {
                    //if (data && data.x !== undefined && data.y !== undefined)
                    if (data && typeof data.x === 'number' && typeof data.y === 'number') {
                        const gazePoint = {
                            x: data.x,
                            y: data.y,
                            timestamp: Date.now()
                        };
                        
                        gazeDataRef.current.push(gazePoint);
                        
                        // Limit data points to prevent memory issues
                        if (gazeDataRef.current.length > 10000) {
                            gazeDataRef.current.shift();
                        }
                        
                        // Update state periodically
                        if (gazeDataRef.current.length % 50 === 0) {
                            setGazeData([...gazeDataRef.current]);
                            // Send data to extension
                            dispatchAction(EyeTrackingDataAction.create([...gazeDataRef.current]));
                        }
                    }
                })
                .begin();

            // Configure WebGazer for better accuracy
            webgazer.params
                .showVideo(false)
                .showPredictions(true)
                .showFaceOverlay(false)
                .showFaceFeedbackBox(false);

            setIsActive(true);
            setStatusMessage('Eye tracking started');
            dispatchAction(StartEyeTrackingAction.create());
            
        } catch (error) {
            setStatusMessage(`Failed to start WebGazer: ${error}`);
        }
    }, [clientId, dispatchAction]);

    const stopEyeTracking = useCallback(async () => {
        if (!clientId) return;
        
        try {
            await webgazer.end();
            setIsActive(false);
            setIsCalibrating(false);
            setStatusMessage('Eye tracking stopped');
            
            // Send final data to extension
            if (gazeDataRef.current.length > 0) {
                dispatchAction(EyeTrackingDataAction.create([...gazeDataRef.current]));
            }
            
            dispatchAction(StopEyeTrackingAction.create());
        } catch (error) {
            setStatusMessage(`Error stopping WebGazer: ${error}`);
        }
    }, [dispatchAction, clientId]);

    const startCalibration = useCallback(() => {
        if (!isActive) {
            setStatusMessage('Start eye tracking first');
            return;
        }

        setIsCalibrating(true);
        setStatusMessage('Calibration started - look at the red dots and click them');
        webgazer.clearData();
    }, [isActive]);

    const calibratePoint = useCallback((index: number) => {
        const cols = 3;
        const x = (index % cols) * (window.innerWidth / (cols + 1)) + (window.innerWidth / (cols + 1));
        const y = Math.floor(index / cols) * (window.innerHeight / (cols + 1)) + (window.innerHeight / (cols + 1));
        
        webgazer.recordScreenPosition(x, y, 'click');
        setStatusMessage(`Calibrated point ${index + 1}/9`);
    }, []);

    const endCalibration = useCallback(() => {
        setIsCalibrating(false);
        setStatusMessage('Calibration completed');
    }, []);

    const clearData = useCallback(() => {
        gazeDataRef.current = [];
        setGazeData([]);
        webgazer.clearData();
        setStatusMessage('Data cleared');
    }, []);

    const exportData = useCallback(() => {
        if (gazeDataRef.current.length === 0) {
            setStatusMessage('No data to export');
            return;
        }

        dispatchAction(EyeTrackingDataAction.create([...gazeDataRef.current]));
        setStatusMessage(`Exported ${gazeDataRef.current.length} gaze points`);
    }, [dispatchAction]);

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

    return (
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Status Section */}
            <div style={{ 
                padding: '12px', 
                border: '1px solid var(--vscode-editorWidget-border)', 
                borderRadius: '4px',
                backgroundColor: 'var(--vscode-editor-background)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold' }}>Status:</span>
                    <span style={{ 
                        padding: '2px 8px', 
                        borderRadius: '12px', 
                        fontSize: '12px', 
                        fontWeight: 'bold',
                        backgroundColor: isActive ? 'var(--vscode-testing-iconPassed)' : 'var(--vscode-testing-iconFailed)',
                        color: 'white'
                    }}>
                        {isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--vscode-descriptionForeground)' }}>
                    WebGazer: {isWebGazerLoaded ? 'Ready (npm package)' : 'Loading...'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--vscode-descriptionForeground)' }}>
                    Client: {clientId ? 'Connected' : 'Connecting...'}
                </div>
                {statusMessage && (
                    <div style={{ fontSize: '12px', marginTop: '4px', fontStyle: 'italic' }}>
                        {statusMessage}
                    </div>
                )}
            </div>

            {/* Control Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button 
                    onClick={isActive ? stopEyeTracking : startEyeTracking}
                    disabled={!clientId}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: isActive ? 'var(--vscode-button-secondaryBackground)' : 'var(--vscode-button-background)',
                        color: 'var(--vscode-button-foreground)',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: clientId ? 'pointer' : 'not-allowed',
                        opacity: !clientId ? 0.6 : 1
                    }}
                >
                    {isActive ? 'Stop Eye Tracking' : 'Start Eye Tracking'}
                </button>
                
                <button 
                    onClick={startCalibration}
                    disabled={!isActive}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: 'var(--vscode-button-secondaryBackground)',
                        color: 'var(--vscode-button-foreground)',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isActive ? 'pointer' : 'not-allowed',
                        opacity: !isActive ? 0.6 : 1
                    }}
                >
                    Calibrate
                </button>
                
                <button 
                    onClick={clearData}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: 'var(--vscode-button-secondaryBackground)',
                        color: 'var(--vscode-button-foreground)',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Clear Data
                </button>
                
                <button 
                    onClick={exportData}
                    disabled={gazeData.length === 0}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: 'var(--vscode-button-secondaryBackground)',
                        color: 'var(--vscode-button-foreground)',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: gazeData.length > 0 ? 'pointer' : 'not-allowed',
                        opacity: gazeData.length === 0 ? 0.6 : 1
                    }}
                >
                    Export Data
                </button>
            </div>

            {/* Interaction Tracking Section */}
            <div style={{ 
                padding: '12px', 
                border: '2px solid var(--vscode-charts-blue)', 
                borderRadius: '4px',
                backgroundColor: 'var(--vscode-editor-background)'
            }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: 'var(--vscode-charts-blue)' }}>
                    🎯 Interaction Tracking
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
                        disabled={!clientId}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: isTrackingSession 
                                ? 'var(--vscode-button-secondaryBackground)' 
                                : 'var(--vscode-button-background)',
                            color: 'var(--vscode-button-foreground)',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: clientId ? 'pointer' : 'not-allowed',
                            opacity: !clientId ? 0.6 : 1
                        }}
                    >
                        {isTrackingSession ? '⏹ Stop Session' : '▶ Start Session'}
                    </button>
                    <button 
                        onClick={exportInteractionData}
                        disabled={!isTrackingSession}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: 'var(--vscode-button-secondaryBackground)',
                            color: 'var(--vscode-button-foreground)',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: isTrackingSession ? 'pointer' : 'not-allowed',
                            opacity: !isTrackingSession ? 0.6 : 1
                        }}
                    >
                        📊 View Stats
                    </button>
                </div>
                <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--vscode-descriptionForeground)' }}>
                    💡 <strong>Tip:</strong> Start a session before using the diagram editor to capture all interactions.
                    <br />
                    Data is automatically saved to: <code>workspace/interaction-logs/</code>
                </div>
            </div>

            {/* Calibration Grid */}
            {isCalibrating && (
                <div style={{ 
                    padding: '12px', 
                    border: '2px solid var(--vscode-focusBorder)', 
                    borderRadius: '4px',
                    backgroundColor: 'var(--vscode-editor-background)'
                }}>
                    <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}>
                        Look at the red dots and click on them to calibrate:
                    </p>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(3, 1fr)', 
                        gap: '8px', 
                        height: '120px',
                        margin: '12px 0'
                    }}>
                        {[0,1,2,3,4,5,6,7,8].map(i => (
                            <div 
                                key={i}
                                onClick={() => calibratePoint(i)}
                                style={{
                                    backgroundColor: 'red',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    minHeight: '16px',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            />
                        ))}
                    </div>
                    <button 
                        onClick={endCalibration}
                        style={{
                            padding: '6px 12px',
                            backgroundColor: 'var(--vscode-button-background)',
                            color: 'var(--vscode-button-foreground)',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Finish Calibration
                    </button>
                </div>
            )}

            {/* Data Display */}
            <div style={{ 
                padding: '12px', 
                border: '1px solid var(--vscode-editorWidget-border)', 
                borderRadius: '4px',
                backgroundColor: 'var(--vscode-editor-background)'
            }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
                    Gaze Points Collected: <strong>{gazeData.length}</strong>
                </p>
                {gazeData.length > 0 && (
                    <div style={{ fontSize: '12px', color: 'var(--vscode-descriptionForeground)' }}>
                        Latest: x={gazeData[gazeData.length - 1]?.x.toFixed(0)}, 
                        y={gazeData[gazeData.length - 1]?.y.toFixed(0)}
                    </div>
                )}
            </div>
        </div>
    );
}
