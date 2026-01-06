/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { BIGReactWebview } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { inject, injectable, optional, postConstruct } from 'inversify';
import { RequestPropertyPaletteAction, SetPropertyPaletteAction, UpdateElementPropertyAction } from '../common/index.js';
import { SetNavigationIdNotification } from '../common/protocol.js';

export const PropertyPaletteViewId = Symbol('PropertyPaletteViewId');

@injectable()
export class PropertyPaletteProvider extends BIGReactWebview {
    @inject(PropertyPaletteViewId)
    viewId: string;

    // Optional injection of InteractionTracker - won't fail if not available
    @inject('InteractionTracker') @optional()
    protected interactionTracker?: any;

    protected override cssPath = ['property-palette', 'bundle.css'];
    protected override jsPath = ['property-palette', 'bundle.js'];
    protected readonly actionCache = this.actionListener.createCache([SetPropertyPaletteAction.KIND]);
    protected selectedId?: string;

    @postConstruct()
    protected override init(): void {
        super.init();

        this.toDispose.push(this.actionCache);
    }

    protected override handleConnection(): void {
        super.handleConnection();

        this.toDispose.push(
            this.actionCache.onDidChange(message => this.webviewConnector.dispatch(message)),
            this.webviewConnector.onReady(async () => {
                const selection = this.selectionService.selection;
                if (selection && selection.selectedElementsIDs.length > 0) {
                    this.selectedId = selection.selectedElementsIDs[0];
                    this.requestPropertyPalette();
                }
            }),
            this.webviewConnector.onVisible(() => this.webviewConnector.dispatch(this.actionCache.getActions())),
            this.webviewConnector.registerNotificationListener(SetNavigationIdNotification, id => {
                this.selectedId = id ?? this.selectionService.selection?.selectedElementsIDs[0];
            }),
            this.selectionService.onDidSelectionChange(event => {
                this.selectedId = event.state.selectedElementsIDs[0];
                this.requestPropertyPalette();
            }),
            this.connectionManager.onNoConnection(() => {
                this.webviewConnector.dispatch(SetPropertyPaletteAction.create());
            }),
            this.modelState.onDidChangeModelState(() => {
                this.requestPropertyPalette();
            }),
            // Track property changes from webview
            this.webviewConnector.onActionMessage(message => {
                if (UpdateElementPropertyAction.is(message.action)) {

                    
                    // Track this action for interaction logging
                    if (this.interactionTracker && typeof this.interactionTracker.trackAction === 'function') {
                        console.log('Tracking updateElementProperty action');
                        this.interactionTracker.trackAction(message.action);
                    } else {
                        console.log('InteractionTracker not available or trackAction method missing');
                    }
                    
                    // Mark as operation and dispatch to server
                    const serverAction = {
                        ...message.action,
                        isOperation: true  // Mark as server operation
                    };
                    console.log('Sending updateElementProperty to server:', serverAction);
                    this.actionDispatcher.dispatch(serverAction);
                } else if (message.action?.kind === 'createNode') {
                    console.log('Property CREATE detected:', JSON.stringify(message.action, null, 2));
                    
                    // Track createNode actions from property palette
                    // Try not to dispatch again - it's already being dispatched somewhere else
                    if (this.interactionTracker && typeof this.interactionTracker.trackAction === 'function') {
                        console.log('Tracking createNode action from property palette');
                        this.interactionTracker.trackAction(message.action);
                    }
                    
                } else {
                    console.log('Not an UpdateElementPropertyAction or createNode, got:', message?.action?.kind);
                }
            })
        );
    }

    protected requestPropertyPalette(elementId = this.selectedId): void {
        this.actionDispatcher.dispatch(
            RequestPropertyPaletteAction.create({
                elementId
            })
        );
    }
}
