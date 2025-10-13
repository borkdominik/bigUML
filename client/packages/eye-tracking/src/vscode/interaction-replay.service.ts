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
    private knownElementIds: Set<string> = new Set(); // Track all element IDs we've seen
    private pendingElementCreation: { resolve: (id: string) => void; elementType: string } | null = null;
    private lastSelectedClassId: string | null = null; // Track the last selected class for property containment
    private autoCreatedChildrenQueue: string[] | null = null; // Queue of auto-created child IDs to map
    private elementTypes: Map<string, string> = new Map(); // Track element types (old ID -> element type)

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
            this.knownElementIds.clear(); // Clear known elements for new replay session
            this.lastSelectedClassId = null; // Clear last selected class

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

            // Pre-process events to build creation-to-ID map
            this.buildCreationIdMap(filteredEvents);

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
        for (let i = creationIndex + 1; i < Math.min(creationIndex + 10, events.length); i++) {
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
                // check updateElementProperty actions (from property palette)
                if (event.data.kind === 'updateElementProperty' && event.data.elementId) {
                    return event.data.elementId;
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

        // Get all elements from the model
        const allElements = this.getAllElements(root);

        // If we have a pending element creation, try to match it BEFORE updating known elements
        if (this.pendingElementCreation) {
            console.log(`Total elements found: ${allElements.length}`);
            
            // Log all element types to see what we're actually getting
            allElements.forEach((el, idx) => {
                console.log(`  Element ${idx}: id=${el.id}, type=${el.type}`);
            });
            
            // Get the expected element type we're waiting for
            const expectedType = this.pendingElementCreation.elementType;
            console.log(`Looking for elements of type: ${expectedType}`);
            
            // Filter elements by matching the expected type AND not already known
            const matchingElements = allElements.filter(el => {
                if (!el.type || !el.id) return false;
                
                // Match the exact element type
                const matches = el.type === expectedType;
                
                // Exclude labels and composite elements
                const isValidElement = !el.type.includes('label') && 
                                      !el.type.includes('comp') &&
                                      !el.type.includes('_context_');
                
                // Must be a new element we didnt see before
                const isNew = !this.knownElementIds.has(el.id);
                
                if (matches && isValidElement && isNew) {
                    console.log(`✓ Found NEW matching element: ${el.id} (type: ${el.type})`);
                }
                return matches && isValidElement && isNew;
            });
            
            console.log(`New matching elements found: ${matchingElements.length}`);
            
            if (matchingElements.length > 0) {
                // Get the first new matching element (most recently created)
                const newElement = matchingElements[0];
                if (newElement && newElement.id) {
                    console.log(`✓ Captured new element ID: ${newElement.id}`);
                    this.pendingElementCreation.resolve(newElement.id);
                    this.pendingElementCreation = null;
                    
                    // Map auto-created children
                    // When a Class is created, it could come with auto-created properties
                    // We need to map these too so property updates work during replay
                    this.mapAutoCreatedChildren(newElement, allElements);
                }
            } else {
                console.log(`No matching elements found for type: ${expectedType}`);
            }
        } else {
            console.log('No pending element creation');
        }

        // Now update our known elements set with all current elements
        allElements.forEach(el => {
            if (el.id) {
                this.knownElementIds.add(el.id);
            }
        });
    }

    /**
     * Map auto-created child elements (like default properties in a Class)
     * Finds all new child elements and maps them in creation order
     */
    private mapAutoCreatedChildren(parentElement: any, allElements: any[]): void {
        // Find all NEW child elements that weren't already known
        const newChildren = allElements.filter(el => {
            if (!el.id || !el.type) return false;
            
            // Must be a new element
            if (this.knownElementIds.has(el.id)) return false;
            
            // Look for property-like elements (but not the parent itself)
            // These are typically auto-created children
            // Check for various property types: Property, CLASS__Property, etc.
            const isProperty = el.type.includes('Property') || 
                              el.type.includes('property') ||
                              el.type.includes('PROPERTY');
            const isNotParent = el.id !== parentElement.id;
            
            // Also exclude labels and composite elements
            const isNotLabel = !el.type.includes('label') && 
                              !el.type.includes('Label');
            
            const isChild = isProperty && isNotParent && isNotLabel;
            
            if (isChild) {
                console.log(`  -> Potential auto-created child: ${el.id} (type: ${el.type})`);
            }
            
            return isChild;
        });
        
        if (newChildren.length === 0) {
            console.log(`No auto-created children found for ${parentElement.id}`);
            console.log(`Parent type: ${parentElement.type}`);
            console.log(`Total new elements: ${allElements.filter(el => !this.knownElementIds.has(el.id)).length}`);
            return;
        }
        
        console.log(`✓ Found ${newChildren.length} auto-created children for ${parentElement.id}:`);
        newChildren.forEach(child => {
            console.log(`  - ${child.id} (type: ${child.type})`);
        });
        
        // Now we need to map these to the corresponding children from the recording
        // We'll do this by looking at the next few property_change events in the recording
        // and matching them by order
        
        // Store these children for later matching when we see property updates
        if (!this.autoCreatedChildrenQueue) {
            this.autoCreatedChildrenQueue = [];
        }
        
        // Add these children to the queue
        newChildren.forEach(child => {
            this.autoCreatedChildrenQueue!.push(child.id);
            console.log(`✓ Queued auto-created child: ${child.id}`);
        });
        
        console.log(`Queue now has ${this.autoCreatedChildrenQueue.length} children waiting to be mapped`);
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
                // Ensure minimum 100ms delay between events to prevent overwhelming the server
                const actualDelay = Math.max(delay, 100);
                await this.sleep(actualDelay);
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
                
                console.log(`Dispatching ${action.kind}${oldElementId ? ` (old ID: ${oldElementId})` : ''}`);
                
                // Dispatch the action
                await this.actionDispatcher.dispatch(action);
                
                // If we have an old ID, wait for the new ID and build mapping
                if (action.kind === 'createNode' && oldElementId) {
                    console.log(`Waiting for new ID to map ${oldElementId}...`);
                    const newElementId = await this.waitForNewElementId(action.elementTypeId);
                    if (newElementId) {
                        this.idMapping.set(oldElementId, newElementId);
                        // Track the element type so we know what kind of element this is
                        this.elementTypes.set(oldElementId, action.elementTypeId);
                        // Also map the label ID
                        this.idMapping.set(`${oldElementId}_name_label`, `${newElementId}_name_label`);
                        console.log(`ID mapping: ${oldElementId} -> ${newElementId}`);
                        console.log(`Label mapping: ${oldElementId}_name_label -> ${newElementId}_name_label`);
                        console.log(`Current ID mappings:`, Array.from(this.idMapping.entries()));
                    }
                }
                
                // Dynamic delay based on action type to ensure server has time to process
                // Creation and edge actions need more time than selections
                const delay = this.getActionProcessingDelay(action.kind);
                await this.sleep(delay);
            }
        } catch (error) {
            console.error('Error dispatching event:', event, error);
        }
    }

    /**
     * Get the minimum delay needed for an action to be processed by the server
     * Different actions require different processing times
     */
    private getActionProcessingDelay(actionKind: string): number {
        switch (actionKind) {
            case 'createNode':
            case 'createEdge':
                return 300; // Creation actions need more time
            case 'applyLabelEdit':
            case 'updateElementProperty':
                return 200; // Property updates need moderate time
            case 'elementSelected':
            case 'setViewport':
                return 50; // Selections and viewport changes are fast
            default:
                return 150; // Default delay for other actions
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
            
            // Increased timeout to 5 seconds to handle slow servers
            setTimeout(() => {
                if (this.pendingElementCreation) {
                    console.warn('Timeout waiting for new element ID');
                    this.pendingElementCreation = null;
                    resolve('');
                }
            }, 5000);
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
                    const action: any = {
                        kind: 'createNode',
                        elementTypeId: data.elementTypeId,
                        location: data.location,
                        isOperation: true
                    };
                    
                    // Special handling for properties - they should be inside a class
                    if (data.elementTypeId === 'CLASS__Property' && this.lastSelectedClassId) {
                        // Use the last selected class as the container
                        action.containerId = this.lastSelectedClassId;
                        console.log(`Creating property inside class: ${this.lastSelectedClassId}`);
                    } else if (data.containerId && data.containerId !== '$ROOT') {
                        // Use mapped containerId if available
                        action.containerId = this.idMapping.get(data.containerId) || data.containerId;
                    }
                    // If no containerId is set, server will use default root
                    
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

            case InteractionEventType.ELEMENT_DELETE: {
                // Map element IDs for deletion
                const mappedElementIds = data.elementIds?.map((id: string) => 
                    this.idMapping.get(id) || id
                );
                
                // Only delete if we have all the mappings
                const allMapped = data.elementIds?.every((id: string) => 
                    this.idMapping.has(id)
                );
                
                if (allMapped) {
                    console.log(`Deleting elements: ${mappedElementIds}`);
                    return {
                        kind: 'deleteElement',
                        elementIds: mappedElementIds,
                        isOperation: true
                    };
                } else {
                    console.log(`Skipping delete - waiting for ID mapping (${data.elementIds})`);
                    return null;
                }
            }

            case InteractionEventType.ELEMENT_MOVE:
                return {
                    kind: 'changeBounds',
                    newBounds: data.newBounds,
                    isOperation: true
                };

            case InteractionEventType.ELEMENT_SELECT:
                // Track the last selected class for property containment
                // We need to check if the selected element is actually a CLASS
                if (data.selectedElementsIDs && data.selectedElementsIDs.length > 0) {
                    const selectedId = data.selectedElementsIDs[0];
                    // Map the old ID to the new ID
                    const mappedId = this.idMapping.get(selectedId);
                    if (mappedId) {
                        // Only update lastSelectedClassId if this is actually a CLASS
                        const elementType = this.elementTypes.get(selectedId);
                        if (elementType === 'CLASS__Class') {
                            this.lastSelectedClassId = mappedId;
                            console.log(`Tracking last selected class: ${mappedId}`);
                        } else {
                            console.log(`Selected ${elementType}, not updating lastSelectedClassId`);
                        }
                    }
                }
                
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
                    // Try direct ID mapping first
                    let elementId = this.idMapping.get(data.elementId);
                    
                    if (!elementId) {
                        // No mapping exists - this might be an auto-created child element
                        // Check if we have any queued auto-created children waiting to be mapped
                        if (this.autoCreatedChildrenQueue && this.autoCreatedChildrenQueue.length > 0) {
                            // Map the first unmapped property update to the first queued child
                            const newChildId = this.autoCreatedChildrenQueue.shift()!;
                            this.idMapping.set(data.elementId, newChildId);
                            elementId = newChildId;
                            console.log(`Auto-mapped property: ${data.elementId} -> ${newChildId}`);
                        } else {
                            // No children available to map - skip this update
                            console.log(`Skipping property update for unmapped element ${data.elementId} (no children in queue)`);
                            console.log(`  Property: ${data.propertyId} = "${data.value}"`);
                            return null;
                        }
                    }
                    
                    console.log(`Sending property update: ${elementId}.${data.propertyId} = "${data.value}"`);
                    return {
                        kind: 'updateElementProperty',
                        elementId: elementId,
                        propertyId: data.propertyId,
                        value: data.value,
                        isOperation: true  // Mark as server operation
                    };
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
