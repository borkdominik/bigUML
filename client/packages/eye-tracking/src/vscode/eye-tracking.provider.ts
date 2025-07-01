/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { BIGReactWebview } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { inject, injectable, postConstruct } from 'inversify';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { 
    StartEyeTrackingAction, 
    StopEyeTrackingAction, 
    EyeTrackingStatusAction, 
    EyeTrackingDataAction 
} from '../common/eye-tracking.action.js';

export const EyeTrackingViewId = Symbol('EyeTrackingViewId');

@injectable()
export class EyeTrackingProvider extends BIGReactWebview {
    @inject(EyeTrackingViewId)
    viewId: string;

    protected override cssPath = ['eye-tracking', 'bundle.css'];
    protected override jsPath = ['eye-tracking', 'bundle.js'];
    
    private eyeTrackingData: Array<{x: number, y: number, timestamp: number}> = [];
    private isActive = false;
    private logFolderName = Date.now().toString();
    private tempDir: string;

    @postConstruct()
    protected override init(): void {
        super.init();

        // Set up temp directory for data export
        this.tempDir = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath 
            ? path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, 'logs', this.logFolderName)
            : path.join(process.cwd(), 'logs', this.logFolderName);
            
        this.ensureDirectoryExists();
    }

    protected override handleConnection(): void {
        super.handleConnection();

        this.toDispose.push(
            this.webviewConnector.onReady(() => {
                // Send initial status
                this.webviewConnector.dispatch(EyeTrackingStatusAction.create({
                    isActive: this.isActive,
                    isWebGazerLoaded: false,
                    message: 'Eye tracking ready'
                }));
            }),
            
            this.webviewConnector.onActionMessage(message => {
                if (StartEyeTrackingAction.is(message.action)) {
                    this.handleStartEyeTracking();
                } else if (StopEyeTrackingAction.is(message.action)) {
                    this.handleStopEyeTracking();
                } else if (EyeTrackingDataAction.is(message.action)) {
                    this.handleEyeTrackingData(message.action);
                }
            })
        );
    }

    private handleStartEyeTracking(): void {
        this.isActive = true;
        this.eyeTrackingData = []; // Clear previous data
        vscode.window.showInformationMessage('Eye tracking started');
        
        this.webviewConnector.dispatch(EyeTrackingStatusAction.create({
            isActive: true,
            isWebGazerLoaded: true,
            message: 'Eye tracking is now active'
        }));
    }

    private handleStopEyeTracking(): void {
        this.isActive = false;
        vscode.window.showInformationMessage('Eye tracking stopped');
        
        // Export data when stopping
        this.exportEyeTrackingData();
        
        this.webviewConnector.dispatch(EyeTrackingStatusAction.create({
            isActive: false,
            isWebGazerLoaded: true,
            message: 'Eye tracking stopped and data exported'
        }));
    }

    private handleEyeTrackingData(action: EyeTrackingDataAction): void {
        // Store the gaze points
        this.eyeTrackingData = action.gazePoints;
        
        // Log data periodically
        if (this.eyeTrackingData.length % 500 === 0) {
            console.log(`Eye tracking data points collected: ${this.eyeTrackingData.length}`);
        }
    }

    private exportEyeTrackingData(): void {
        if (this.eyeTrackingData.length === 0) {
            vscode.window.showWarningMessage('No eye tracking data to export');
            return;
        }

        const fileName = `eye_tracking_${Date.now()}.csv`;
        const filePath = path.join(this.tempDir, fileName);
        
        // Create CSV content
        const csvHeader = 'timestamp,x,y,relative_timestamp\n';
        const startTime = this.eyeTrackingData[0]?.timestamp || 0;
        
        const csvContent = csvHeader + this.eyeTrackingData.map(point => 
            `${point.timestamp},${point.x},${point.y},${point.timestamp - startTime}`
        ).join('\n');

        // Write to file
        fs.writeFile(filePath, csvContent, 'utf-8', (err) => {
            if (err) {
                console.error('Failed to write eye tracking CSV file:', err);
                vscode.window.showErrorMessage('Failed to export eye tracking data');
            } else {
                console.log('Eye tracking CSV file saved successfully:', filePath);
                vscode.window.showInformationMessage(`Eye tracking data saved: ${fileName}`);
            }
        });

        // Also export as JSON for detailed analysis
        const jsonFileName = `eye_tracking_${Date.now()}.json`;
        const jsonFilePath = path.join(this.tempDir, jsonFileName);
        
        const jsonContent = JSON.stringify({
            metadata: {
                exportTime: new Date().toISOString(),
                totalPoints: this.eyeTrackingData.length,
                duration: this.eyeTrackingData.length > 0 ? 
                    this.eyeTrackingData[this.eyeTrackingData.length - 1].timestamp - this.eyeTrackingData[0].timestamp : 0,
                startTime: startTime
            },
            gazePoints: this.eyeTrackingData
        }, null, 2);

        fs.writeFile(jsonFilePath, jsonContent, 'utf-8', (err) => {
            if (err) {
                console.error('Failed to write eye tracking JSON file:', err);
            } else {
                console.log('Eye tracking JSON file saved successfully:', jsonFilePath);
            }
        });
    }

    private ensureDirectoryExists(): void {
        fs.access(this.tempDir, fs.constants.F_OK, (err) => {
            if (err) {
                fs.mkdir(this.tempDir, { recursive: true }, (mkdirErr) => {
                    if (mkdirErr) {
                        return console.error("Failed to create directory:", mkdirErr);
                    }
                    console.log('Eye tracking directory created successfully!');
                });
            } else {
                console.log("Eye tracking directory already exists.");
            }
        });
    }
}
