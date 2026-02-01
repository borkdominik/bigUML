/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { BIGReactWebview } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { InitializeCanvasBoundsAction } from '@borkdominik-biguml/uml-protocol';
import { SetViewportAction } from '@eclipse-glsp/protocol';
import { inject, injectable, postConstruct } from 'inversify';
import { MinimapExportSvgAction, RequestMinimapExportSvgAction } from '../common/index.js';

export const MinimapViewId = Symbol('MinimapViewId');

@injectable()
export class MinimapProvider extends BIGReactWebview {
    @inject(MinimapViewId)
    viewId: string;

    protected override cssPath = ['minimap', 'bundle.css'];
    protected override jsPath = ['minimap', 'bundle.js'];
    protected readonly actionCache = this.actionListener.createCache([
        InitializeCanvasBoundsAction.KIND,
        SetViewportAction.KIND,
        MinimapExportSvgAction.KIND
    ]);

    @postConstruct()
    protected override init(): void {
        super.init();

        this.toDispose.push(this.actionCache);
    }

    protected override handleConnection(): void {
        super.handleConnection();

        this.toDispose.push(
            this.actionCache.onDidChange(message => this.webviewConnector.dispatch(message)),
            this.webviewConnector.onReady(() => {
                this.requestSVG();
                this.webviewConnector.dispatch(this.actionCache.getActions());
            }),
            this.webviewConnector.onVisible(() => this.webviewConnector.dispatch(this.actionCache.getActions())),
            this.connectionManager.onDidActiveClientChange(() => {
                this.requestSVG();
            }),
            this.connectionManager.onNoActiveClient(() => {
                this.webviewConnector.dispatch(MinimapExportSvgAction.create());
            }),
            this.connectionManager.onNoConnection(() => {
                this.webviewConnector.dispatch(MinimapExportSvgAction.create());
            }),
            this.modelState.onDidChangeModelState(() => {
                this.requestSVG();
            })
        );
    }

    protected requestSVG(): void {
        // Wait for updates to be applied
        setTimeout(async () => {
            this.actionDispatcher.dispatch(RequestMinimapExportSvgAction.create());
        }, 200);
    }
}
