/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { BIGReactWebview } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { inject, injectable, postConstruct } from 'inversify';
import { AdvancedSearchActionResponse, RequestAdvancedSearchAction } from '../common/advancedsearch.action.js';

export const AdvancedSearchViewId = Symbol('AdvancedSearchViewId');

@injectable()
export class AdvancedSearchProvider extends BIGReactWebview {
    @inject(AdvancedSearchViewId)
    viewId: string;

    protected override cssPath = ['advancedsearch', 'bundle.css'];
    protected override jsPath = ['advancedsearch', 'bundle.js'];
    protected readonly actionCache = this.actionListener.createCache([AdvancedSearchActionResponse.KIND]);

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
                this.requestCount();
                this.webviewConnector.dispatch(this.actionCache.getActions());
            }),
            this.webviewConnector.onVisible(() => this.webviewConnector.dispatch(this.actionCache.getActions())),
            this.connectionManager.onDidActiveClientChange(() => {
                this.requestCount();
            }),
            this.connectionManager.onNoActiveClient(() => {
                // Send a message to the webview when there is no active client
                this.webviewConnector.dispatch(AdvancedSearchActionResponse.create());
            }),
            this.connectionManager.onNoConnection(() => {
                // Send a message to the webview when there is no glsp client
                this.webviewConnector.dispatch(AdvancedSearchActionResponse.create());
            }),
            this.modelState.onDidChangeModelState(() => {
                this.requestCount();
            })
        );
    }

    protected requestCount(): void {
        this.actionDispatcher.dispatch(
            RequestAdvancedSearchAction.create({
                increase: 0
            })
        );
    }
}
