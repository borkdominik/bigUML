/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { Disposable } from '@eclipse-glsp/vscode-integration';
import { DisposableCollection } from '@eclipse-glsp/vscode-integration';
import { inject, injectable } from 'inversify';
import * as vscode from 'vscode';
import { WebviewProtocol } from '../../../../common/index.js';
import { TYPES } from '../../../vscode-common.types.js';
import type { ActionListener } from '../../action/action-listener.js';
import type { BIGGLSPVSCodeConnector } from '../../connector/glsp-vscode-connector.js';
import type { WebviewProviderOptions } from '../webview.types.js';
import type { ActionWebviewMessenger } from './webview-action-messenger.js';
import { ReactHtmlProvider } from './webview-html-provider.js';
import type { WebviewMessenger } from './webview-messenger.js';

@injectable()
export abstract class BaseWebviewProvider implements Disposable {
    @inject(TYPES.GLSPVSCodeConnector)
    protected readonly connector: BIGGLSPVSCodeConnector;

    @inject(TYPES.ExtensionContext)
    protected readonly extensionContext: vscode.ExtensionContext;

    @inject(TYPES.WebviewMessenger)
    protected readonly webviewMessenger: WebviewMessenger;

    @inject(TYPES.ActionWebviewMessenger)
    protected readonly actionMessenger: ActionWebviewMessenger;

    @inject(TYPES.ActionListener)
    protected readonly actionListener: ActionListener;

    protected readonly toDispose = new DisposableCollection();

    protected readonly onDidChangeVisibilityEmitter = new vscode.EventEmitter<boolean>();
    readonly onDidChangeVisibility = this.onDidChangeVisibilityEmitter.event;

    protected readonly onVisibleEmitter = new vscode.EventEmitter<void>();
    readonly onVisible = this.onVisibleEmitter.event;

    protected readonly onHideEmitter = new vscode.EventEmitter<void>();
    readonly onHide = this.onHideEmitter.event;

    get viewId(): string {
        return this.options.viewId;
    }

    get viewType(): string {
        return this.options.viewType;
    }

    constructor(protected readonly options: WebviewProviderOptions) {}

    dispose(): void {
        this.toDispose.dispose();
    }

    protected resolveMessenger(webview: vscode.WebviewView | vscode.WebviewPanel): void {
        this.webviewMessenger.resolve(webview);
        this.actionMessenger.resolve();

        this.toDispose.push(
            this.webviewMessenger,
            this.actionMessenger,
            this.resolveWebviewProtocol(this.webviewMessenger),
            this.resolveActionProtocol(this.actionMessenger),
            this.resolveWebviewEvents(webview)
        );
    }

    protected resolveHtml(webview: vscode.Webview, _context: any): string {
        const provider = new ReactHtmlProvider(this.options.htmlOptions);

        return provider.createHtml(this.extensionContext, webview);
    }

    protected resolveWebviewProtocol(messenger: WebviewMessenger): Disposable {
        const disposables = new DisposableCollection();
        disposables.push(messenger.onNotification(WebviewProtocol.Ready, () => this.handleOnReady()));
        return disposables;
    }

    protected resolveActionProtocol(_messenger: ActionWebviewMessenger): Disposable {
        const disposables = new DisposableCollection();
        return disposables;
    }

    protected resolveWebviewEvents(webview: vscode.WebviewView | vscode.WebviewPanel): Disposable {
        const disposables = new DisposableCollection();

        disposables.push(
            this.onVisible(() => this.handleOnVisible()),
            this.onHide(() => this.handleOnHide())
        );

        if ('onDidChangeViewState' in webview) {
            disposables.push(
                webview.onDidChangeViewState(() => {
                    this.onDidChangeVisibilityEmitter.fire(webview.visible);
                    if (webview.visible) {
                        this.onVisibleEmitter.fire();
                    } else {
                        this.onHideEmitter.fire();
                    }
                })
            );
        } else {
            disposables.push(
                webview.onDidChangeVisibility(() => {
                    this.onDidChangeVisibilityEmitter.fire(webview.visible);
                    if (webview.visible) {
                        this.onVisibleEmitter.fire();
                    } else {
                        this.onHideEmitter.fire();
                    }
                })
            );
        }

        return disposables;
    }

    protected handleOnReady(): void {
        // Can be overridden by subclasses to react on the webview being ready
    }

    protected handleOnVisible(): void {
        // Can be overridden by subclasses to react on the webview becoming visible
    }

    protected handleOnHide(): void {
        // Can be overridden by subclasses to react on the webview becoming hidden
    }
}
