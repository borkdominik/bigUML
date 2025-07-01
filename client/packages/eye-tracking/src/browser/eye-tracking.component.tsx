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
    StartEyeTrackingAction, 
    StopEyeTrackingAction, 
    EyeTrackingStatusAction, 
    EyeTrackingDataAction 
} from '../common/index.js';

export function EyeTracking(): ReactElement {
    const { listenAction, dispatchAction, clientId } = useContext(VSCodeContext);
    const [isActive, setIsActive] = useState(false);
    const [isWebGazerLoaded, setIsWebGazerLoaded] = useState(true);
    const [isCalibrating, setIsCalibrating] = useState(false);
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
