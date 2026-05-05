/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { ActionWebviewMessenger, WebviewMessenger, WebviewViewProviderOptions } from '@borkdominik-biguml/big-vscode/vscode';
import { TYPES, WebviewViewProvider } from '@borkdominik-biguml/big-vscode/vscode';
import { DisposableCollection } from '@eclipse-glsp/vscode-integration';
import * as fs from 'fs';
import { inject, injectable, postConstruct } from 'inversify';
import * as path from 'path';
import type { Disposable } from 'vscode';
import * as vscode from 'vscode';
import {
    ExportInteractionDataAction,
    InteractionEventType,
    InteractionTrackingStatusAction,
    OpenStandaloneEyeTrackingAction,
    StartTrackingSessionAction,
    StopTrackingSessionAction,
    TrackInteractionAction,
    UploadSessionToServerAction
} from '../common/index.js';
import { TYPES as EYE_TYPES } from './eye-tracking.types.js';
import type { InteractionTracker } from './interaction-tracker.service.js';

@injectable()
export class EyeTrackingProvider extends WebviewViewProvider {
    @inject(EYE_TYPES.InteractionTracker)
    protected readonly interactionTracker: InteractionTracker;

    private logFolderName = Date.now().toString();
    private tempDir: string;

    constructor(@inject(TYPES.WebviewViewOptions) options: WebviewViewProviderOptions) {
        super({
            viewId: options.viewType,
            viewType: options.viewType,
            htmlOptions: {
                files: {
                    js: [['eye-tracking', 'bundle.js']],
                    css: [['eye-tracking', 'bundle.css']]
                }
            }
        });
    }

    @postConstruct()
    protected init(): void {
        this.tempDir = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
            ? path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, 'logs', this.logFolderName)
            : path.join(process.cwd(), 'logs', this.logFolderName);

        this.ensureDirectoryExists();
    }

    protected override resolveWebviewProtocol(messenger: WebviewMessenger): Disposable {
        const disposables = new DisposableCollection();
        disposables.push(super.resolveWebviewProtocol(messenger));
        return disposables;
    }

    protected override resolveActionProtocol(_messenger: ActionWebviewMessenger): Disposable {
        const disposables = new DisposableCollection();
        disposables.push(
            this.actionMessenger.onActionMessage(message => {
                if (StartTrackingSessionAction.is(message.action)) {
                    this.handleStartTrackingSession(message.action);
                } else if (StopTrackingSessionAction.is(message.action)) {
                    this.handleStopTrackingSession();
                } else if (ExportInteractionDataAction.is(message.action)) {
                    this.handleExportInteractionData();
                } else if (TrackInteractionAction.is(message.action)) {
                    this.handleTrackInteraction(message.action);
                } else if (OpenStandaloneEyeTrackingAction.is(message.action)) {
                    this.handleOpenStandaloneEyeTracking();
                } else if (UploadSessionToServerAction.is(message.action)) {
                    this.handleUploadSessionToServer();
                }
            })
        );
        return disposables;
    }

    protected override handleOnReady(): void {
        this.actionMessenger.dispatch(
            InteractionTrackingStatusAction.create({
                isSessionActive: this.interactionTracker.isSessionActive(),
                message: 'Interaction tracking ready'
            })
        );
    }

    private ensureDirectoryExists(): void {
        fs.access(this.tempDir, fs.constants.F_OK, err => {
            if (err) {
                fs.mkdir(this.tempDir, { recursive: true }, mkdirErr => {
                    if (mkdirErr) {
                        return console.error('Failed to create directory:', mkdirErr);
                    }
                    console.log('Interaction tracking directory created successfully!');
                });
            } else {
                console.log('Interaction tracking directory already exists.');
            }
        });
    }

    private handleStartTrackingSession(action: StartTrackingSessionAction): void {
        this.interactionTracker.startSession(action.sessionId);
        this.interactionTracker.trackEvent(InteractionEventType.EYE_TRACKING_START, { component: 'interaction-tracking-panel' });
        vscode.window.showInformationMessage('Interaction tracking session started');
    }

    private handleStopTrackingSession(): void {
        this.interactionTracker.stopSession();
        vscode.window.showInformationMessage('Interaction tracking session stopped and data exported');
    }

    private handleExportInteractionData(): void {
        if (this.interactionTracker.isSessionActive()) {
            const events = this.interactionTracker.getEvents();
            const session = this.interactionTracker.getCurrentSession();
            vscode.window.showInformationMessage(`Current session: ${session?.sessionId}, Events: ${events.length}`);
        } else {
            vscode.window.showWarningMessage('No active tracking session');
        }
    }

    private handleTrackInteraction(action: TrackInteractionAction): void {
        this.interactionTracker.trackEvent(action.event.type, action.event.data);
    }

    private handleOpenStandaloneEyeTracking(): void {
        const standaloneHtmlPath = path.join(
            this.extensionContext.extensionPath,
            '..',
            '..',
            'packages',
            'eye-tracking',
            'standalone',
            'standalone_eye_tracking_demo.html'
        );

        if (!fs.existsSync(standaloneHtmlPath)) {
            vscode.window.showErrorMessage(`Eye tracking demo not found at: ${standaloneHtmlPath}`);
            return;
        }

        const fileUri = vscode.Uri.file(standaloneHtmlPath);
        vscode.env.openExternal(fileUri).then(
            () => {
                vscode.window.showInformationMessage('Opening standalone eye tracking demo in browser...');
            },
            error => {
                vscode.window.showErrorMessage(`Failed to open eye tracking demo: ${error}`);
            }
        );
    }

    private async handleUploadSessionToServer(): Promise<void> {
        // Get the default interaction-logs folder
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        const defaultUri = workspaceFolder ? vscode.Uri.file(path.join(workspaceFolder.uri.fsPath, 'interaction-logs')) : undefined;

        // Open file dialog to select JSON file
        const fileUris = await vscode.window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            defaultUri: defaultUri,
            filters: {
                'JSON Files': ['json'],
                'All Files': ['*']
            },
            title: 'Select Session JSON File to Upload'
        });

        if (!fileUris || fileUris.length === 0) {
            return; // User cancelled
        }

        const selectedFile = fileUris[0];

        try {
            // Read the file content
            const fileContent = fs.readFileSync(selectedFile.fsPath, 'utf-8');
            const sessionData = JSON.parse(fileContent);

            // Validate the file has the expected structure
            if (!sessionData.session || !sessionData.events) {
                vscode.window.showErrorMessage('Invalid session file format. Expected { session: {...}, events: [...] }');
                return;
            }

            // Send to the API
            const serverUrl = vscode.workspace.getConfiguration('bigUML').get<string>('monitoringServerUrl') || 'http://localhost:8000';

            vscode.window.withProgress(
                {
                    location: vscode.ProgressLocation.Notification,
                    title: 'Uploading session to server...',
                    cancellable: false
                },
                async _progress => {
                    try {
                        const response = await fetch(`${serverUrl}/sessions`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: fileContent
                        });

                        if (response.ok) {
                            const result = (await response.json()) as { events_stored: number; session_id: string };
                            vscode.window.showInformationMessage(
                                `✅ Session uploaded successfully! ${result.events_stored} events stored.`
                            );

                            this.actionMessenger.dispatch(
                                InteractionTrackingStatusAction.create({
                                    isSessionActive: this.interactionTracker.isSessionActive(),
                                    message: `Session uploaded: ${result.session_id}`
                                })
                            );
                        } else if (response.status === 409) {
                            vscode.window.showWarningMessage('Session already exists on the server.');
                        } else {
                            const errorData = (await response.json().catch(() => ({}))) as { detail?: string };
                            vscode.window.showErrorMessage(
                                `Failed to upload session: ${response.status} - ${errorData.detail || response.statusText}`
                            );
                        }
                    } catch (fetchError: any) {
                        vscode.window.showErrorMessage(`Failed to connect to server at ${serverUrl}: ${fetchError.message}`);
                    }
                }
            );
        } catch (error: any) {
            vscode.window.showErrorMessage(`Failed to read or parse file: ${error.message}`);
        }
    }
}
