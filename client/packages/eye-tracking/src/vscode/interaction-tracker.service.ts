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
import { exec } from 'child_process';
import { TYPES } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { InteractionEventType } from '../common/interaction-tracking.types.js';
import { 
    ViewportTrackingAction, 
    ElementBoundsTrackingAction,
    MouseClickTrackingAction,
    MousePositionTrackingAction
} from '../common/interaction-tracking.action.js';
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

    // Mouse position tracking - stores the last known mouse position with all coordinate types
    private lastMousePosition: { 
        canvasX: number; 
        canvasY: number; 
        screenX: number;
        screenY: number;
        elementId?: string; 
        timestamp: number 
    } | null = null;

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

        // Detect diagram type and file path from active editor
        const editorType = this.detectDiagramType();
        const modelFilePath = this.getActiveUmlFilePath();
        const modelFile = modelFilePath ? path.basename(modelFilePath) : undefined;

        // Get tool version from package.json (hardcoded for now)
        const toolVersion = '0.6.3';

        this.currentSession = {
            sessionId: sessionId || this.generateSessionId(editorType),
            startTime: Date.now(),
            
            // New generic GLSP fields
            toolId: 'bigUML',
            toolVersion: toolVersion,
            editorType: editorType,
            modelFile: modelFile,
            modelFilePath: modelFilePath || undefined,
            
            // User Info TODO check if we should probably hash this
            user: process.env.USER || process.env.USERNAME || 'unknown',
            workspace: vscode.workspace.workspaceFolders?.[0]?.name || 'unknown',
            
            // Legacy fields (for backward compatibility)
            umlFile: modelFile,
            umlFilePath: modelFilePath || undefined,
            diagramType: editorType
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

        // Capture screenshot before exporting
        const sessionId = this.currentSession.sessionId;
        this.captureScreenshot(sessionId).then(screenshotPath => {
            if (screenshotPath) {
                console.log('Screenshot saved:', screenshotPath);
            }
            
            // Export data after screenshot attempt
            this.exportSession();
            
            this.isTracking = false;
            vscode.window.showInformationMessage(
                `Interaction tracking stopped. Events: ${this.events.length}${screenshotPath ? ' (screenshot saved)' : ''}`
            );
        }).catch(err => {
            console.error('Screenshot capture failed:', err);
            // Still export data even if screenshot fails
            this.exportSession();
            
            this.isTracking = false;
            vscode.window.showInformationMessage(
                `Interaction tracking stopped. Events: ${this.events.length}`
            );
        });
    }

    /**
     * Capture a screenshot of the entire screen and save it as PNG
     * Uses PowerShell on Windows to capture the screen
     * @param sessionId The session ID to use for the filename
     * @returns Promise with the screenshot file path, or null if capture failed
     */
    private async captureScreenshot(sessionId: string): Promise<string | null> {
        const screenshotPath = path.join(this.logDir, `${sessionId}_screenshot.png`);
        
        // Check platform
        if (process.platform === 'win32') {
            return this.captureScreenshotWindows(screenshotPath);
        } else if (process.platform === 'darwin') {
            return this.captureScreenshotMac(screenshotPath);
        } else if (process.platform === 'linux') {
            return this.captureScreenshotLinux(screenshotPath);
        } else {
            console.warn('Screenshot capture not supported on this platform:', process.platform);
            return null;
        }
    }

    /**
     * Capture screenshot on Windows using PowerShell
     */
    private captureScreenshotWindows(outputPath: string): Promise<string | null> {
        return new Promise((resolve) => {
            // Create a temporary PowerShell script file to avoid escaping issues
            const tempScriptPath = path.join(this.logDir, '_screenshot_temp.ps1');
            
            // PowerShell script to capture primary screen only
            const psScript = `
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$screen = [System.Windows.Forms.Screen]::PrimaryScreen
$bounds = $screen.Bounds

$bitmap = New-Object System.Drawing.Bitmap($bounds.Width, $bounds.Height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.CopyFromScreen($bounds.X, $bounds.Y, 0, 0, $bitmap.Size)
$bitmap.Save('${outputPath}')
$graphics.Dispose()
$bitmap.Dispose()
`;
            
            try {
                // Write the script to a temp file
                fs.writeFileSync(tempScriptPath, psScript, 'utf-8');
                
                // Execute the script file
                exec(`powershell -ExecutionPolicy Bypass -File "${tempScriptPath}"`, 
                    { timeout: 15000 },
                    (error, _stdout, stderr) => {
                        // Clean up temp script
                        try {
                            if (fs.existsSync(tempScriptPath)) {
                                fs.unlinkSync(tempScriptPath);
                            }
                        } catch (cleanupErr) {
                            console.warn('Failed to clean up temp script:', cleanupErr);
                        }
                        
                        if (error) {
                            console.error('PowerShell screenshot error:', error.message);
                            if (stderr) {
                                console.error('PowerShell stderr:', stderr);
                            }
                            resolve(null);
                        } else {
                            // Verify the file was created
                            if (fs.existsSync(outputPath)) {
                                resolve(outputPath);
                            } else {
                                console.error('Screenshot file was not created');
                                resolve(null);
                            }
                        }
                    }
                );
            } catch (err) {
                console.error('Failed to create temp script:', err);
                resolve(null);
            }
        });
    }

    /**
     * Capture screenshot on macOS using screencapture
     * Uses -m flag to capture only the main display
     */
    private captureScreenshotMac(outputPath: string): Promise<string | null> {
        return new Promise((resolve) => {
            // -m captures main monitor only, -x suppresses sound
            exec(`screencapture -m -x "${outputPath}"`, 
                { timeout: 10000 },
                (error) => {
                    if (error) {
                        console.error('macOS screenshot error:', error.message);
                        resolve(null);
                    } else if (fs.existsSync(outputPath)) {
                        resolve(outputPath);
                    } else {
                        resolve(null);
                    }
                }
            );
        });
    }

    /**
     * Capture screenshot on Linux using various tools
     * Attempts to capture only the primary monitor
     */
    private captureScreenshotLinux(outputPath: string): Promise<string | null> {
        return new Promise((resolve) => {
            // First, try to get primary monitor geometry using xrandr
            exec('xrandr --query | grep " connected primary" | grep -oP "\\d+x\\d+\\+\\d+\\+\\d+"', 
                { timeout: 5000 },
                (error, stdout) => {
                    if (!error && stdout.trim()) {
                        // Parse geometry: WIDTHxHEIGHT+X+Y
                        const geometry = stdout.trim();
                        // Use ImageMagick import with geometry
                        exec(`import -window root -crop ${geometry} +repage "${outputPath}"`,
                            { timeout: 10000 },
                            (importError) => {
                                if (!importError && fs.existsSync(outputPath)) {
                                    resolve(outputPath);
                                } else {
                                    // Fallback to other methods
                                    this.captureScreenshotLinuxFallback(outputPath, resolve);
                                }
                            }
                        );
                    } else {
                        // Fallback to other methods
                        this.captureScreenshotLinuxFallback(outputPath, resolve);
                    }
                }
            );
        });
    }

    /**
     * Fallback screenshot methods for Linux
     */
    private captureScreenshotLinuxFallback(
        outputPath: string, 
        resolve: (value: string | null) => void
    ): void {
        // Try gnome-screenshot (captures current screen), then scrot, then full import
        const commands = [
            `gnome-screenshot -f "${outputPath}"`,
            `scrot -m "${outputPath}"`,  // -m captures focused monitor
            `import -window root "${outputPath}"`
        ];
        
        const tryCommand = (index: number): void => {
            if (index >= commands.length) {
                console.error('No screenshot tool available on Linux');
                resolve(null);
                return;
            }
            
            exec(commands[index], { timeout: 10000 }, (error) => {
                if (error) {
                    tryCommand(index + 1);
                } else if (fs.existsSync(outputPath)) {
                    resolve(outputPath);
                } else {
                    tryCommand(index + 1);
                }
            });
        };
        
        tryCommand(0);
    }

    public trackEvent(type: InteractionEventType, data: any): void {
        if (!this.isTracking || !this.currentSession) {
            return;
        }

        // Include last known mouse position with the event data (if available and recent)
        // This associates a mouse position with every tracked action
        const eventData = this.enrichWithMousePosition(data);

        const event: InteractionEvent = {
            timestamp: Date.now(),
            type,
            data: eventData,
            sessionId: this.currentSession.sessionId
        };

        this.events.push(event);

        // Auto-save every 100 events
        if (this.events.length % 100 === 0) {
            this.autoSave();
        }
    }

    /**
     * Enriches event data with the last known mouse position if it's recent enough
     * Mouse position is considered stale after 2 seconds
     */
    private enrichWithMousePosition(data: any): any {
        // Don't add mouse position to mouse events (they already have coordinates)
        // or to session start/end events
        if (data?.screenX !== undefined && data?.screenY !== undefined) {
            return data;
        }

        // Check if we have a recent mouse position (within last 2 seconds)
        const MOUSE_POSITION_STALENESS_MS = 2000;
        if (this.lastMousePosition) {
            const age = Date.now() - this.lastMousePosition.timestamp;
            if (age < MOUSE_POSITION_STALENESS_MS) {
                return {
                    ...data,
                    mousePosition: {
                        canvasX: this.lastMousePosition.canvasX,
                        canvasY: this.lastMousePosition.canvasY,
                        screenX: this.lastMousePosition.screenX,
                        screenY: this.lastMousePosition.screenY,
                        elementId: this.lastMousePosition.elementId
                    }
                };
            }
        }

        return data;
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
                this.processGLSPAction(message.action);
            });
            this.disposables.push(glspClientDisposable);

            // Listen to SERVER responses (including property updates)
            const glspServerDisposable = (this.actionListener as any).registerServerListener?.((message: any) => {
                this.processGLSPAction(message.action);
            });
            if (glspServerDisposable) {
                this.disposables.push(glspServerDisposable);
            }
            
            // Also listen to actions being SENT to the server (client-to-server)
            // This catches property palette actions that go directly to the server
            const glspSendDisposable = (this.actionListener as any).registerSendListener?.((message: any) => {
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
                    this.processGLSPAction(action);
                }
            });
            if (actionDisposable) {
                this.disposables.push(actionDisposable);
            }
        }
    }

    private processGLSPAction(action: any): void {
        if (!action || !action.kind) {
            return;
        }

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
        } else if (action.kind === 'changeBounds' || action.kind === 'changeBoundsOperation') {
            this.trackEvent(InteractionEventType.ELEMENT_MOVE, {
                kind: 'changeBounds',
                newBounds: action.newBounds
            });
        } else if (action.kind === 'moveElement' || action.kind === 'moveElements') {
            this.trackEvent(InteractionEventType.ELEMENT_MOVE, {
                kind: action.kind,
                elementIds: action.elementIds || [action.elementId],
                newPosition: action.newPosition || action.targetPosition,
                delta: action.delta
            });
        } else if (action.kind === 'setBounds') {
            this.trackEvent(InteractionEventType.ELEMENT_MOVE, {
                kind: action.kind,
                elementId: action.elementId,
                newBounds: action.newBounds || { position: action.position, size: action.size }
            });
        } else if (action.kind === 'elementSelected') {
            this.trackEvent(InteractionEventType.ELEMENT_SELECT, {
                kind: action.kind,
                selectedElementsIDs: action.selectedElementsIDs,
                deselectedElementsIDs: action.deselectedElementsIDs
            });
        } else if (action.kind === 'applyLabelEdit') {
            // This captures direct label editing (renaming on the diagram!!)
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
        } else if (action.kind === 'elementBoundsTracking' || ElementBoundsTrackingAction.is(action)) {
            // ElementBoundsTrackingAction from GLSP client - captures nested element moves
            this.trackEvent(InteractionEventType.ELEMENT_MOVE, {
                kind: 'changeBounds',
                newBounds: action.newBounds,
                source: 'glsp-client' // Mark that this came from the GLSP client handler
            });
        } else if (action.kind === 'mouseClickTracking' || MouseClickTrackingAction.is(action)) {
            // MouseClickTrackingAction from GLSP client - captures mouse clicks on diagram
            this.trackEvent(InteractionEventType.MOUSE_CLICK, {
                canvasX: action.canvasX,
                canvasY: action.canvasY,
                screenX: action.screenX,
                screenY: action.screenY,
                clientX: action.clientX,
                clientY: action.clientY,
                button: action.button,
                elementId: action.elementId,
                elementType: action.elementType,
                isDoubleClick: action.isDoubleClick,
                modifiers: action.modifiers,
                canvasBounds: action.canvasBounds
            });
        } else if (action.kind === 'mousePositionTracking' || MousePositionTrackingAction.is(action)) {
            // MousePositionTrackingAction from GLSP client - update last known mouse position
            // Store the position but don't create an event (to avoid flooding)
            this.lastMousePosition = {
                canvasX: action.canvasX,
                canvasY: action.canvasY,
                screenX: action.screenX,
                screenY: action.screenY,
                elementId: action.elementId,
                timestamp: Date.now()
            };
        } else if (action.kind === 'compound') {
            // Compound operations contain multiple actions (uses operationList property)
            const operations = action.operations || action.operationList || action.actions || [];
            if (operations && Array.isArray(operations) && operations.length > 0) {
                for (const op of operations) {
                    this.processGLSPAction(op);
                }
            }
            this.trackEvent(InteractionEventType.ELEMENT_EDIT, {
                kind: action.kind,
                operationCount: operations?.length || 0
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

        // Convert session timestamps to ISO format
        const sessionWithIsoTimestamps = {
            ...this.currentSession,
            startTime: new Date(this.currentSession.startTime).toISOString(),
            endTime: this.currentSession.endTime ? new Date(this.currentSession.endTime).toISOString() : undefined
        };

        // Convert events to use ISO timestamps for export
        const eventsWithIsoTimestamps = this.events.map(event => {
            const eventCopy = {
                ...event,
                timestamp: new Date(event.timestamp).toISOString()
            };
            
            // Also convert timestamps inside session_start and session_end data
            if (event.type === InteractionEventType.SESSION_START || event.type === InteractionEventType.SESSION_END) {
                eventCopy.data = {
                    ...event.data,
                    startTime: event.data.startTime ? new Date(event.data.startTime).toISOString() : undefined,
                    endTime: event.data.endTime ? new Date(event.data.endTime).toISOString() : undefined
                };
            }
            
            return eventCopy;
        });

        // Export as JSON
        const jsonFilePath = path.join(this.logDir, `${sessionId}.json`);
        fs.writeFile(jsonFilePath, JSON.stringify({
            session: sessionWithIsoTimestamps,
            events: eventsWithIsoTimestamps
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
            // Convert Unix timestamp to ISO format with milliseconds
            const isoTimestamp = new Date(event.timestamp).toISOString();
            
            // For session events, convert timestamps in data too
            let data = event.data;
            if (event.type === InteractionEventType.SESSION_START || event.type === InteractionEventType.SESSION_END) {
                data = {
                    ...event.data,
                    startTime: event.data.startTime ? new Date(event.data.startTime).toISOString() : undefined,
                    endTime: event.data.endTime ? new Date(event.data.endTime).toISOString() : undefined
                };
            }
            
            const dataStr = JSON.stringify(data).replace(/"/g, '""');
            return `${isoTimestamp},${event.type},${event.sessionId},"${dataStr}"`;
        });
        return header + rows.join('\n');
    }

    private generateSessionId(diagramType: string): string {
        const date = new Date();
        // Format: YYYY-MM-DDTHH-MM-SS.mmmZ (ISO with dashes instead of colons for filesystem compatibility)
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
        const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
        
        const timestamp = `${year}-${month}-${day}T${hours}-${minutes}-${seconds}.${milliseconds}Z`;
        return `${diagramType}_${timestamp}`;
    }

    /**
     * Detect the diagram type from the active editor's file
     */
    private detectDiagramType(): string {
        // 1: Check active text editor (for text-based files)
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            const fileName = activeEditor.document.fileName;
            const match = fileName.match(/\.(activity|class|communication|deployment|information_flow|package|state_machine|use_case|sequence)\.uml$/i);
            if (match) {
                return match[1].toLowerCase();
            }
        }
        
        // 2: Check active tab for custom editors (like UML diagrams)
        const activeTab = vscode.window.tabGroups.activeTabGroup?.activeTab;
        if (activeTab?.input) {
            const input = activeTab.input as any;
            
            // Try to get URI from various possible properties
            let uri: vscode.Uri | undefined;
            if (input.uri) {
                uri = input.uri;
            } else if (input.viewType && input.resource) {
                uri = input.resource;
            }
            
            if (uri) {
                const fileName = uri.fsPath || uri.path || '';
                
                // First check filename pattern
                const filenameMatch = fileName.match(/\.(activity|class|communication|deployment|information_flow|package|state_machine|use_case|sequence)\.uml$/i);
                if (filenameMatch) {
                    return filenameMatch[1].toLowerCase();
                }
                
                // If filename doesn't have diagram type, try to read the notation file
                if (fileName.endsWith('.uml')) {
                    const detectedType = this.detectDiagramTypeFromFile(fileName);
                    if (detectedType) {
                        return detectedType;
                    }
                }
            }
            
            // Try to extract from tab label
            const tabLabel = activeTab.label;
            if (tabLabel) {
                const match = tabLabel.match(/\.(activity|class|communication|deployment|information_flow|package|state_machine|use_case|sequence)\.uml$/i);
                if (match) {
                    return match[1].toLowerCase();
                }
            }
        }
        
        // 3: Check all visible tabs
        for (const tabGroup of vscode.window.tabGroups.all) {
            for (const tab of tabGroup.tabs) {
                if (tab.isActive) {
                    const tabLabel = tab.label;
                    if (tabLabel) {
                        const match = tabLabel.match(/\.(activity|class|communication|deployment|information_flow|package|state_machine|use_case|sequence)\.uml$/i);
                        if (match) {
                            return match[1].toLowerCase();
                        }
                    }
                }
            }
        }
        
        // Default fallback
        return 'unknown';
    }

    /**
     * Get the UML file path from the active editor
     */
    private getActiveUmlFilePath(): string | null {
        const activeTab = vscode.window.tabGroups.activeTabGroup?.activeTab;
        if (activeTab?.input) {
            const input = activeTab.input as any;
            if (input.uri) {
                return input.uri.fsPath || input.uri.path || null;
            }
        }
        return null;
    }

    /**
     * Detect diagram type by reading the UML notation file - this was kind of stupid, because when we start tracking, the file is empty
     * kept because it may be usefull in the future
     */
    private detectDiagramTypeFromFile(filePath: string): string | null {
        try {
            // Read the .unotation file (companion file with diagram type)
            const notationFilePath = filePath.replace(/\.uml$/, '.unotation');
            
            if (fs.existsSync(notationFilePath)) {
                const notationContent = fs.readFileSync(notationFilePath, 'utf-8');
                
                // Look for diagramType attribute
                const diagramTypeMatch = notationContent.match(/diagramType="(\w+)"/i);
                if (diagramTypeMatch) {
                    const type = diagramTypeMatch[1].toLowerCase();
                    return this.normalizeDiagramType(type);
                }
            }
            
            // Fallback: Try to read the UML file content
            const content = fs.readFileSync(filePath, 'utf-8');
            
            // Check for UML element types that indicate diagram type
            if (content.includes('uml:Activity') || content.includes('Activity"')) {
                return 'activity';
            }
            if (content.includes('uml:StateMachine') || content.includes('StateMachine"')) {
                return 'state_machine';
            }
            if (content.includes('uml:Interaction') && content.includes('uml:Lifeline')) {
                return 'communication';
            }
            if (content.includes('uml:UseCase') || content.includes('uml:Actor')) {
                return 'use_case';
            }
            if (content.includes('uml:Node') || content.includes('uml:Device') || content.includes('uml:ExecutionEnvironment')) {
                return 'deployment';
            }
            if (content.includes('uml:InformationFlow')) {
                return 'information_flow';
            }
            if (content.includes('uml:Package') && !content.includes('uml:Class')) {
                return 'package';
            }
            if (content.includes('uml:Class') || content.includes('uml:Interface') || content.includes('uml:Enumeration')) {
                return 'class';
            }
            
            return null;
        } catch (error) {
            console.error('[DiagramType] Error reading file:', error);
            return null;
        }
    }

    /**
     * Normalize diagram type to consistent snake_case format
     */
    private normalizeDiagramType(type: string): string {
        const typeMap: { [key: string]: string } = {
            'class': 'class',
            'activity': 'activity',
            'communication': 'communication',
            'deployment': 'deployment',
            'informationflow': 'information_flow',
            'information_flow': 'information_flow',
            'package': 'package',
            'statemachine': 'state_machine',
            'state_machine': 'state_machine',
            'usecase': 'use_case',
            'use_case': 'use_case',
            'sequence': 'sequence'
        };
        
        const normalized = typeMap[type.toLowerCase()];
        return normalized || type.toLowerCase();
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
     */
    public trackAction(action: any): void {
        if (!this.isTracking) {
            return;
        }
        this.processGLSPAction(action);
    }
}
