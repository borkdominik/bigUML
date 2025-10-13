/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { inject, injectable } from 'inversify';
import * as vscode from 'vscode';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import { TYPES } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { InteractionEventType } from '../common/interaction-tracking.types.js';
import type { InteractionEvent } from '../common/interaction-tracking.types.js';

export interface ReplayOptions {
    speed?: number; // Speed multiplier (1 = real-time, 2 = 2x speed, 0 = instant)
    startFromTimestamp?: number;
    endAtTimestamp?: number;
}

@injectable()
export class InteractionReplayService {
    @inject(TYPES.ActionDispatcher)
    protected readonly actionDispatcher: any;

    @inject(TYPES.ActionListener)
    protected readonly actionListener: any;

    private isReplaying = false;
    private replayAbortController?: AbortController;
    private idMapping: Map<string, string> = new Map(); // Maps old IDs to new IDs
    private pendingElementCreation: { resolve: (id: string) => void; elementType: string } | null = null;

    /**
     * Load and replay a session from a CSV file
     */
    public async replayFromFile(filePath: string, options: ReplayOptions = {}): Promise<void> {
        if (this.isReplaying) {
            vscode.window.showWarningMessage('A replay is already in progress');
            return;
        }

        let modelListener: any = null;

        try {
            this.isReplaying = true;
            this.replayAbortController = new AbortController();
            this.idMapping.clear(); // Clear ID mapping for new replay session

            // Set up model listener to capture new element IDs
            modelListener = this.setupModelListener();

            // Read and parse CSV file
            const csvContent = fs.readFileSync(filePath, 'utf-8');
            const events = this.parseCSV(csvContent);

            // Filter events by timestamp if specified
            const filteredEvents = this.filterEventsByTime(events, options);

            if (filteredEvents.length === 0) {
                vscode.window.showWarningMessage('No events found in the selected time range');
                return;
            }

            // Show replay progress
            await vscode.window.withProgress(
                {
                    location: vscode.ProgressLocation.Notification,
                    title: 'Replaying Interaction Session',
                    cancellable: true
                },
                async (progress, token) => {
                    token.onCancellationRequested(() => {
                        this.stopReplay();
                    });

                    await this.replayEvents(filteredEvents, options, progress);
                }
            );

            vscode.window.showInformationMessage('Replay completed successfully');
        } catch (error) {
            vscode.window.showErrorMessage(`Replay failed: ${error}`);
            console.error('Replay error:', error);
        } finally {
            this.isReplaying = false;
            this.replayAbortController = undefined;
            // Cleanup listener if it exists
            if (modelListener) {
                modelListener.dispose();
            }
        }
    }

    /**
     * Stop the current replay
     */
    public stopReplay(): void {
        if (this.replayAbortController) {
            this.replayAbortController.abort();
            this.isReplaying = false;
            vscode.window.showInformationMessage('Replay stopped');
        }
    }

    /**
     * Set up listener to capture newly created element IDs from server updates
     */
    private setupModelListener(): any {
        if (!this.actionListener) {
            console.warn('ActionListener not available for ID mapping');
            return null;
        }

        // Listen to server responses that contain model updates
        return this.actionListener.registerServerListener((message: any) => {
            const action = message?.action;
            if (!action) return;

            // Look for UpdateModel action which contains the new/updated elements
            if (action.kind === 'updateModel' && action.newRoot) {
                console.log('Received updateModel, extracting IDs...');
                this.extractNewElementIds(action.newRoot);
            }
        });
    }

    /**
     * Build a map of old element IDs from the recording by analyzing the event sequence
     * After creation, elements are typically selected or edited, revealing their IDs
     */
    private buildCreationIdMap(events: InteractionEvent[]): void {
        console.log('Building creation-to-ID map from event sequence...');
        
        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            
            // Find element_create events
            if (event.type === InteractionEventType.ELEMENT_CREATE && event.data.kind === 'createNode') {
                // Look ahead to find the next selection or property change for this element
                const oldId = this.findElementIdAfterCreation(events, i);
                if (oldId) {
                    // Store the old ID with index so we can map it during replay
                    (event.data as any)._oldElementId = oldId;
                    console.log(`Found old ID for creation at index ${i}: ${oldId}`);
                }
            }
        }
    }

    /**
     * Find the element ID by looking at events following a creation
     */
    private findElementIdAfterCreation(events: InteractionEvent[], creationIndex: number): string | null {
        // Look at the next few events
        for (let i = creationIndex + 1; i < Math.min(creationIndex + 5, events.length); i++) {
            const event = events[i];
            
            // Check selection events
            if (event.type === InteractionEventType.ELEMENT_SELECT) {
                const selectedIds = event.data.selectedElementsIDs;
                if (selectedIds && selectedIds.length > 0) {
                    return selectedIds[0]; // Return the first selected ID
                }
            }
            
            // Check property change events (label edits)
            if (event.type === InteractionEventType.PROPERTY_CHANGE) {
                if (event.data.kind === 'applyLabelEdit' && event.data.labelId) {
                    // Extract element ID from label ID (format: elementId_name_label)
                    const labelId = event.data.labelId;
                    const elementId = labelId.replace(/_name_label$/, ''); // Remove the suffix
                    if (elementId && elementId !== labelId) { // Make sure we actually removed something
                        return elementId;
                    }
                }
            }
        }
        
        return null;
    }

    /**
     * Extract newly created element IDs from model update
     */
    private extractNewElementIds(root: any): void {
        if (!root || !root.children) {
            console.log('No root or no children in updateModel');
            return;
        }

        // If we have a pending element creation, try to match it
        if (this.pendingElementCreation) {
            // Get all shape elements (nodes), not labels
            const allElements = this.getAllElements(root);
            console.log(`Total elements found: ${allElements.length}`);
            
            // Log all element types to see what we're actually getting
            allElements.forEach((el, idx) => {
                console.log(`  Element ${idx}: id=${el.id}, type=${el.type}`);
            });
            
            // Look for UML nodes - they use patterns like CLASS__Class, PACKAGE__Package, etc.
            const shapeElements = allElements.filter(el => {
                if (!el.type) return false;
                
                const typeUpper = el.type.toUpperCase();
                const isNode = (
                    typeUpper.startsWith('CLASS') || 
                    typeUpper.startsWith('PACKAGE') ||
                    typeUpper.startsWith('INTERFACE') ||
                    typeUpper.startsWith('NODE:') ||
                    typeUpper.includes('__')
                ) && !typeUpper.includes('LABEL') && !typeUpper.includes('COMP');
                
                if (isNode) {
                    console.log(`✓ Found node element: ${el.id} (type: ${el.type})`);
                }
                return isNode;
            });
            
            console.log(`Shape elements found: ${shapeElements.length}`);
            
            if (shapeElements.length > 0) {
                // Get the last shape element (most recently created)
                const newElement = shapeElements[shapeElements.length - 1];
                if (newElement && newElement.id) {
                    console.log(`✓ Captured new element ID: ${newElement.id}`);
                    this.pendingElementCreation.resolve(newElement.id);
                    this.pendingElementCreation = null;
                }
            } else {
                console.log('No shape elements found matching criteria');
            }
        } else {
            console.log('No pending element creation');
        }
    }

    /**
     * Get all elements from a model tree
     */
    private getAllElements(element: any): any[] {
        const elements: any[] = [];
        
        if (element.id) {
            elements.push(element);
        }
        
        if (element.children && Array.isArray(element.children)) {
            for (const child of element.children) {
                elements.push(...this.getAllElements(child));
            }
        }
        
        return elements;
    }

    /**
     * Parse CSV content into interaction events
     */
    private parseCSV(csvContent: string): InteractionEvent[] {
        const records = parse(csvContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });

        return records
            .filter((record: any) => {
                // Skip session_start, session_end, and eye_tracking_start events
                return !['session_start', 'session_end', 'eye_tracking_start'].includes(record.type);
            })
            .map((record: any) => ({
                timestamp: parseInt(record.timestamp),
                type: record.type as InteractionEventType,
                sessionId: record.sessionId,
                data: JSON.parse(record.data)
            }));
    }

    /**
     * Filter events by time range
     */
    private filterEventsByTime(events: InteractionEvent[], options: ReplayOptions): InteractionEvent[] {
        return events.filter(event => {
            if (options.startFromTimestamp && event.timestamp < options.startFromTimestamp) {
                return false;
            }
            if (options.endAtTimestamp && event.timestamp > options.endAtTimestamp) {
                return false;
            }
            return true;
        });
    }

    /**
     * Replay events with timing control and build ID mapping
     */
    private async replayEvents(
        events: InteractionEvent[],
        options: ReplayOptions,
        progress: vscode.Progress<{ message?: string; increment?: number }>
    ): Promise<void> {
        const speed = options.speed ?? 1;
        const instantReplay = speed === 0;

        // Pre-process events to build a creation-to-ID map
        this.buildCreationIdMap(events);

        for (let i = 0; i < events.length; i++) {
            // Check if replay was aborted
            if (this.replayAbortController?.signal.aborted) {
                return;
            }

            const event = events[i];
            const nextEvent = events[i + 1];

            // Update progress
            progress.report({
                message: `Event ${i + 1}/${events.length}: ${event.type}`,
                increment: 100 / events.length
            });

            // Dispatch the action
            await this.dispatchEvent(event);

            // Calculate delay until next event
            if (!instantReplay && nextEvent) {
                const delay = (nextEvent.timestamp - event.timestamp) / speed;
                await this.sleep(delay);
            }
        }
    }

    /**
     * Dispatch an interaction event as a GLSP action
     * Builds ID mapping by tracking old IDs and capturing new IDs
     */
    private async dispatchEvent(event: InteractionEvent): Promise<void> {
        try {
            const action = this.convertEventToAction(event);
            if (action) {
                // Check if this is a creation with an old ID
                const oldElementId = (event.data as any)._oldElementId;
                
                // Dispatch the action
                await this.actionDispatcher.dispatch(action);
                
                // If we have an old ID, wait for the new ID and build mapping
                if (action.kind === 'createNode' && oldElementId) {
                    const newElementId = await this.waitForNewElementId(action.elementTypeId);
                    if (newElementId) {
                        this.idMapping.set(oldElementId, newElementId);
                        // Also map the label ID
                        this.idMapping.set(`${oldElementId}_name_label`, `${newElementId}_name_label`);
                        console.log(`✓ ID mapping: ${oldElementId} -> ${newElementId}`);
                    }
                }
                
                // Longer delay to ensure action is fully processed
                await this.sleep(150);
            }
        } catch (error) {
            console.error('Error dispatching event:', event, error);
        }
    }

    /**
     * Wait for the new element ID to be captured from model update
     */
    private waitForNewElementId(elementType: string): Promise<string> {
        return new Promise((resolve) => {
            this.pendingElementCreation = {
                resolve,
                elementType
            };
            
            // Timeout after 2 seconds
            setTimeout(() => {
                if (this.pendingElementCreation) {
                    console.warn('Timeout waiting for new element ID');
                    this.pendingElementCreation = null;
                    resolve('');
                }
            }, 2000);
        });
    }

    /**
     * Convert interaction event to GLSP action
     * Resolves $ROOT placeholder to the actual diagram root
     * Skips operations that reference unknown element IDs
     */
    private convertEventToAction(event: InteractionEvent): any | null {
        const data = event.data;

        switch (event.type) {
            case InteractionEventType.ELEMENT_CREATE:
                if (data.kind === 'createNode') {
                    // For $ROOT, omit the containerId - let the server use the default root
                    const action: any = {
                        kind: 'createNode',
                        elementTypeId: data.elementTypeId,
                        location: data.location,
                        isOperation: true
                    };
                    // Only include containerId if it's not $ROOT
                    if (data.containerId !== '$ROOT') {
                        action.containerId = data.containerId;
                    }
                    return action;
                } else if (data.kind === 'createEdge') {
                    // Use ID mapping for source and target
                    const sourceId = this.idMapping.get(data.sourceElementId) || data.sourceElementId;
                    const targetId = this.idMapping.get(data.targetElementId) || data.targetElementId;
                    
                    // Only create edge if we have both IDs
                    if (this.idMapping.has(data.sourceElementId) && this.idMapping.has(data.targetElementId)) {
                        console.log(`Creating edge: ${sourceId} -> ${targetId}`);
                        return {
                            kind: 'createEdge',
                            elementTypeId: data.elementTypeId,
                            sourceElementId: sourceId,
                            targetElementId: targetId,
                            isOperation: true
                        };
                    } else {
                        console.log(`Skipping edge - waiting for ID mapping (${data.sourceElementId}, ${data.targetElementId})`);
                        return null;
                    }
                }
                break;

            case InteractionEventType.ELEMENT_DELETE:
                return {
                    kind: 'deleteElement',
                    elementIds: data.elementIds,
                    isOperation: true
                };

            case InteractionEventType.ELEMENT_MOVE:
                return {
                    kind: 'changeBounds',
                    newBounds: data.newBounds,
                    isOperation: true
                };

            case InteractionEventType.ELEMENT_SELECT:
                return {
                    kind: 'elementSelected',
                    selectedElementsIDs: data.selectedElementsIDs || [],
                    deselectedElementsIDs: data.deselectedElementsIDs || []
                };

            case InteractionEventType.PROPERTY_CHANGE:
                // Use ID mapping for label edits
                if (data.kind === 'applyLabelEdit') {
                    const labelId = this.idMapping.get(data.labelId) || data.labelId;
                    
                    // Only apply if we have the mapping
                    if (this.idMapping.has(data.labelId)) {
                        console.log(`Applying label edit: ${labelId} = "${data.text}"`);
                        return {
                            kind: 'applyLabelEdit',
                            labelId: labelId,
                            text: data.text
                        };
                    } else {
                        console.log(`Skipping label edit - waiting for ID mapping (${data.labelId})`);
                        return null;
                    }
                } else if (data.kind === 'updateElementProperty') {
                    const elementId = this.idMapping.get(data.elementId) || data.elementId;
                    
                    if (this.idMapping.has(data.elementId)) {
                        return {
                            kind: 'updateElementProperty',
                            elementId: elementId,
                            propertyId: data.propertyId,
                            value: data.value
                        };
                    } else {
                        console.log(`Skipping property update - waiting for ID mapping (${data.elementId})`);
                        return null;
                    }
                }
                break;

            case InteractionEventType.VIEWPORT_CHANGE:
                if (data.newViewport) {
                    return {
                        kind: 'setViewport',
                        newViewport: data.newViewport
                    };
                }
                break;

            default:
                // Unsupported event type
                return null;
        }

        return null;
    }

    /**
     * Sleep for a specified duration
     */
    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, Math.max(0, ms)));
    }

    /**
     * Get summary of a session file
     */
    public getSessionSummary(filePath: string): {
        sessionId: string;
        totalEvents: number;
        duration: number;
        eventTypes: Record<string, number>;
        startTime: Date;
        endTime: Date;
    } | null {
        try {
            const csvContent = fs.readFileSync(filePath, 'utf-8');
            const events = this.parseCSV(csvContent);

            if (events.length === 0) {
                return null;
            }

            const eventTypes: Record<string, number> = {};
            events.forEach(event => {
                eventTypes[event.type] = (eventTypes[event.type] || 0) + 1;
            });

            const firstEvent = events[0];
            const lastEvent = events[events.length - 1];

            return {
                sessionId: firstEvent.sessionId,
                totalEvents: events.length,
                duration: lastEvent.timestamp - firstEvent.timestamp,
                eventTypes,
                startTime: new Date(firstEvent.timestamp),
                endTime: new Date(lastEvent.timestamp)
            };
        } catch (error) {
            console.error('Error reading session summary:', error);
            return null;
        }
    }
}
