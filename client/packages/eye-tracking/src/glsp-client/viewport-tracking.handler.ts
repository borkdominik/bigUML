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
    SetViewportAction,
    ViewportResult,
    TYPES
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { ViewportTrackingAction } from '../common/interaction-tracking.action.js';

/**
 * Handler that captures viewport changes (pan/zoom) in the GLSP client
 * and dispatches them to the VSCode extension for tracking
 */
@injectable()
export class ViewportTrackingHandler implements IActionHandler {
    @inject(TYPES.IActionDispatcher)
    protected actionDispatcher: IActionDispatcher;

    // Debounce settings to prevent flooding
    private debounceTimeout: ReturnType<typeof setTimeout> | null = null;
    private readonly DEBOUNCE_MS = 50;
    private lastViewport: { scroll: { x: number; y: number }; zoom: number } | null = null;

    handle(action: Action): ICommand | Action | void {
        if (SetViewportAction.is(action)) {
            // SetViewportAction contains the new viewport state
            const viewport = action.newViewport;
            if (viewport) {
                this.trackViewportChange(viewport.scroll, viewport.zoom);
            }
        } else if (ViewportResult.is(action)) {
            // ViewportResult is returned after requesting the current viewport
            const viewport = action.viewport;
            if (viewport) {
                this.trackViewportChange(viewport.scroll, viewport.zoom);
            }
        }
        
        // Note: Dont consume the action - let it propagate to other handlers
        return undefined;
    }

    /**
     * Debounced viewport tracking to prevent flooding with events during continuous pan/zoom
     */
    private trackViewportChange(scroll: { x: number; y: number }, zoom: number): void {
        // Store the latest viewport state
        this.lastViewport = { scroll, zoom };

        // Clear any pending debounce
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }

        // Set up debounced dispatch
        this.debounceTimeout = setTimeout(() => {
            if (this.lastViewport) {
                // Dispatch the ViewportTrackingAction to VSCode extension
                const trackingAction = ViewportTrackingAction.create(
                    this.lastViewport.scroll,
                    this.lastViewport.zoom
                );
                
                console.log('ViewportTrackingHandler: Dispatching viewport change', trackingAction);
                this.actionDispatcher.dispatch(trackingAction);
                
                this.lastViewport = null;
            }
            this.debounceTimeout = null;
        }, this.DEBOUNCE_MS);
    }
}
