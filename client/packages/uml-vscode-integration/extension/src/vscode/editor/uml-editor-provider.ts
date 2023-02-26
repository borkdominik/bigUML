/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.01
 ********************************************************************************/
import { ActionMessage, GLSPDiagramIdentifier, GlspVscodeConnector } from '@eclipse-glsp/vscode-integration';
import { GlspEditorProvider } from '@eclipse-glsp/vscode-integration/lib/quickstart-components';
import { isWebviewReadyMessage } from 'sprotty-vscode-protocol';
import * as vscode from 'vscode';
import { ThemeManager } from '../theme-manager/theme-manager';

export default class UmlEditorProvider extends GlspEditorProvider {
    diagramType = 'umldiagram';

    protected readonly themeManager = new ThemeManager();

    constructor(
        protected readonly extensionContext: vscode.ExtensionContext,
        protected override readonly glspVscodeConnector: GlspVscodeConnector
    ) {
        super(glspVscodeConnector);
    }

    setUpWebview(
        _document: vscode.CustomDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken,
        clientId: string
    ): void {
        const webview = webviewPanel.webview;
        const extensionUri = this.extensionContext.extensionUri;
        const webviewScriptSourceUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'pack', 'webview.js'));
        const codiconsUri = webview.asWebviewUri(
            vscode.Uri.joinPath(extensionUri, 'node_modules', '@vscode/codicons', 'dist', 'codicon.css')
        );
        const mainCSSUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'lib', 'main.css'));

        this.themeManager.dispose();
        this.themeManager.initialize();
        this.themeManager.onChange(e => this.themeManager.updateTheme(vscode.window.activeColorTheme.kind));

        webviewPanel.webview.options = {
            enableScripts: true
        };

        webviewPanel.webview.html = `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, height=device-height">
					<meta http-equiv="Content-Security-Policy" content="
                default-src http://*.fontawesome.com  ${webview.cspSource} 'unsafe-inline' 'unsafe-eval';
                ">
				<link href="${codiconsUri}" rel="stylesheet" />
				<link href="${mainCSSUri}" rel="stylesheet" />

                </head>
                <body>
                    <div id="${clientId}_container" style="height: 100%;"></div>
                    <script src="${webviewScriptSourceUri}"></script>
                </body>
            </html>`;
    }

    override async resolveCustomEditor(
        document: vscode.CustomDocument,
        webviewPanel: vscode.WebviewPanel,
        token: vscode.CancellationToken
    ): Promise<void> {
        // This is used to initialize GLSP for our diagram
        const diagramIdentifier: GLSPDiagramIdentifier = {
            diagramType: this.diagramType,
            uri: serializeUri(document.uri),
            clientId: `${this.diagramType}:${serializeUri(document.uri)}`
        };

        // Promise that resolves when sprotty sends its ready-message
        const webviewReadyPromise = new Promise<void>(resolve => {
            const messageListener = webviewPanel.webview.onDidReceiveMessage((message: unknown) => {
                if (isWebviewReadyMessage(message)) {
                    resolve();
                    messageListener.dispose();
                }
            });
        });

        const sendMessageToWebview = async (message: unknown): Promise<void> => {
            webviewReadyPromise.then(() => {
                if (webviewPanel.active) {
                    webviewPanel.webview.postMessage(message);
                } else {
                    console.log('Message stalled for webview:', document.uri.path, message);
                    const viewStateListener = webviewPanel.onDidChangeViewState(() => {
                        viewStateListener.dispose();
                        sendMessageToWebview(message);
                    });
                }
            });
        };

        const receiveMessageFromServerEmitter = new vscode.EventEmitter<unknown>();
        const sendMessageToServerEmitter = new vscode.EventEmitter<unknown>();

        webviewPanel.onDidDispose(() => {
            receiveMessageFromServerEmitter.dispose();
            sendMessageToServerEmitter.dispose();
        });

        // Listen for Messages from webview (only after ready-message has been received)
        webviewReadyPromise.then(() => {
            webviewPanel.webview.onDidReceiveMessage((message: unknown) => {
                if (ActionMessage.is(message)) {
                    sendMessageToServerEmitter.fire(message);
                }
            });
        });

        // Listen for Messages from server
        receiveMessageFromServerEmitter.event(message => {
            if (ActionMessage.is(message)) {
                sendMessageToWebview(message);
            }
        });

        // Register document/diagram panel/model in vscode connector
        const initializeResult = await this.glspVscodeConnector.registerClient({
            clientId: diagramIdentifier.clientId,
            diagramType: diagramIdentifier.diagramType,
            document: document,
            webviewPanel: webviewPanel,
            onClientMessage: sendMessageToServerEmitter.event,
            onSendToClientEmitter: receiveMessageFromServerEmitter
        });

        diagramIdentifier.initializeResult = initializeResult;
        // Initialize diagram
        sendMessageToWebview(diagramIdentifier);

        this.setUpWebview(document, webviewPanel, token, diagramIdentifier.clientId);
    }
}

function serializeUri(uri: vscode.Uri): string {
    let uriString = uri.toString();
    const match = uriString.match(/file:\/\/\/([a-z])%3A/i);
    if (match) {
        uriString = 'file:///' + match[1] + ':' + uriString.substring(match[0].length);
    }
    return uriString;
}
