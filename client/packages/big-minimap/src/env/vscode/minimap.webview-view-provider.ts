/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { WebviewMessenger, WebviewViewProviderOptions } from '@borkdominik-biguml/big-vscode/vscode';
import {
    type ActionDispatcher,
    type CacheActionListener,
    type ConnectionManager,
    type GlspModelState,
    TYPES,
    WebviewViewProvider
} from '@borkdominik-biguml/big-vscode/vscode';
import { InitializeCanvasBoundsAction } from '@borkdominik-biguml/uml-glsp-server';
import { SetViewportAction } from '@eclipse-glsp/protocol';
import { DisposableCollection } from '@eclipse-glsp/vscode-integration';
import { inject, injectable, postConstruct } from 'inversify';
import type { Disposable } from 'vscode';
import { MinimapExportSvgAction, RequestMinimapExportSvgAction } from '../common/index.js';

@injectable()
export class MinimapWebviewViewProvider extends WebviewViewProvider {
    @inject(TYPES.ConnectionManager)
    protected readonly connectionManager: ConnectionManager;

    @inject(TYPES.GlspModelState)
    protected readonly modelState: GlspModelState;

    @inject(TYPES.ActionDispatcher)
    protected readonly actionDispatcher: ActionDispatcher;

    protected actionCache: CacheActionListener;

    constructor(@inject(TYPES.WebviewViewOptions) options: WebviewViewProviderOptions) {
        super({
            viewId: options.viewType,
            viewType: options.viewType,
            htmlOptions: {
                files: {
                    js: [['minimap', 'bundle.js']],
                    css: [['minimap', 'bundle.css']]
                }
            }
        });
    }

    @postConstruct()
    protected init(): void {
        this.actionCache = this.actionListener.createCache([
            InitializeCanvasBoundsAction.KIND,
            SetViewportAction.KIND,
            MinimapExportSvgAction.KIND
        ]);
        this.toDispose.push(this.actionCache);
    }

    protected override resolveWebviewProtocol(messenger: WebviewMessenger): Disposable {
        const disposables = new DisposableCollection();
        disposables.push(
            super.resolveWebviewProtocol(messenger),
            this.actionCache.onDidChange(message => this.actionMessenger.dispatch(message)),
            this.connectionManager.onDidActiveClientChange(() => this.requestSVG()),
            this.connectionManager.onNoActiveClient(() => this.actionMessenger.dispatch(MinimapExportSvgAction.create())),
            this.connectionManager.onNoConnection(() => this.actionMessenger.dispatch(MinimapExportSvgAction.create())),
            this.modelState.onDidChangeModelState(() => this.requestSVG())
        );
        return disposables;
    }

    protected override handleOnReady(): void {
        this.requestSVG();
        this.actionMessenger.dispatch(this.actionCache.getActions());
    }

    protected override handleOnVisible(): void {
        this.actionMessenger.dispatch(this.actionCache.getActions());
    }

    protected requestSVG(): void {
        // Wait for updates to be applied
        setTimeout(async () => {
            this.actionDispatcher.dispatch(RequestMinimapExportSvgAction.create());
        }, 200);
    }
}
