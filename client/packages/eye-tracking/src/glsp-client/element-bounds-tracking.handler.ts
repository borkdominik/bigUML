/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import {
    type Action,
    type IActionHandler,
    type ICommand,
    type IActionDispatcher,
    ChangeBoundsOperation,
    SetBoundsAction,
    TYPES
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { ElementBoundsTrackingAction } from '../common/interaction-tracking.action.js';

/**
 * Handler that captures element move/resize operations in the GLSP client
 * and dispatches them to the VSCode extension for tracking.
 * 
 * This is needed because nested element moves (e.g., actions inside an Activity)
 * somehow arent captured by the VS Code action listener.
 */
@injectable()
export class ElementBoundsTrackingHandler implements IActionHandler {
    @inject(TYPES.IActionDispatcher)
    protected actionDispatcher: IActionDispatcher;

    // Debounce settings to prevent flooding during drag operations
    private debounceTimeout: ReturnType<typeof setTimeout> | null = null;
    private readonly DEBOUNCE_MS = 100;
    private pendingBounds: Map<string, { position: { x: number; y: number }; size: { width: number; height: number } }> = new Map();

    handle(action: Action): ICommand | Action | void {
        // Handle ChangeBoundsOperation (move/resize operations sent to server)
        if (ChangeBoundsOperation.is(action)) {
            if (action.newBounds && action.newBounds.length > 0) {
                for (const bound of action.newBounds) {
                    if (bound.newPosition && bound.newSize) {
                        this.trackBoundsChange(
                            bound.elementId,
                            bound.newPosition,
                            bound.newSize
                        );
                    }
                }
            }
        }
        
        // Handle SetBoundsAction (bounds changes applied on client)
        if (SetBoundsAction.is(action)) {
            if (action.bounds && action.bounds.length > 0) {
                for (const bound of action.bounds) {
                    const position = bound.newPosition ?? { x: 0, y: 0 };
                    const size = bound.newSize ?? { width: 0, height: 0 };
                    this.trackBoundsChange(
                        bound.elementId,
                        position,
                        size
                    );
                }
            }
        }
        
        // Note: Dont consume the action - let it propagate to other handlers
        return undefined;
    }

    /**
     * Debounced bounds tracking to collect all changes during a drag operation
     */
    private trackBoundsChange(
        elementId: string,
        position: { x: number; y: number },
        size: { width: number; height: number }
    ): void {
        // Store/update the bounds for this element
        this.pendingBounds.set(elementId, { position, size });

        // Clear any pending debounce
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }

        // Set up debounced dispatch
        this.debounceTimeout = setTimeout(() => {
            if (this.pendingBounds.size > 0) {
                // Convert pending bounds to array format
                const newBounds = Array.from(this.pendingBounds.entries()).map(([elementId, bounds]) => ({
                    elementId,
                    newPosition: bounds.position,
                    newSize: bounds.size
                }));

                // Dispatch the tracking action to VSCode extension
                const trackingAction = ElementBoundsTrackingAction.create(newBounds);
                this.actionDispatcher.dispatch(trackingAction);
                
                this.pendingBounds.clear();
            }
            this.debounceTimeout = null;
        }, this.DEBOUNCE_MS);
    }
}
