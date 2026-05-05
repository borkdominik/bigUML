/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { getDefined } from '@borkdominik-biguml/big-common';
import type { MaybePromise } from '@eclipse-glsp/vscode-integration';
import { injectable } from 'inversify';
import {
    EventEmitter,
    type CancellationToken,
    type CustomDocument,
    type CustomDocumentBackup,
    type CustomDocumentBackupContext,
    type CustomDocumentEditEvent,
    type CustomDocumentOpenContext,
    type CustomEditorProvider,
    type Uri,
    type WebviewPanel,
    type window
} from 'vscode';
import { BaseWebviewProvider } from '../base/base-webview.provider.js';

export interface WebviewEditorProviderOptions {
    retainContextWhenHidden?: boolean;
    supportsMultipleEditorsPerDocument?: boolean;
}

type RegisterCustomEditorProviderOptions = Parameters<typeof window.registerCustomEditorProvider>[2];

@injectable()
export abstract class WebviewEditorProvider extends BaseWebviewProvider implements CustomEditorProvider {
    protected _webviewPanel?: WebviewPanel;

    get webviewPanel() {
        return getDefined(this._webviewPanel, 'Webview panel is not resolved yet');
    }

    getWebviewOptions(): RegisterCustomEditorProviderOptions {
        return {
            webviewOptions: {
                retainContextWhenHidden: true
            },
            supportsMultipleEditorsPerDocument: false
        };
    }

    private readonly _onDidChangeCustomDocument = new EventEmitter<CustomDocumentEditEvent<CustomDocument>>();

    get onDidChangeCustomDocument() {
        return this._onDidChangeCustomDocument.event;
    }

    openCustomDocument(uri: Uri, _openContext: CustomDocumentOpenContext, _token: CancellationToken): CustomDocument {
        return { uri, dispose: () => {} };
    }

    resolveCustomEditor(document: CustomDocument, webviewPanel: WebviewPanel, _token: CancellationToken): MaybePromise<void> {
        this._webviewPanel = webviewPanel;
        const webview = webviewPanel.webview;

        webview.options = {
            enableScripts: true,
            localResourceRoots: [this.extensionContext.extensionUri]
        };

        this.resolveMessenger(webviewPanel);

        webview.html = this.resolveHtml(webview, document);
    }

    saveCustomDocument(_document: CustomDocument, _cancellation: CancellationToken): Thenable<void> {
        return Promise.resolve();
    }

    saveCustomDocumentAs(_document: CustomDocument, _destination: Uri, _cancellation: CancellationToken): Thenable<void> {
        return Promise.resolve();
    }

    revertCustomDocument(_document: CustomDocument, _cancellation: CancellationToken): Thenable<void> {
        return Promise.resolve();
    }

    backupCustomDocument(
        _document: CustomDocument,
        _context: CustomDocumentBackupContext,
        _cancellation: CancellationToken
    ): Thenable<CustomDocumentBackup> {
        return Promise.resolve({ id: '', delete: () => {} });
    }
}
