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
import { GlspEditorProvider } from '@eclipse-glsp/vscode-integration/lib/quickstart-components';
import { inject, injectable, postConstruct } from 'inversify';
import * as vscode from 'vscode';
import { FEATURE_TYPES, TYPES, VSCODE_TYPES } from '../../di.types';
import { ThemeIntegration } from '../../features/theme/theme-integration';
import { UVGlspConnector } from '../../glsp/uv-glsp-connector';
import { VSCodeSettings } from '../../language';

@injectable()
export class EditorProvider extends GlspEditorProvider {
    diagramType = 'umldiagram';

    constructor(
        @inject(VSCODE_TYPES.ExtensionContext) protected readonly context: vscode.ExtensionContext,
        @inject(TYPES.Connector) protected override readonly glspVscodeConnector: UVGlspConnector,
        @inject(FEATURE_TYPES.Theme) protected readonly themeIntegration: ThemeIntegration
    ) {
        super(glspVscodeConnector);
    }

    @postConstruct()
    initialize(): void {
        const disposable = vscode.window.registerCustomEditorProvider(VSCodeSettings.editor.viewType, this, {
            webviewOptions: { retainContextWhenHidden: true },
            supportsMultipleEditorsPerDocument: false
        });
        this.context.subscriptions.push(disposable);
    }

    setUpWebview(
        _document: vscode.CustomDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken,
        clientId: string
    ): void {
        this.themeIntegration.refresh();

        const webview = webviewPanel.webview;
        const extensionUri = this.context.extensionUri;
        const webviewScriptSourceUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'webview', 'webview.js'));
        const codiconsUri = webview.asWebviewUri(
            vscode.Uri.joinPath(extensionUri, 'node_modules', '@vscode/codicons', 'dist', 'codicon.css')
        );
        const mainCSSUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'lib', 'main.css'));

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
                default-src http://*.fontawesome.com  ${webview.cspSource} data: 'unsafe-inline' 'unsafe-eval';
                ">
				<link href="${codiconsUri}" rel="stylesheet" />
				<link href="${mainCSSUri}" rel="stylesheet" />

                </head>
                <body style="overflow: hidden;">
                    <div id="${clientId}_container" style="height: 100%;"></div>
                    <script src="${webviewScriptSourceUri}"></script>
                </body>
            </html>`;
    }
}
