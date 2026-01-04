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
    private idMapping: Map<string, string> = new Map();
    private knownElementIds: Set<string> = new Set();
    private pendingElementCreation: { resolve: (id: string) => void; elementType: string } | null = null;
    private lastSelectedClassId: string | null = null;
    private lastSelectedActivityId: string | null = null;
    private autoCreatedChildrenQueue: string[] | null = null;
    private elementTypes: Map<string, string> = new Map();
    private elementTypeMap: Map<string, string> = new Map();
    private graphRootId: string | null = null;

    // Activity node types that must be created inside an Activity container
    private static readonly ACTIVITY_NODE_TYPES = [
        'ACTIVITY__InitialNode',
        'ACTIVITY__ActivityFinalNode',
        'ACTIVITY__FlowFinalNode',
        'ACTIVITY__OpaqueAction',
        'ACTIVITY__AcceptEventAction',
        'ACTIVITY__SendSignalAction',
        'ACTIVITY__DecisionNode',
        'ACTIVITY__MergeNode',
        'ACTIVITY__ForkNode',
        'ACTIVITY__JoinNode',
        'ACTIVITY__CentralBufferNode',
        'ACTIVITY__ActivityParameterNode'
    ];

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
            this.idMapping.clear();
            this.knownElementIds.clear();
            this.elementTypeMap.clear();
            this.lastSelectedClassId = null;
            this.lastSelectedActivityId = null;
            this.graphRootId = null;

            modelListener = this.setupModelListener();

            const csvContent = fs.readFileSync(filePath, 'utf-8');
            const events = this.parseCSV(csvContent);
            const filteredEvents = this.filterEventsByTime(events, options);

            if (filteredEvents.length === 0) {
                vscode.window.showWarningMessage('No events found in the selected time range');
                return;
            }

            this.buildCreationIdMap(filteredEvents);

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
            console.error('[Replay] Error:', error);
        } finally {
            this.isReplaying = false;
            this.replayAbortController = undefined;
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
            console.warn('[Replay] ActionListener not available for ID mapping');
            return null;
        }

        return this.actionListener.registerServerListener((message: any) => {
            const action = message?.action;
            if (!action) return;

            if (action.kind === 'updateModel' && action.newRoot) {
                this.extractNewElementIds(action.newRoot);
            }
        });
    }

    /**
     * Build a map of old element IDs from the recording using two-pass algorithm
     */
    private buildCreationIdMap(events: InteractionEvent[]): void {
        const assignedIds = new Set<string>();
        const unmappedCreations: { index: number; elementType: string }[] = [];
        
        // First pass: Find IDs that appear immediately after creation
        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            
            if (event.type === InteractionEventType.ELEMENT_CREATE && event.data.kind === 'createNode') {
                const oldId = this.findElementIdAfterCreation(events, i, assignedIds);
                if (oldId) {
                    (event.data as any)._oldElementId = oldId;
                    assignedIds.add(oldId);
                } else {
                    unmappedCreations.push({ index: i, elementType: event.data.elementTypeId });
                }
            }
        }
        
        // Second pass: For unmapped creations, search ALL events to find their IDs
        if (unmappedCreations.length > 0) {
            const allIds = this.collectAllReferencedIds(events);
            const unassignedIds = Array.from(allIds).filter(id => !assignedIds.has(id));
            
            for (const creation of unmappedCreations) {
                for (let i = creation.index + 1; i < events.length; i++) {
                    const event = events[i];
                    const idsInEvent = this.extractIdsFromEvent(event);
                    
                    for (const id of idsInEvent) {
                        if (unassignedIds.includes(id) && !assignedIds.has(id)) {
                            const creationEvent = events[creation.index];
                            (creationEvent.data as any)._oldElementId = id;
                            assignedIds.add(id);
                            break;
                        }
                    }
                    
                    if ((events[creation.index].data as any)._oldElementId) {
                        break;
                    }
                }
                
                if (!(events[creation.index].data as any)._oldElementId) {
                    console.warn(`[Replay] No ID found for ${creation.elementType} at index ${creation.index}`);
                }
            }
        }
    }
    
    /**
     * Collect all element IDs that are referenced anywhere in the events
     */
    private collectAllReferencedIds(events: InteractionEvent[]): Set<string> {
        const ids = new Set<string>();
        
        for (const event of events) {
            const eventIds = this.extractIdsFromEvent(event);
            eventIds.forEach(id => ids.add(id));
        }
        
        return ids;
    }
    
    /**
     * Extract all element IDs from a single event
     */
    private extractIdsFromEvent(event: InteractionEvent): string[] {
        const ids: string[] = [];
        
        if (event.type === InteractionEventType.ELEMENT_SELECT) {
            const selectedIds = event.data.selectedElementsIDs;
            if (selectedIds) {
                ids.push(...selectedIds);
            }
        }
        
        if (event.type === InteractionEventType.ELEMENT_CREATE && event.data.kind === 'createEdge') {
            if (event.data.sourceElementId) ids.push(event.data.sourceElementId);
            if (event.data.targetElementId) ids.push(event.data.targetElementId);
        }
        
        if (event.type === InteractionEventType.PROPERTY_CHANGE) {
            if (event.data.kind === 'applyLabelEdit' && event.data.labelId) {
                const elementId = event.data.labelId.replace(/_name_label$/, '');
                if (elementId && elementId !== event.data.labelId) {
                    ids.push(elementId);
                }
            }
            if (event.data.kind === 'updateElementProperty' && event.data.elementId) {
                ids.push(event.data.elementId);
            }
        }
        
        if (event.type === InteractionEventType.ELEMENT_MOVE && event.data.newBounds) {
            for (const bound of event.data.newBounds) {
                if (bound.elementId) ids.push(bound.elementId);
            }
        }
        
        if (event.type === InteractionEventType.ELEMENT_DELETE && event.data.elementIds) {
            ids.push(...event.data.elementIds);
        }
        
        return ids;
    }

    /**
     * Find the element ID by looking at events following a creation
     */
    private findElementIdAfterCreation(events: InteractionEvent[], creationIndex: number, assignedIds: Set<string>): string | null {
        const seenIds = new Set<string>();
        for (let i = 0; i < creationIndex; i++) {
            const event = events[i];
            if (event.type === InteractionEventType.ELEMENT_SELECT) {
                const selectedIds = event.data.selectedElementsIDs;
                if (selectedIds) {
                    selectedIds.forEach((id: string) => seenIds.add(id));
                }
            }
            if (event.type === InteractionEventType.PROPERTY_CHANGE) {
                if (event.data.kind === 'applyLabelEdit' && event.data.labelId) {
                    const elementId = event.data.labelId.replace(/_name_label$/, '');
                    if (elementId) {
                        seenIds.add(elementId);
                    }
                }
            }
            if (event.type === InteractionEventType.ELEMENT_CREATE && event.data.kind === 'createEdge') {
                if (event.data.sourceElementId) seenIds.add(event.data.sourceElementId);
                if (event.data.targetElementId) seenIds.add(event.data.targetElementId);
            }
        }
        
        for (let i = creationIndex + 1; i < Math.min(creationIndex + 30, events.length); i++) {
            const event = events[i];
            
            // Stop at next createNode event
            if (event.type === InteractionEventType.ELEMENT_CREATE && event.data.kind === 'createNode') {
                break;
            }
            
            if (event.type === InteractionEventType.ELEMENT_SELECT) {
                const selectedIds = event.data.selectedElementsIDs;
                if (selectedIds && selectedIds.length > 0) {
                    for (const id of selectedIds) {
                        if (!seenIds.has(id) && !assignedIds.has(id)) {
                            return id;
                        }
                    }
                }
            }
            
            if (event.type === InteractionEventType.ELEMENT_CREATE && event.data.kind === 'createEdge') {
                const sourceId = event.data.sourceElementId;
                const targetId = event.data.targetElementId;
                
                if (sourceId && !seenIds.has(sourceId) && !assignedIds.has(sourceId)) {
                    return sourceId;
                }
                if (targetId && !seenIds.has(targetId) && !assignedIds.has(targetId)) {
                    return targetId;
                }
            }
            
            if (event.type === InteractionEventType.PROPERTY_CHANGE) {
                if (event.data.kind === 'applyLabelEdit' && event.data.labelId) {
                    const elementId = event.data.labelId.replace(/_name_label$/, '');
                    if (elementId && elementId !== event.data.labelId && !seenIds.has(elementId) && !assignedIds.has(elementId)) {
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
            return;
        }

        // Capture the graph root ID for viewport actions
        if (root.id && (root.type === 'graph' || !root.type)) {
            this.graphRootId = root.id;
        }

        const allElements = this.getAllElements(root);

        if (this.pendingElementCreation) {
            const expectedType = this.pendingElementCreation.elementType;
            
            const matchingElements = allElements.filter(el => {
                if (!el.type || !el.id) return false;
                const matches = el.type === expectedType;
                const isValidElement = !el.type.includes('label') && 
                                      !el.type.includes('comp') &&
                                      !el.type.includes('_context_');
                const isNew = !this.knownElementIds.has(el.id);
                return matches && isValidElement && isNew;
            });
            
            if (matchingElements.length > 0) {
                const newElement = matchingElements[0];
                if (newElement && newElement.id) {
                    this.pendingElementCreation.resolve(newElement.id);
                    this.pendingElementCreation = null;
                    this.mapAutoCreatedChildren(newElement, allElements);
                }
            }
        }

        allElements.forEach(el => {
            if (el.id) {
                this.knownElementIds.add(el.id);
                if (el.type) {
                    this.elementTypeMap.set(el.id, el.type);
                }
            }
        });
    }

    /**
     * Map auto-created child elements (like default properties in a Class)
     */
    private mapAutoCreatedChildren(parentElement: any, allElements: any[]): void {
        const newChildren = allElements.filter(el => {
            if (!el.id || !el.type) return false;
            if (this.knownElementIds.has(el.id)) return false;
            
            const isProperty = el.type.includes('Property') || 
                              el.type.includes('property') ||
                              el.type.includes('PROPERTY');
            const isNotParent = el.id !== parentElement.id;
            const isNotLabel = !el.type.includes('label') && !el.type.includes('Label');
            
            return isProperty && isNotParent && isNotLabel;
        });
        
        if (newChildren.length === 0) {
            return;
        }
        
        if (!this.autoCreatedChildrenQueue) {
            this.autoCreatedChildrenQueue = [];
        }
        
        newChildren.forEach(child => {
            this.autoCreatedChildrenQueue!.push(child.id);
        });
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
     * Replay events with timing control
     */
    private async replayEvents(
        events: InteractionEvent[],
        options: ReplayOptions,
        progress: vscode.Progress<{ message?: string; increment?: number }>
    ): Promise<void> {
        const speed = options.speed ?? 1;
        const instantReplay = speed === 0;

        this.buildCreationIdMap(events);

        for (let i = 0; i < events.length; i++) {
            if (this.replayAbortController?.signal.aborted) {
                return;
            }

            const event = events[i];
            const nextEvent = events[i + 1];

            progress.report({
                message: `Event ${i + 1}/${events.length}: ${event.type}`,
                increment: 100 / events.length
            });

            await this.dispatchEvent(event);

            if (!instantReplay && nextEvent) {
                const delay = (nextEvent.timestamp - event.timestamp) / speed;
                const actualDelay = Math.max(delay, 100);
                await this.sleep(actualDelay);
            }
        }
    }

    /**
     * Dispatch an interaction event as a GLSP action
     */
    private async dispatchEvent(event: InteractionEvent): Promise<void> {
        try {
            const action = this.convertEventToAction(event);
            if (action) {
                const oldElementId = (event.data as any)._oldElementId;
                
                await this.actionDispatcher.dispatch(action);
                
                if (action.kind === 'createNode' && oldElementId) {
                    const newElementId = await this.waitForNewElementId(action.elementTypeId);
                    if (newElementId) {
                        this.idMapping.set(oldElementId, newElementId);
                        this.elementTypes.set(oldElementId, action.elementTypeId);
                        this.idMapping.set(`${oldElementId}_name_label`, `${newElementId}_name_label`);
                    }
                }
                
                const delay = this.getActionProcessingDelay(action.kind);
                await this.sleep(delay);
            }
        } catch (error) {
            console.error('[Replay] Error dispatching event:', event, error);
        }
    }

    /**
     * Get the minimum delay needed for an action to be processed
     */
    private getActionProcessingDelay(actionKind: string): number {
        switch (actionKind) {
            case 'createNode':
            case 'createEdge':
                return 300;
            case 'applyLabelEdit':
            case 'updateElementProperty':
                return 200;
            case 'elementSelected':
            case 'setViewport':
                return 50;
            default:
                return 150;
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
            
            setTimeout(() => {
                if (this.pendingElementCreation) {
                    console.warn('[Replay] Timeout waiting for new element ID');
                    this.pendingElementCreation = null;
                    resolve('');
                }
            }, 5000);
        });
    }

    /**
     * Convert interaction event to GLSP action
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
                    
                    const isActivityNode = InteractionReplayService.ACTIVITY_NODE_TYPES.includes(data.elementTypeId);
                    
                    if (isActivityNode && this.lastSelectedActivityId) {
                        action.containerId = this.lastSelectedActivityId;
                    } else if (data.elementTypeId === 'CLASS__Property' && this.lastSelectedClassId) {
                        action.containerId = this.lastSelectedClassId;
                    } else if (data.containerId && data.containerId !== '$ROOT') {
                        action.containerId = this.idMapping.get(data.containerId) || data.containerId;
                    }
                    
                    return action;
                } else if (data.kind === 'createEdge') {
                    const sourceId = this.idMapping.get(data.sourceElementId) || data.sourceElementId;
                    const targetId = this.idMapping.get(data.targetElementId) || data.targetElementId;
                    
                    if (this.idMapping.has(data.sourceElementId) && this.idMapping.has(data.targetElementId)) {
                        return {
                            kind: 'createEdge',
                            elementTypeId: data.elementTypeId,
                            sourceElementId: sourceId,
                            targetElementId: targetId,
                            isOperation: true
                        };
                    } else {
                        return null;
                    }
                }
                break;

            case InteractionEventType.ELEMENT_DELETE: {
                const mappedElementIds = data.elementIds?.map((id: string) => 
                    this.idMapping.get(id) || id
                );
                
                const allMapped = data.elementIds?.every((id: string) => 
                    this.idMapping.has(id)
                );
                
                if (allMapped) {
                    return {
                        kind: 'deleteElement',
                        elementIds: mappedElementIds,
                        isOperation: true
                    };
                } else {
                    return null;
                }
            }

            case InteractionEventType.ELEMENT_MOVE: {
                const mappedBounds = data.newBounds.map((bound: any) => ({
                    ...bound,
                    elementId: this.idMapping.get(bound.elementId) || bound.elementId
                }));
                
                return {
                    kind: 'changeBounds',
                    newBounds: mappedBounds,
                    isOperation: true
                };
            }

            case InteractionEventType.ELEMENT_SELECT:
                if (data.selectedElementsIDs && data.selectedElementsIDs.length > 0) {
                    const selectedId = data.selectedElementsIDs[0];
                    const mappedId = this.idMapping.get(selectedId) || selectedId;
                    
                    const elementTypeFromOld = this.elementTypes.get(selectedId);
                    const elementTypeFromNew = this.elementTypeMap.get(mappedId);
                    const elementType = elementTypeFromOld || elementTypeFromNew;
                    
                    if (elementType) {
                        if (elementType === 'ACTIVITY__Activity' || elementType.includes('Activity') && !elementType.includes('Node')) {
                            this.lastSelectedActivityId = mappedId;
                        } else if (elementType === 'CLASS__Class') {
                            this.lastSelectedClassId = mappedId;
                        }
                    }
                }
                
                return {
                    kind: 'elementSelected',
                    selectedElementsIDs: data.selectedElementsIDs || [],
                    deselectedElementsIDs: data.deselectedElementsIDs || []
                };

            case InteractionEventType.PROPERTY_CHANGE:
                if (data.kind === 'applyLabelEdit') {
                    const labelId = this.idMapping.get(data.labelId) || data.labelId;
                    
                    if (this.idMapping.has(data.labelId)) {
                        return {
                            kind: 'applyLabelEdit',
                            labelId: labelId,
                            text: data.text
                        };
                    } else {
                        return null;
                    }
                } else if (data.kind === 'updateElementProperty') {
                    let elementId = this.idMapping.get(data.elementId);
                    
                    if (!elementId) {
                        if (this.autoCreatedChildrenQueue && this.autoCreatedChildrenQueue.length > 0) {
                            const newChildId = this.autoCreatedChildrenQueue.shift()!;
                            this.idMapping.set(data.elementId, newChildId);
                            elementId = newChildId;
                        } else {
                            return null;
                        }
                    }
                    
                    return {
                        kind: 'updateElementProperty',
                        elementId: elementId,
                        propertyId: data.propertyId,
                        value: data.value,
                        isOperation: true
                    };
                }
                break;

            case InteractionEventType.VIEWPORT_CHANGE: {
                const scroll = data.scroll || data.newViewport?.scroll;
                const zoom = data.zoom ?? data.newViewport?.zoom;
                const graphElementId = this.graphRootId || 'GRAPH';
                
                if (data.kind === 'setViewport' && (scroll || zoom !== undefined)) {
                    return {
                        kind: 'viewport',
                        newViewport: {
                            scroll: scroll || { x: 0, y: 0 },
                            zoom: zoom ?? 1
                        },
                        elementId: graphElementId,
                        animate: data.animate ?? false
                    };
                } else if (data.kind === 'center' && data.elementIds) {
                    const mappedIds = data.elementIds.map((id: string) => 
                        this.idMapping.get(id) || id
                    );
                    return {
                        kind: 'center',
                        elementIds: mappedIds,
                        animate: data.animate ?? false,
                        retainZoom: data.retainZoom ?? true
                    };
                } else if (data.kind === 'fit') {
                    const mappedIds = data.elementIds?.map((id: string) => 
                        this.idMapping.get(id) || id
                    );
                    return {
                        kind: 'fit',
                        elementIds: mappedIds || [],
                        padding: data.padding,
                        maxZoom: data.maxZoom,
                        animate: data.animate ?? false
                    };
                } else if (scroll || zoom !== undefined) {
                    return {
                        kind: 'viewport',
                        newViewport: {
                            scroll: scroll || { x: 0, y: 0 },
                            zoom: zoom ?? 1
                        },
                        elementId: graphElementId,
                        animate: false
                    };
                }
                return null;
            }

            default:
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
            console.error('[Replay] Error reading session summary:', error);
            return null;
        }
    }
}
