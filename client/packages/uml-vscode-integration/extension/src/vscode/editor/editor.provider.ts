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
import URI from 'urijs';
import * as vscode from 'vscode';
import { FEATURE_TYPES, TYPES, VSCODE_TYPES } from '../../di.types';
import { ThemeIntegration } from '../../features/theme/theme-integration';
import { UVGlspConnector } from '../../glsp/uv-glsp-connector';
import { VSCodeSettings } from '../../language';
import { UVModelServerClient } from '../../modelserver/uv-modelserver.client';

@injectable()
export class EditorProvider extends GlspEditorProvider {
    diagramType = 'umldiagram';

    constructor(
        @inject(VSCODE_TYPES.ExtensionContext) protected readonly context: vscode.ExtensionContext,
        @inject(TYPES.Connector) protected override readonly glspVscodeConnector: UVGlspConnector,
        @inject(TYPES.ModelServerClient) protected readonly modelServerClient: UVModelServerClient,
        @inject(FEATURE_TYPES.Theme) protected readonly themeIntegration: ThemeIntegration
    ) {
        super(glspVscodeConnector);

        this.setUpModelServer();
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
        this.setUpTheme();

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

    protected setUpTheme(): void {
        this.themeIntegration.dispose();
        this.themeIntegration.initialize();
        this.themeIntegration.onChange(e => this.themeIntegration.updateTheme(vscode.window.activeColorTheme));
    }

    protected setUpModelServer(): void {
        const workspaces = vscode.workspace.workspaceFolders;
        if (workspaces && workspaces.length > 0) {
            const workspaceRoot = new URI(workspaces[0].uri.toString());
            const uiSchemaFolder = workspaceRoot.clone().segment('.ui-schemas');

            this.modelServerClient.configureServer({
                workspaceRoot,
                uiSchemaFolder
            });
        }
    }
}
