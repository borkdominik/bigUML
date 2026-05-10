/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import {
    RequestPropertyPaletteAction,
    SetNavigationIdNotification,
    SetPropertyPaletteAction,
    UpdateElementPropertyAction
} from '@borkdominik-biguml/big-property-palette';
import { ActionWebviewProtocol } from '@borkdominik-biguml/big-vscode';
import type { WebviewMessenger, WebviewViewProviderOptions } from '@borkdominik-biguml/big-vscode/vscode';
import {
    TYPES,
    WebviewViewProvider,
    type ActionDispatcher,
    type CacheActionListener,
    type ConnectionManager,
    type GlspModelState,
    type SelectionService
} from '@borkdominik-biguml/big-vscode/vscode';
import { DisposableCollection } from '@eclipse-glsp/vscode-integration';
import { inject, injectable, optional, postConstruct } from 'inversify';
import type { Disposable } from 'vscode';

@injectable()
export class PropertyPaletteWebviewViewProvider extends WebviewViewProvider {
    @inject(TYPES.ConnectionManager)
    protected readonly connectionManager: ConnectionManager;

    @inject(TYPES.GlspModelState)
    protected readonly modelState: GlspModelState;

    @inject(TYPES.ActionDispatcher)
    protected readonly actionDispatcher: ActionDispatcher;

    @inject(TYPES.SelectionService)
    protected readonly selectionService: SelectionService;

    // Optional injection of InteractionTracker - won't fail if not available
    @inject('InteractionTracker')
    @optional()
    protected interactionTracker?: any;

    protected actionCache: CacheActionListener;
    protected selectedId?: string;

    constructor(@inject(TYPES.WebviewViewOptions) options: WebviewViewProviderOptions) {
        super({
            viewId: options.viewType,
            viewType: options.viewType,
            htmlOptions: {
                files: {
                    js: [['property-palette', 'bundle.js']],
                    css: [['property-palette', 'bundle.css']]
                }
            }
        });
    }

    @postConstruct()
    protected init(): void {
        this.actionCache = this.actionListener.createCache([SetPropertyPaletteAction.KIND]);
        this.toDispose.push(this.actionCache);
    }

    protected override resolveWebviewProtocol(messenger: WebviewMessenger): Disposable {
        const disposables = new DisposableCollection();
        disposables.push(
            super.resolveWebviewProtocol(messenger),
            this.actionCache.onDidChange(message => this.actionMessenger.dispatch(message)),
            messenger.onNotification(SetNavigationIdNotification, id => {
                this.selectedId = id ?? this.selectionService.selection?.selectedElementsIDs[0];
            }),
            this.selectionService.onDidSelectionChange(event => {
                this.selectedId = event.state.selectedElementsIDs[0];
                this.requestPropertyPalette();
            }),
            this.connectionManager.onNoConnection(() => {
                this.actionMessenger.dispatch(SetPropertyPaletteAction.create());
            }),
            this.modelState.onDidChangeModelState(() => {
                this.requestPropertyPalette();
            }),
            // Track property changes from webview
            messenger.onNotification(ActionWebviewProtocol.Message, message => {
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
                        isOperation: true // Mark as server operation
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
        return disposables;
    }

    protected override handleOnReady(): void {
        const selection = this.selectionService.selection;
        if (selection && selection.selectedElementsIDs.length > 0) {
            this.selectedId = selection.selectedElementsIDs[0];
            this.requestPropertyPalette();
        }
    }

    protected override handleOnVisible(): void {
        this.actionMessenger.dispatch(this.actionCache.getActions());
    }

    protected requestPropertyPalette(elementId = this.selectedId): void {
        this.actionDispatcher.dispatch(
            RequestPropertyPaletteAction.create({
                elementId
            })
        );
    }
}
