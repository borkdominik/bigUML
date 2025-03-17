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
import { HelloWorldActionResponse, RequestHelloWorldAction } from '../common/hello-world.action.js';

export const HelloWorldViewId = Symbol('HelloWorldViewId');

@injectable()
export class HelloWorldProvider extends BIGReactWebview {
    @inject(HelloWorldViewId)
    viewId: string;

    protected override cssPath = ['hello-world', 'bundle.css'];
    protected override jsPath = ['hello-world', 'bundle.js'];
    protected readonly actionCache = this.actionListener.createCache([HelloWorldActionResponse.KIND]);

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
                this.webviewConnector.dispatch(HelloWorldActionResponse.create());
            }),
            this.connectionManager.onNoConnection(() => {
                // Send a message to the webview when there is no glsp client
                this.webviewConnector.dispatch(HelloWorldActionResponse.create());
            }),
            this.modelState.onDidChangeModelState(() => {
                this.requestCount();
            })
        );
    }

    protected requestCount(): void {
        this.actionDispatcher.dispatch(
            RequestHelloWorldAction.create({
                increase: 0
            })
        );
    }
}
