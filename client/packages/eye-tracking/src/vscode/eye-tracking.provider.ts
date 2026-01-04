/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { BIGReactWebview, getBundleUri, getUri, type BIGWebviewProviderContext } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { inject, injectable, postConstruct } from 'inversify';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { 
    TrackInteractionAction,
    StartTrackingSessionAction,
    StopTrackingSessionAction,
    ExportInteractionDataAction,
    OpenStandaloneEyeTrackingAction,
    InteractionTrackingStatusAction,
    InteractionEventType
} from '../common/index.js';
import { TYPES as EYE_TYPES } from './eye-tracking.types.js';
import type { InteractionTracker } from './interaction-tracker.service.js';

export const EyeTrackingViewId = Symbol('EyeTrackingViewId');

@injectable()
export class EyeTrackingProvider extends BIGReactWebview {
    @inject(EyeTrackingViewId)
    viewId: string;

    @inject(EYE_TYPES.InteractionTracker)
    protected readonly interactionTracker: InteractionTracker;

    protected override cssPath = ['eye-tracking', 'bundle.css'];
    protected override jsPath = ['eye-tracking', 'bundle.js'];
    
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

    // Override to add permissions in webview options
    override resolveWebviewView(
        webviewView: any,
        context: any,
        token: any
    ): void | Thenable<void> {
        this.webviewView = webviewView;
        const webview = webviewView.webview;

        this.providerContext = {
            webviewView,
            context,
            token
        };

        webview.options = {
            enableScripts: true,
            enableForms: true,
            localResourceRoots: [this.extensionContext.extensionUri]
        };

        this.resolveHTML(this.providerContext);
        this.initConnection(this.providerContext);
    }

    protected override resolveHTML(providerContext: BIGWebviewProviderContext): void {
        const webview = providerContext.webviewView.webview;
        const extensionUri = this.extensionContext.extensionUri;

        const codiconsCSSUri = getUri(webview, extensionUri, ['webviews', 'assets', 'codicon.css']);
        const cssUri = getBundleUri(webview, extensionUri, this.cssPath);
        const jsUri = getBundleUri(webview, extensionUri, this.jsPath);

        webview.html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Security-Policy" 
                content="default-src ${webview.cspSource} 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: blob:;">
            <link id="codicon-css" href="${codiconsCSSUri}" rel="stylesheet" type="text/css" />
            <link id="bundle-css" href="${cssUri}" rel="stylesheet" type="text/css" />
            <title>Interaction Tracking</title>
        </head>
        <body>
            <div id="root"></div>
            <script type="module" src="${jsUri}"></script>
        </body>
        </html>`;
    }

    protected override handleConnection(): void {
        super.handleConnection();

        this.toDispose.push(
            this.webviewConnector.onReady(() => {
                // Send initial status to establish clientId in webview
                this.webviewConnector.dispatch(InteractionTrackingStatusAction.create({
                    isSessionActive: this.interactionTracker.isSessionActive(),
                    message: 'Interaction tracking ready'
                }));
            }),
            
            this.webviewConnector.onActionMessage(message => {
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
                }
            })
        );
    }

    private ensureDirectoryExists(): void {
        fs.access(this.tempDir, fs.constants.F_OK, (err) => {
            if (err) {
                fs.mkdir(this.tempDir, { recursive: true }, (mkdirErr) => {
                    if (mkdirErr) {
                        return console.error("Failed to create directory:", mkdirErr);
                    }
                    console.log('Interaction tracking directory created successfully!');
                });
            } else {
                console.log("Interaction tracking directory already exists.");
            }
        });
    }

    // Interaction tracking handlers
    private handleStartTrackingSession(action: StartTrackingSessionAction): void {
        this.interactionTracker.startSession(action.sessionId);
        
        // Track that the panel was opened
        this.interactionTracker.trackEvent(
            InteractionEventType.EYE_TRACKING_START,
            { component: 'interaction-tracking-panel' }
        );
        
        vscode.window.showInformationMessage('Interaction tracking session started');
    }

    private handleStopTrackingSession(): void {
        this.interactionTracker.stopSession();
        vscode.window.showInformationMessage('Interaction tracking session stopped and data exported');
    }

    private handleExportInteractionData(): void {
        if (this.interactionTracker.isSessionActive()) {
            // Export current state without stopping
            const events = this.interactionTracker.getEvents();
            const session = this.interactionTracker.getCurrentSession();
            
            vscode.window.showInformationMessage(
                `Current session: ${session?.sessionId}, Events: ${events.length}`
            );
        } else {
            vscode.window.showWarningMessage('No active tracking session');
        }
    }

    private handleTrackInteraction(action: TrackInteractionAction): void {
        // Forward interaction events from webview to tracker
        this.interactionTracker.trackEvent(action.event.type, action.event.data);
    }

    private handleOpenStandaloneEyeTracking(): void {
        // Path to the standalone eye tracking demo
        // In development, it's in the packages source folder
        // extensionPath is: client/application/vscode
        // standalone is at: client/packages/eye-tracking/standalone
        const standaloneHtmlPath = path.join(
            this.extensionContext.extensionPath,
            '..',
            '..',
            'packages',
            'eye-tracking',
            'standalone',
            'standalone_eye_tracking_demo.html'
        );
        
        // Check if file exists first
        if (!fs.existsSync(standaloneHtmlPath)) {
            vscode.window.showErrorMessage(`Eye tracking demo not found at: ${standaloneHtmlPath}`);
            return;
        }
        
        // Open in default browser using vscode.env.openExternal
        const fileUri = vscode.Uri.file(standaloneHtmlPath);
        vscode.env.openExternal(fileUri).then(
            () => {
                vscode.window.showInformationMessage('Opening standalone eye tracking demo in browser...');
            },
            (error) => {
                vscode.window.showErrorMessage(`Failed to open eye tracking demo: ${error}`);
            }
        );
    }
}
