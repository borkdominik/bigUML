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
    type IActionDispatcher,
    type GModelElement,
    MouseListener,
    findParentByFeature,
    isSelectable,
    TYPES
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { MouseClickTrackingAction, MousePositionTrackingAction } from '../common/interaction-tracking.action.js';

/**
 * Mouse listener that captures mouse click events on the diagram canvas
 * and dispatches them to the VSCode extension for tracking.
 * 
 * Captures three types of coordinates:
 * - Screen coordinates (screenX, screenY): Absolute position on the entire screen - use for eye-tracking correlation
 * - Client coordinates (clientX, clientY): Position relative to browser viewport
 * - Canvas coordinates (canvasX, canvasY): Position relative to the diagram SVG canvas
 */
@injectable()
export class MouseClickTrackingHandler extends MouseListener {
    @inject(TYPES.IActionDispatcher)
    protected actionDispatcher: IActionDispatcher;

    // Track double-click timing
    private lastClickTime = 0;
    private readonly DOUBLE_CLICK_THRESHOLD_MS = 300;

    // Debounce for mouse position tracking (to avoid flooding)
    private positionDebounceTimeout: ReturnType<typeof setTimeout> | null = null;
    private readonly POSITION_DEBOUNCE_MS = 100; // Track position max 10 times per second
    private lastTrackedEvent: MouseEvent | null = null;
    private lastTrackedElement: GModelElement | null = null;

    /**
     * Handle mouse down events (captures clicks)
     */
    override mouseDown(target: GModelElement, event: MouseEvent): (Action | Promise<Action>)[] {
        // Get all coordinate types
        const canvasPosition = this.getCanvasPosition(event);
        const canvasBounds = this.getCanvasBounds(event);
        
        // Determine which button was clicked
        const button = this.getButtonType(event.button);
        
        // Check for double-click
        const now = Date.now();
        const isDoubleClick = (now - this.lastClickTime) < this.DOUBLE_CLICK_THRESHOLD_MS;
        this.lastClickTime = now;

        // Find the selectable element (if any)
        const selectableElement = findParentByFeature(target, isSelectable);
        
        // Create and dispatch the tracking action with all coordinate types
        const trackingAction = MouseClickTrackingAction.create({
            // Canvas-relative coordinates (for diagram analysis)
            canvasX: canvasPosition.x,
            canvasY: canvasPosition.y,
            // Screen coordinates (for eye-tracking correlation)
            screenX: event.screenX,
            screenY: event.screenY,
            // Client/viewport coordinates
            clientX: event.clientX,
            clientY: event.clientY,
            button,
            elementId: selectableElement?.id,
            elementType: selectableElement?.type,
            isDoubleClick,
            modifiers: {
                ctrl: event.ctrlKey,
                shift: event.shiftKey,
                alt: event.altKey,
                meta: event.metaKey
            },
            canvasBounds
        });

        this.actionDispatcher.dispatch(trackingAction);

        // Return empty array - don't consume the event, let it propagate
        return [];
    }

    /**
     * Handle mouse move events for position tracking
     * Uses debouncing to avoid flooding with events
     */
    override mouseMove(target: GModelElement, event: MouseEvent): (Action | Promise<Action>)[] {
        // Store the latest event and element
        this.lastTrackedEvent = event;
        this.lastTrackedElement = target;

        // Debounce position tracking
        if (!this.positionDebounceTimeout) {
            this.positionDebounceTimeout = setTimeout(() => {
                if (this.lastTrackedEvent) {
                    const canvasPosition = this.getCanvasPosition(this.lastTrackedEvent);
                    const selectableElement = this.lastTrackedElement 
                        ? findParentByFeature(this.lastTrackedElement, isSelectable)
                        : undefined;

                    const positionAction = MousePositionTrackingAction.create({
                        canvasX: canvasPosition.x,
                        canvasY: canvasPosition.y,
                        screenX: this.lastTrackedEvent.screenX,
                        screenY: this.lastTrackedEvent.screenY,
                        elementId: selectableElement?.id
                    });
                    this.actionDispatcher.dispatch(positionAction);
                }
                this.positionDebounceTimeout = null;
            }, this.POSITION_DEBOUNCE_MS);
        }

        return [];
    }

    /**
     * Convert mouse event button number to button type string
     */
    private getButtonType(button: number): 'left' | 'right' | 'middle' {
        switch (button) {
            case 0:
                return 'left';
            case 1:
                return 'middle';
            case 2:
                return 'right';
            default:
                return 'left';
        }
    }

    /**
     * Get canvas coordinates from a mouse event
     * Returns position relative to the SVG canvas element
     */
    private getCanvasPosition(event: MouseEvent): { x: number; y: number } {
        const target = event.target as Element;
        const svg = target.closest('svg');
        
        if (svg) {
            const rect = svg.getBoundingClientRect();
            return {
                x: Math.round(event.clientX - rect.left),
                y: Math.round(event.clientY - rect.top)
            };
        }

        // Fallback to client coordinates
        return {
            x: Math.round(event.clientX),
            y: Math.round(event.clientY)
        };
    }

    /**
     * Get the canvas bounds in screen coordinates
     * Useful for converting between coordinate systems
     */
    private getCanvasBounds(event: MouseEvent): { screenX: number; screenY: number; width: number; height: number } | undefined {
        const target = event.target as Element;
        const svg = target.closest('svg');
        
        if (svg) {
            const rect = svg.getBoundingClientRect();
            // Convert client coordinates to screen coordinates
            // screenX = clientX + (event.screenX - event.clientX)
            const clientToScreenOffsetX = event.screenX - event.clientX;
            const clientToScreenOffsetY = event.screenY - event.clientY;
            
            return {
                screenX: Math.round(rect.left + clientToScreenOffsetX),
                screenY: Math.round(rect.top + clientToScreenOffsetY),
                width: Math.round(rect.width),
                height: Math.round(rect.height)
            };
        }

        return undefined;
    }
}
