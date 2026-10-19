/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { ApplyTransformationResponse, TransformationPreviewResponse } from '@borkdominik-biguml/big-object-to-class';
import type { WebviewMessenger, WebviewViewProviderOptions } from '@borkdominik-biguml/big-vscode/vscode';
import {
    type ActionDispatcher,
    type CacheActionListener,
    type ConnectionManager,
    TYPES,
    WebviewViewProvider
} from '@borkdominik-biguml/big-vscode/vscode';
import { DisposableCollection } from '@eclipse-glsp/vscode-integration';
import { inject, injectable, postConstruct } from 'inversify';
import type { Disposable } from 'vscode';

@injectable()
export class TransformationPreviewWebviewViewProvider extends WebviewViewProvider {
    @inject(TYPES.ConnectionManager)
    protected readonly connectionManager: ConnectionManager;

    @inject(TYPES.ActionDispatcher)
    protected readonly actionDispatcher: ActionDispatcher;

    protected actionCache: CacheActionListener;

    constructor(@inject(TYPES.WebviewViewOptions) options: WebviewViewProviderOptions) {
        super({
            viewId: options.viewType,
            viewType: options.viewType,
            htmlOptions: {
                files: {
                    js: [['object-to-class', 'bundle.js']],
                    css: [['object-to-class', 'bundle.css']]
                }
            }
        });
    }

    @postConstruct()
    protected init(): void {
        this.actionCache = this.actionListener.createCache([TransformationPreviewResponse.KIND, ApplyTransformationResponse.KIND]);
        this.toDispose.push(this.actionCache);
    }

    protected override resolveWebviewProtocol(messenger: WebviewMessenger): Disposable {
        const disposables = new DisposableCollection();
        disposables.push(
            super.resolveWebviewProtocol(messenger),
            this.actionCache.onDidChange(message => this.actionMessenger.dispatch(message)),

            // Fix: listen to actions coming from VSCode host itself
            this.actionListener.registerVSCodeListener(message => {
                if ([TransformationPreviewResponse.KIND, ApplyTransformationResponse.KIND].includes(message.action.kind)) {
                    this.actionMessenger.dispatch(message);
                }
            }),

            // 1. Listen for when the user clicks a different diagram tab
            this.connectionManager.onDidActiveClientChange(client => {
                this.actionMessenger.dispatch({
                    kind: 'sync-connection',
                    clientId: client.clientId
                } as any);
            }),

            // 2. Clear the connection if all diagrams are closed
            this.connectionManager.onNoConnection(() => {
                this.actionMessenger.dispatch({
                    kind: 'sync-connection',
                    clientId: undefined
                } as any);
            })
        );
        return disposables;
    }

    protected override handleOnReady(): void {
        super.handleOnReady();

        // 3. If a diagram is already active when the sidebar opens, sync it immediately
        const activeClient = this.connectionManager.activeClient;
        if (activeClient) {
            this.actionMessenger.dispatch({
                kind: 'sync-connection',
                clientId: activeClient.clientId
            } as any);
        }

        this.actionMessenger.dispatch(this.actionCache.getActions());
    }

    protected override handleOnVisible(): void {
        super.handleOnVisible();
        this.actionMessenger.dispatch(this.actionCache.getActions());
    }
}
