/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { inject, injectable, postConstruct } from 'inversify';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { TYPES } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { InteractionEventType } from '../common/interaction-tracking.types.js';
import { ViewportTrackingAction } from '../common/interaction-tracking.action.js';
import type { 
    InteractionEvent, 
    SessionData 
} from '../common/interaction-tracking.types.js';

@injectable()
export class InteractionTracker {
    private events: InteractionEvent[] = [];
    private currentSession?: SessionData;
    private isTracking = false;
    private logDir: string;
    private disposables: vscode.Disposable[] = [];
    
    // Viewport debouncing
    private lastViewportEvent: { timestamp: number; data: any } | null = null;
    private viewportDebounceTimeout: NodeJS.Timeout | null = null;
    private readonly VIEWPORT_DEBOUNCE_MS = 100; // Debounce viewport events to max 10 per second

    // Inject ActionListener to track GLSP actions
    @inject(TYPES.ActionListener)
    protected readonly actionListener?: any; // Use any to avoid circular dependency

    @postConstruct()
    protected init(): void {
        // Set up log directory
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        this.logDir = workspaceFolder
            ? path.join(workspaceFolder.uri.fsPath, 'interaction-logs')
            : path.join(process.cwd(), 'interaction-logs');
        
        this.ensureLogDirectoryExists();
    }

    public startSession(sessionId?: string): void {
        if (this.isTracking) {
            console.log('Session already active');
            return;
        }

        this.currentSession = {
            sessionId: sessionId || this.generateSessionId(),
            startTime: Date.now(),
            user: process.env.USER || process.env.USERNAME || 'unknown',
            workspace: vscode.workspace.workspaceFolders?.[0]?.name || 'unknown'
        };

        this.events = [];
        this.isTracking = true;

        // Track session start
        this.trackEvent(InteractionEventType.SESSION_START, this.currentSession);

        // Set up all tracking listeners
        this.setupTracking();

        vscode.window.showInformationMessage(
            `Interaction tracking started: ${this.currentSession.sessionId}`
        );
    }

    public stopSession(): void {
        if (!this.isTracking || !this.currentSession) {
            console.log('No active session');
            return;
        }

        // Flush any pending viewport event
        if (this.viewportDebounceTimeout) {
            clearTimeout(this.viewportDebounceTimeout);
            if (this.lastViewportEvent) {
                this.trackEvent(InteractionEventType.VIEWPORT_CHANGE, this.lastViewportEvent.data);
                this.lastViewportEvent = null;
            }
            this.viewportDebounceTimeout = null;
        }

        // Track session end
        this.currentSession.endTime = Date.now();
        this.currentSession.totalEvents = this.events.length;
        this.trackEvent(InteractionEventType.SESSION_END, this.currentSession);

        // Clean up listeners
        this.disposeTracking();

        // Export data
        this.exportSession();

        this.isTracking = false;
        vscode.window.showInformationMessage(
            `Interaction tracking stopped. Events: ${this.events.length}`
        );
    }

    public trackEvent(type: InteractionEventType, data: any): void {
        if (!this.isTracking || !this.currentSession) {
            return;
        }

        const event: InteractionEvent = {
            timestamp: Date.now(),
            type,
            data,
            sessionId: this.currentSession.sessionId
        };

        this.events.push(event);

        // Auto-save every 100 events
        if (this.events.length % 100 === 0) {
            this.autoSave();
        }
    }

    /**
     * Track viewport changes with debouncing to prevent flooding
     * Only records the final viewport state after user stops panning/zooming
     */
    private trackViewportEvent(data: any): void {
        if (!this.isTracking || !this.currentSession) {
            return;
        }

        // Clear any pending debounce timeout
        if (this.viewportDebounceTimeout) {
            clearTimeout(this.viewportDebounceTimeout);
        }

        // Store the latest viewport data
        this.lastViewportEvent = {
            timestamp: Date.now(),
            data
        };

        // Set a debounce timeout to record the event
        this.viewportDebounceTimeout = setTimeout(() => {
            if (this.lastViewportEvent) {
                this.trackEvent(InteractionEventType.VIEWPORT_CHANGE, this.lastViewportEvent.data);
                console.log('Viewport change recorded (debounced):', this.lastViewportEvent.data);
                this.lastViewportEvent = null;
            }
            this.viewportDebounceTimeout = null;
        }, this.VIEWPORT_DEBOUNCE_MS);
    }

    private setupTracking(): void {
        // Track text document changes
        this.disposables.push(
            vscode.workspace.onDidChangeTextDocument(e => {
                if (e.document.uri.scheme === 'file') {
                    this.trackEvent(InteractionEventType.TEXT_EDIT, {
                        filePath: e.document.uri.fsPath,
                        fileName: path.basename(e.document.uri.fsPath),
                        language: e.document.languageId,
                        changes: e.contentChanges.map(c => ({
                            range: {
                                start: { line: c.range.start.line, character: c.range.start.character },
                                end: { line: c.range.end.line, character: c.range.end.character }
                            },
                            text: c.text.substring(0, 100) // Limit text length
                        }))
                    });
                }
            })
        );

        // Track file open
        this.disposables.push(
            vscode.workspace.onDidOpenTextDocument(e => {
                if (e.uri.scheme === 'file') {
                    this.trackEvent(InteractionEventType.FILE_OPEN, {
                        filePath: e.uri.fsPath,
                        fileName: path.basename(e.uri.fsPath),
                        language: e.languageId
                    });
                }
            })
        );

        // Track file close
        this.disposables.push(
            vscode.workspace.onDidCloseTextDocument(e => {
                if (e.uri.scheme === 'file') {
                    this.trackEvent(InteractionEventType.FILE_CLOSE, {
                        filePath: e.uri.fsPath,
                        fileName: path.basename(e.uri.fsPath)
                    });
                }
            })
        );

        // Track file save
        this.disposables.push(
            vscode.workspace.onDidSaveTextDocument(e => {
                if (e.uri.scheme === 'file') {
                    this.trackEvent(InteractionEventType.FILE_SAVE, {
                        filePath: e.uri.fsPath,
                        fileName: path.basename(e.uri.fsPath)
                    });
                }
            })
        );

        // Track text editor selection changes
        this.disposables.push(
            vscode.window.onDidChangeTextEditorSelection(e => {
                this.trackEvent(InteractionEventType.ELEMENT_SELECT, {
                    filePath: e.textEditor.document.uri.fsPath,
                    selections: e.selections.map(s => ({
                        start: { line: s.start.line, character: s.start.character },
                        end: { line: s.end.line, character: s.end.character },
                        active: { line: s.active.line, character: s.active.character }
                    }))
                });
            })
        );

        // Track active editor changes
        this.disposables.push(
            vscode.window.onDidChangeActiveTextEditor(e => {
                if (e?.document.uri.scheme === 'file') {
                    this.trackEvent(InteractionEventType.FILE_OPEN, {
                        filePath: e.document.uri.fsPath,
                        fileName: path.basename(e.document.uri.fsPath),
                        language: e.document.languageId,
                        viewColumn: e.viewColumn
                    });
                }
            })
        );

        // Track visible editors change (viewport)
        this.disposables.push(
            vscode.window.onDidChangeVisibleTextEditors(editors => {
                this.trackEvent(InteractionEventType.VIEWPORT_CHANGE, {
                    visibleEditors: editors.map(e => ({
                        filePath: e.document.uri.fsPath,
                        fileName: path.basename(e.document.uri.fsPath),
                        viewColumn: e.viewColumn
                    }))
                });
            })
        );

        // Track GLSP actions (diagram interactions)
        if (this.actionListener) {
            // Listen to CLIENT actions (from diagram webview)
            const glspClientDisposable = this.actionListener.registerListener((message: any) => {
                console.log('ActionListener received CLIENT action:', message.action?.kind);
                this.processGLSPAction(message.action);
            });
            this.disposables.push(glspClientDisposable);

            // Listen to SERVER responses (including property updates)
            const glspServerDisposable = (this.actionListener as any).registerServerListener?.((message: any) => {
                console.log('ActionListener received SERVER action:', message.action?.kind);
                this.processGLSPAction(message.action);
            });
            if (glspServerDisposable) {
                this.disposables.push(glspServerDisposable);
            }
            
            // Also listen to actions being SENT to the server (client-to-server)
            // This catches property palette actions that go directly to the server
            const glspSendDisposable = (this.actionListener as any).registerSendListener?.((message: any) => {
                console.log('ActionListener SEND to server:', message.action?.kind);
                this.processGLSPAction(message.action);
            });
            if (glspSendDisposable) {
                this.disposables.push(glspSendDisposable);
            }
        }

        // Also listen for updateElementProperty actions that bypass the ActionListener
        // These actions come from the property palette and go directly to the server
        if (this.actionListener && (this.actionListener as any).onAction) {
            const actionDisposable = (this.actionListener as any).onAction((action: any) => {
                if (action && action.kind === 'updateElementProperty') {
                    console.log('Captured updateElementProperty via onAction:', action);
                    this.processGLSPAction(action);
                }
            });
            if (actionDisposable) {
                this.disposables.push(actionDisposable);
            }
        }

        console.log('Interaction tracking listeners set up');
    }

    private processGLSPAction(action: any): void {
        if (!action || !action.kind) {
            console.log('processGLSPAction called with invalid action:', action);
            return;
        }
        
        console.log('Processing GLSP action:', action.kind, action);

        // Track different GLSP action types
        if (action.kind === 'createNode') {
            this.trackEvent(InteractionEventType.ELEMENT_CREATE, {
                kind: action.kind,
                elementTypeId: action.elementTypeId,
                containerId: '$ROOT', // Use placeholder instead of actual ID
                location: action.location
            });
        } else if (action.kind === 'createEdge') {
            this.trackEvent(InteractionEventType.ELEMENT_CREATE, {
                kind: action.kind,
                elementTypeId: action.elementTypeId,
                sourceElementId: action.sourceElementId,
                targetElementId: action.targetElementId
            });
        } else if (action.kind === 'deleteElement') {
            this.trackEvent(InteractionEventType.ELEMENT_DELETE, {
                kind: action.kind,
                elementIds: action.elementIds
            });
        } else if (action.kind === 'changeBounds') {
            this.trackEvent(InteractionEventType.ELEMENT_MOVE, {
                kind: action.kind,
                newBounds: action.newBounds
            });
        } else if (action.kind === 'elementSelected') {
            this.trackEvent(InteractionEventType.ELEMENT_SELECT, {
                kind: action.kind,
                selectedElementsIDs: action.selectedElementsIDs,
                deselectedElementsIDs: action.deselectedElementsIDs
            });
        } else if (action.kind === 'applyLabelEdit') {
            // This captures direct label editing (renaming on the diagram)!
            this.trackEvent(InteractionEventType.PROPERTY_CHANGE, {
                kind: action.kind,
                labelId: action.labelId,
                text: action.text
            });
        } else if (action.kind === 'updateElementProperty') {
            // This captures property changes from the property palette
            this.trackEvent(InteractionEventType.PROPERTY_CHANGE, {
                kind: action.kind,
                elementId: action.elementId,
                propertyId: action.propertyId,
                value: action.value
            });
        } else if (action.kind === 'setViewport') {
            // SetViewportAction - contains newViewport with scroll and zoom
            const viewport = action.newViewport || action.viewport;
            this.trackViewportEvent({
                kind: action.kind,
                scroll: viewport?.scroll,
                zoom: viewport?.zoom,
                elementId: action.elementId,
                animate: action.animate
            });
        } else if (action.kind === 'center') {
            // Center action - centers on specific elements
            this.trackViewportEvent({
                kind: action.kind,
                elementIds: action.elementIds,
                animate: action.animate,
                retainZoom: action.retainZoom
            });
        } else if (action.kind === 'fit') {
            // Fit to screen action
            this.trackViewportEvent({
                kind: action.kind,
                elementIds: action.elementIds,
                padding: action.padding,
                maxZoom: action.maxZoom,
                animate: action.animate
            });
        } else if (action.kind === 'viewport' || action.kind === 'setViewportAction') {
            // Generic viewport action - try multiple property locations
            const viewport = action.newViewport || action.viewport;
            const scroll = viewport?.scroll || action.scroll || { x: action.scrollX, y: action.scrollY };
            const zoom = viewport?.zoom ?? action.zoom ?? action.zoomLevel;
            
            // Only track if we have actual viewport data
            if (scroll?.x !== undefined || scroll?.y !== undefined || zoom !== undefined) {
                this.trackViewportEvent({
                    kind: action.kind,
                    scroll: scroll,
                    zoom: zoom
                });
            } else {
                // Log the full action to debug what properties are available
                console.log('Viewport action without coordinates, full action:', JSON.stringify(action));
            }
        } else if (action.kind === 'updateModel' && action.newRoot) {
            // UpdateModel might contain viewport changes in the canvas bounds
            // Skip - this is handled elsewhere
        } else if (action.kind === 'setModel' || action.kind === 'requestModel') {
            // Model actions - skip
        } else if (action.kind === 'setDirtyState' || action.kind === 'setEditMode') {
            // State actions - skip
        } else if (action.kind === 'viewportTracking' || ViewportTrackingAction.is(action)) {
            // ViewportTrackingAction from GLSP client with actual viewport data
            this.trackViewportEvent({
                kind: 'setViewport',
                scroll: action.scroll,
                zoom: action.zoom,
                canvasBounds: action.canvasBounds
            });
        } else if (action.kind === 'compound') {
            // Compound operations contain multiple actions
            this.trackEvent(InteractionEventType.ELEMENT_EDIT, {
                kind: action.kind,
                operationCount: action.operations?.length || 0
            });
        }
    }

    private disposeTracking(): void {
        this.disposables.forEach(d => d.dispose());
        this.disposables = [];
    }

    private autoSave(): void {
        if (!this.currentSession) return;

        const tempFilePath = path.join(
            this.logDir,
            `${this.currentSession.sessionId}_temp.json`
        );

        fs.writeFile(tempFilePath, JSON.stringify(this.events, null, 2), 'utf-8', err => {
            if (err) {
                console.error('Failed to auto-save interaction data:', err);
            } else {
                console.log(`Auto-saved ${this.events.length} events`);
            }
        });
    }

    private exportSession(): void {
        if (!this.currentSession) return;

        const sessionId = this.currentSession.sessionId;

        // Export as JSON
        const jsonFilePath = path.join(this.logDir, `${sessionId}.json`);
        fs.writeFile(jsonFilePath, JSON.stringify({
            session: this.currentSession,
            events: this.events
        }, null, 2), 'utf-8', err => {
            if (err) {
                console.error('Failed to export JSON:', err);
                vscode.window.showErrorMessage('Failed to export interaction data');
            } else {
                console.log('Interaction data exported:', jsonFilePath);
            }
        });

        // Export as CSV
        const csvFilePath = path.join(this.logDir, `${sessionId}.csv`);
        const csvContent = this.convertToCSV();
        fs.writeFile(csvFilePath, csvContent, 'utf-8', err => {
            if (err) {
                console.error('Failed to export CSV:', err);
            } else {
                console.log('CSV exported:', csvFilePath);
                vscode.window.showInformationMessage(`Interaction data saved: ${sessionId}`);
            }
        });

        // Clean up temp file
        const tempFilePath = path.join(this.logDir, `${sessionId}_temp.json`);
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
    }

    private convertToCSV(): string {
        const header = 'timestamp,type,sessionId,data\n';
        const rows = this.events.map(event => {
            const dataStr = JSON.stringify(event.data).replace(/"/g, '""');
            return `${event.timestamp},${event.type},${event.sessionId},"${dataStr}"`;
        });
        return header + rows.join('\n');
    }

    private generateSessionId(): string {
        const date = new Date();
        const timestamp = date.toISOString().replace(/[:.]/g, '-');
        return `interaction_${timestamp}`;
    }

    private ensureLogDirectoryExists(): void {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
            console.log('Created interaction logs directory:', this.logDir);
        }
    }

    public getEvents(): InteractionEvent[] {
        return [...this.events];
    }

    public getCurrentSession(): SessionData | undefined {
        return this.currentSession;
    }

    public isSessionActive(): boolean {
        return this.isTracking;
    }

    public dispose(): void {
        if (this.isTracking) {
            this.stopSession();
        }
        this.disposeTracking();
    }

    /**
     * Public method to manually track an action
     * This can be called from anywhere in the codebase when an action is detected
     */
    public trackAction(action: any): void {
        if (!this.isTracking) {
            return;
        }
        console.log('Manual tracking of action:', action.kind, action);
        this.processGLSPAction(action);
    }
}
