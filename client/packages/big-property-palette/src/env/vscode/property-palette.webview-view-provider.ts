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
    SetPropertyPaletteAction
} from '@borkdominik-biguml/big-property-palette';
import type { WebviewMessenger, WebviewViewProviderOptions } from '@borkdominik-biguml/big-vscode/vscode';
import {
    type ActionDispatcher,
    type CacheActionListener,
    type ConnectionManager,
    type GLSPServerModelState,
    type SelectionService,
    TYPES,
    WebviewViewProvider
} from '@borkdominik-biguml/big-vscode/vscode';
import { DisposableCollection } from '@eclipse-glsp/vscode-integration';
import { inject, injectable, postConstruct } from 'inversify';
import type { Disposable } from 'vscode';

@injectable()
export class PropertyPaletteWebviewViewProvider extends WebviewViewProvider {
    @inject(TYPES.ConnectionManager)
    protected readonly connectionManager: ConnectionManager;

    @inject(TYPES.GLSPServerModelState)
    protected readonly modelState: GLSPServerModelState;

    @inject(TYPES.ActionDispatcher)
    protected readonly actionDispatcher: ActionDispatcher;

    @inject(TYPES.SelectionService)
    protected readonly selectionService: SelectionService;

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
