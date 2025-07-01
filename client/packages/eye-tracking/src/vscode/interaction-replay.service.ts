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
    private autoCreatedChildrenQueue: string[] | null = null;
    private elementTypes: Map<string, string> = new Map();
    private elementTypeMap: Map<string, string> = new Map();
    private graphRootId: string | null = null;

    // Container tracking for different diagram types
    private lastSelectedActivityId: string | null = null;
    private lastSelectedClassId: string | null = null;
    private lastSelectedInteractionId: string | null = null;
    private lastSelectedStateMachineId: string | null = null;
    private lastSelectedRegionId: string | null = null;
    private lastSelectedEnumerationId: string | null = null;
    private lastSelectedNodeId: string | null = null;

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
        'ACTIVITY__ActivityParameterNode',
        'ACTIVITY__ActivityPartition'
    ];

    // State Machine elements that need Region container
    private static readonly STATE_MACHINE_REGION_TYPES = [
        'STATE_MACHINE__State',
        'STATE_MACHINE__FinalState',
        'STATE_MACHINE__InitialState',
        'STATE_MACHINE__Choice',
        'STATE_MACHINE__Fork',
        'STATE_MACHINE__Join',
        'STATE_MACHINE__DeepHistory',
        'STATE_MACHINE__ShallowHistory'
    ];

    // Communication elements that need Interaction container
    private static readonly COMMUNICATION_INTERACTION_TYPES = [
        'COMMUNICATION__Lifeline'
    ];

    // Class/Deployment/InformationFlow elements that need classifier container
    private static readonly CLASS_MEMBER_TYPES = [
        'CLASS__Property',
        'CLASS__Operation',
        'DEPLOYMENT__Property',
        'DEPLOYMENT__Operation',
        'INFORMATION_FLOW__Property',
        'INFORMATION_FLOW__Operation'
    ];

    // Enumeration literal needs Enumeration container
    private static readonly ENUMERATION_MEMBER_TYPES = [
        'CLASS__EnumerationLiteral'
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
            this.resetContainerTracking();
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
            
            // Log summary of ID mappings
            console.log('[Replay] === Replay Summary ===');
            console.log(`[Replay] Total ID mappings created: ${this.idMapping.size}`);
            this.idMapping.forEach((newId, oldId) => {
                if (!oldId.includes('_name_label')) {
                    console.log(`  ${oldId} -> ${newId}`);
                }
            });
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
     * Reset all container tracking variables
     */
    private resetContainerTracking(): void {
        this.lastSelectedActivityId = null;
        this.lastSelectedClassId = null;
        this.lastSelectedInteractionId = null;
        this.lastSelectedStateMachineId = null;
        this.lastSelectedRegionId = null;
        this.lastSelectedEnumerationId = null;
        this.lastSelectedNodeId = null;
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
     * Build a map of old element IDs from the recording.
     * Uses a smarter algorithm that matches IDs to createNodes based on first occurrence order.
     */
    private buildCreationIdMap(events: InteractionEvent[]): void {
        // Step 1: Find all createNode events
        const createNodes: { index: number; elementType: string; event: InteractionEvent }[] = [];
        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            if (event.type === InteractionEventType.ELEMENT_CREATE && event.data.kind === 'createNode') {
                createNodes.push({ index: i, elementType: event.data.elementTypeId, event });
            }
        }
        
        // Step 2: Find first occurrence of each ID (from selections, edges, property changes)
        const idFirstOccurrence: Map<string, number> = new Map();
        for (let i = 0; i < events.length; i++) {
            const ids = this.extractIdsFromEvent(events[i]);
            for (const id of ids) {
                if (!idFirstOccurrence.has(id)) {
                    idFirstOccurrence.set(id, i);
                }
            }
        }
        
        // Step 3: Sort IDs by their first occurrence
        const sortedIds = Array.from(idFirstOccurrence.entries())
            .sort((a, b) => a[1] - b[1]);
        
        // Step 4: Assign each ID to the oldest unassigned createNode that precedes it
        const assignedCreateNodes = new Set<number>();
        
        for (const [id, firstOccurrence] of sortedIds) {
            // Find the oldest unassigned createNode that was created BEFORE this ID first appeared
            let bestCreateNode: { index: number; elementType: string; event: InteractionEvent } | null = null;
            
            for (const cn of createNodes) {
                // Skip if already assigned
                if (assignedCreateNodes.has(cn.index)) continue;
                
                // The createNode must be BEFORE the ID's first occurrence
                if (cn.index >= firstOccurrence) continue;
                
                // Take the oldest (first) unassigned createNode
                if (!bestCreateNode || cn.index < bestCreateNode.index) {
                    bestCreateNode = cn;
                }
            }
            
            if (bestCreateNode) {
                (bestCreateNode.event.data as any)._oldElementId = id;
                assignedCreateNodes.add(bestCreateNode.index);
                console.log(`[Replay] Pre-mapped ID ${id} to createNode ${bestCreateNode.elementType} at index ${bestCreateNode.index}`);
            }
        }
        
        // Log any createNodes that couldn't be assigned
        for (const cn of createNodes) {
            if (!assignedCreateNodes.has(cn.index)) {
                console.warn(`[Replay] No ID found for ${cn.elementType} at index ${cn.index}`);
            }
        }
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
                
                // Use flexible type matching
                const typeMatches = this.elementTypesMatch(el.type, expectedType);
                
                const isValidElement = !el.type.includes('label') && 
                                      !el.type.includes('comp') &&
                                      !el.type.includes('_context_');
                const isNew = !this.knownElementIds.has(el.id);
                
                return typeMatches && isValidElement && isNew;
            });
            
            if (matchingElements.length > 0) {
                const newElement = matchingElements[0];
                if (newElement && newElement.id) {
                    console.log(`[Replay] Mapped new element: type=${newElement.type}, id=${newElement.id}`);
                    this.pendingElementCreation.resolve(newElement.id);
                    this.pendingElementCreation = null;
                    this.mapAutoCreatedChildren(newElement, allElements);
                }
            } else {
                // Log what elements we found for debugging
                const newElements = allElements.filter(el => el.id && !this.knownElementIds.has(el.id));
                if (newElements.length > 0) {
                    console.log(`[Replay] No match for ${expectedType}. New elements found:`, 
                        newElements.map(e => ({ type: e.type, id: e.id?.substring(0, 20) })));
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
     * Normalize element type for comparison (handle different formats)
     */
    private normalizeElementType(type: string): string {
        // Remove common prefixes and convert to lowercase
        return type
            .replace(/^(CLASS__|ACTIVITY__|STATE_MACHINE__|COMMUNICATION__|DEPLOYMENT__|PACKAGE__|USE_CASE__|INFORMATION_FLOW__|node:|edge:)/, '')
            .replace(/^.*:/, '') // Remove any remaining prefix before colon
            .toLowerCase();
    }

    /**
     * Check if two element types match (handles different formats)
     */
    private elementTypesMatch(serverType: string, expectedType: string): boolean {
        // Exact match
        if (serverType === expectedType) return true;
        
        // Contains match
        if (serverType.includes(expectedType) || expectedType.includes(serverType)) return true;
        
        // Normalized match
        const normalizedServer = this.normalizeElementType(serverType);
        const normalizedExpected = this.normalizeElementType(expectedType);
        if (normalizedServer === normalizedExpected) return true;
        
        // Check if server type ends with expected element name
        // something like "node:Class" should match "CLASS__Class"
        if (normalizedServer.endsWith(normalizedExpected) || normalizedExpected.endsWith(normalizedServer)) return true;
        
        return false;
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
            .map((record: any) => {
                // Parse timestamp - support both ISO format and Unix epoch
                let timestamp: number;
                if (typeof record.timestamp === 'string' && record.timestamp.includes('T')) {
                    // ISO format (e.g., "2026-01-04T18:14:37.659Z")
                    timestamp = new Date(record.timestamp).getTime();
                } else {
                    // Unix epoch milliseconds
                    timestamp = parseInt(record.timestamp);
                }
                
                return {
                    timestamp,
                    type: record.type as InteractionEventType,
                    sessionId: record.sessionId,
                    data: JSON.parse(record.data)
                };
            });
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
                        console.log(`[Replay] ID Mapping created: ${oldElementId} -> ${newElementId}`);
                        this.idMapping.set(oldElementId, newElementId);
                        this.elementTypes.set(oldElementId, action.elementTypeId);
                        
                        // Also map the label ID
                        const oldLabelId = `${oldElementId}_name_label`;
                        const newLabelId = `${newElementId}_name_label`;
                        this.idMapping.set(oldLabelId, newLabelId);
                        console.log(`[Replay] Label ID Mapping created: ${oldLabelId} -> ${newLabelId}`);
                    } else {
                        console.warn(`[Replay] Failed to get new element ID for ${action.elementTypeId} (old ID: ${oldElementId})`);
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
            console.log(`[Replay] Waiting for new element of type: ${elementType}`);
            
            this.pendingElementCreation = {
                resolve,
                elementType
            };
            
            // Timeout after 10 seconds (increased from 5s because there were issues)
            setTimeout(() => {
                if (this.pendingElementCreation) {
                    console.warn(`[Replay] Timeout waiting for new element ID of type ${elementType}`);
                    this.pendingElementCreation = null;
                    resolve('');
                }
            }, 10000);
        });
    }

    /**
     * Update container tracking based on selected element type
     */
    private updateContainerTracking(elementType: string, mappedId: string): void {
        // Activity diagram
        if (elementType === 'ACTIVITY__Activity' || (elementType.includes('Activity') && !elementType.includes('Node') && !elementType.includes('Partition'))) {
            this.lastSelectedActivityId = mappedId;
        }
        
        // Class diagram - include AbstractClass
        if (elementType === 'CLASS__Class' || elementType === 'CLASS__AbstractClass' || elementType === 'CLASS__Interface' || elementType === 'CLASS__DataType') {
            this.lastSelectedClassId = mappedId;
            console.log(`[Replay] Updated lastSelectedClassId to ${mappedId} (type: ${elementType})`);
        }
        if (elementType === 'CLASS__Enumeration') {
            this.lastSelectedEnumerationId = mappedId;
        }
        
        // Communication diagram
        if (elementType === 'COMMUNICATION__Interaction') {
            this.lastSelectedInteractionId = mappedId;
        }
        
        // State Machine diagram
        if (elementType === 'STATE_MACHINE__StateMachine') {
            this.lastSelectedStateMachineId = mappedId;
        }
        if (elementType === 'STATE_MACHINE__Region') {
            this.lastSelectedRegionId = mappedId;
        }
        
        // Deployment diagram
        if (elementType === 'DEPLOYMENT__Node' || elementType === 'DEPLOYMENT__Device' || elementType === 'DEPLOYMENT__ExecutionEnvironment') {
            this.lastSelectedNodeId = mappedId;
        }
    }

    /**
     * Get the appropriate container ID for an element type
     */
    private getContainerIdForElementType(elementTypeId: string): string | null {
        // Activity nodes need Activity container
        if (InteractionReplayService.ACTIVITY_NODE_TYPES.includes(elementTypeId)) {
            return this.lastSelectedActivityId;
        }
        
        // State Machine elements need Region container
        if (InteractionReplayService.STATE_MACHINE_REGION_TYPES.includes(elementTypeId)) {
            return this.lastSelectedRegionId;
        }
        
        // Region needs StateMachine container
        if (elementTypeId === 'STATE_MACHINE__Region') {
            return this.lastSelectedStateMachineId;
        }
        
        // Communication Lifeline needs Interaction container
        if (InteractionReplayService.COMMUNICATION_INTERACTION_TYPES.includes(elementTypeId)) {
            return this.lastSelectedInteractionId;
        }
        
        // Class members need Class/Interface/DataType container
        if (InteractionReplayService.CLASS_MEMBER_TYPES.includes(elementTypeId)) {
            return this.lastSelectedClassId || this.lastSelectedNodeId;
        }
        
        // Enumeration literals need Enumeration container
        if (InteractionReplayService.ENUMERATION_MEMBER_TYPES.includes(elementTypeId)) {
            return this.lastSelectedEnumerationId;
        }
        
        return null;
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
                    
                    // Get the appropriate container for this element type
                    const containerId = this.getContainerIdForElementType(data.elementTypeId);
                    if (containerId) {
                        action.containerId = containerId;
                        console.log(`[Replay] createNode ${data.elementTypeId} in container ${containerId}`);
                    } else if (data.containerId && data.containerId !== '$ROOT') {
                        action.containerId = this.idMapping.get(data.containerId) || data.containerId;
                        console.log(`[Replay] createNode ${data.elementTypeId} in mapped container ${action.containerId}`);
                    } else {
                        console.log(`[Replay] createNode ${data.elementTypeId} at root`);
                    }
                    
                    return action;
                } else if (data.kind === 'createEdge') {
                    const sourceId = this.idMapping.get(data.sourceElementId) || data.sourceElementId;
                    const targetId = this.idMapping.get(data.targetElementId) || data.targetElementId;
                    
                    const sourceHasMapping = this.idMapping.has(data.sourceElementId);
                    const targetHasMapping = this.idMapping.has(data.targetElementId);
                    
                    console.log(`[Replay] createEdge: ${data.elementTypeId}`);
                    console.log(`  source: ${data.sourceElementId} -> ${sourceId} (mapped: ${sourceHasMapping})`);
                    console.log(`  target: ${data.targetElementId} -> ${targetId} (mapped: ${targetHasMapping})`);
                    
                    if (sourceHasMapping && targetHasMapping) {
                        return {
                            kind: 'createEdge',
                            elementTypeId: data.elementTypeId,
                            sourceElementId: sourceId,
                            targetElementId: targetId,
                            isOperation: true
                        };
                    } else {
                        console.warn(`[Replay] Skipping edge - missing ID mapping. Source mapped: ${sourceHasMapping}, Target mapped: ${targetHasMapping}`);
                        console.warn(`  Available mappings: ${Array.from(this.idMapping.keys()).join(', ')}`);
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
                    
                    console.log(`[Replay] Selection: old=${selectedId}, mapped=${mappedId}, type=${elementType || 'unknown'}`);
                    
                    if (elementType) {
                        this.updateContainerTracking(elementType, mappedId);
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
                    const hasMapping = this.idMapping.has(data.labelId);
                    
                    console.log(`[Replay] applyLabelEdit: "${data.text}"`);
                    console.log(`  labelId: ${data.labelId} -> ${labelId} (mapped: ${hasMapping})`);
                    
                    if (hasMapping) {
                        return {
                            kind: 'applyLabelEdit',
                            labelId: labelId,
                            text: data.text
                        };
                    } else {
                        console.warn(`[Replay] Skipping label edit - no mapping for ${data.labelId}`);
                        console.warn(`  Available mappings: ${Array.from(this.idMapping.keys()).join(', ')}`);
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
