/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

// import { RefreshPropertyPaletteAction, SetPropertyPaletteAction } from '@borkdominik-biguml/uml-protocol';
import { injectable, postConstruct } from 'inversify';
import { VSCodeSettings } from '../../language';
import { getBundleUri, getUri } from '../../utilities/webview';
import { ProviderWebviewContext, UMLWebviewProvider } from '../../vscode/webview/webview-provider';
import { InitializeCanvasBoundsAction, SetViewportAction } from '@eclipse-glsp/client';
import { AudioRecordingCompleteAction, ModelResourcesResponseAction, RequestModelResourcesAction, SetPropertyPaletteAction } from '@borkdominik-biguml/uml-protocol';
import { exec, ChildProcess } from 'child_process';
import * as path from 'path';
import * as vscode from 'vscode';
import * as fs from 'fs';

@injectable()
export class TextInputPaletteProvider extends UMLWebviewProvider {
    private recordingProcess: ChildProcess | null = null;
    private tempDir: string = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '/tmp';
    private fileName: string = 'recording';

    get id(): string {
        return VSCodeSettings.textInputPalette.viewId;
    }

    protected override retainContextWhenHidden = true;

    @postConstruct()
    override init(): void {
        super.init();
        this.extensionHostConnection.cacheActions([InitializeCanvasBoundsAction.KIND, SetViewportAction.KIND, SetPropertyPaletteAction.KIND]);
    }

    protected resolveHTML(providerContext: ProviderWebviewContext): void {
        const webview = providerContext.webviewView.webview;
        const extensionUri = this.extension.extensionUri;

        const codiconsCSSUri = getUri(webview, extensionUri, ['node_modules', '@vscode/codicons', 'dist', 'codicon.css']);
        const bundleJSUri = getBundleUri(webview, extensionUri, ['text-input-palette', 'bundle.js']);

        webview.html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
         
            <link id="codicon-css" href="${codiconsCSSUri}" rel="stylesheet" />
            <title>Text Input Palette</title>
        </head>
        <body>
            <big-text-input-palette-webview></big-text-input-palette-webview>
            <script type="module" src="${bundleJSUri}"></script>
        </body>
        </html>`;
    }

    protected override handleConnection(): void {
        // ==== Webview Extension Host ====
        this.extensionHostConnection.onActionMessage(message => {
            if (ModelResourcesResponseAction.is(message.action)) {
                // =============== FORWARD DATA TO WEBVIEW ===============
                console.log('ModelResourcesResponseAction', message.action);
                this.webviewViewConnection.send(message.action);
            }
        });

        // ==== Webview View Connection ====
        this.webviewViewConnection.onActionMessage(message => {
            console.log("webviewViewConnection.onActionMessage", message.action);
            if (message.action.kind === 'textInputReady') {
                // =============== REQUEST MODEL RESOURCES ===============
                this.extensionHostConnection.send(RequestModelResourcesAction.create());
                this.extensionHostConnection.forwardCachedActionsToWebview();
            } else if (message.action.kind === 'startRecording') {
                this.startRecording();
            } else {
                this.extensionHostConnection.send(message.action);
            }
        });
    }

    // Start Recording Method
    private startRecording(): void {
        try {
            const outputPath = path.join(this.tempDir, `${this.fileName}.wav`);
            this.recordingProcess = exec(
                `sox -d -b 16 -e signed -c 1 -r 16k "${outputPath}" trim 0 5`,
                //`sox -d -b 16 -e signed -c 1 -r 16k "${outputPath}" silence 1 0.5 1% 1 0.5 1%`,
                (error, stdout, stderr) => {
                    if (error) {
                        vscode.window.showErrorMessage(`Recording error: ${error.message}`);
                        console.error(`Error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.trace(`SoX Warning: ${stderr}`);
                    }
                    vscode.window.showInformationMessage(`Recording saved: ${outputPath}`);
                    const fileBuffer = fs.readFileSync(outputPath);
                    const uint8Array = new Uint8Array(fileBuffer); // Convert Buffer to Uint8Array
                    const action = AudioRecordingCompleteAction.create(outputPath, uint8Array);
                    this.webviewViewConnection.send(action);
                    // Send SIGINT to ensure process termination
                    if (this.recordingProcess && !this.recordingProcess.killed) {
                        this.recordingProcess.kill('SIGINT');
                        console.log('SIGINT sent to terminate the recording process.');
                    }
                }
            );
            vscode.window.showInformationMessage('Recording started...');
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to start recording: ${error}`);
            console.error(`Failed to start recording: ${error}`);
        }
    }
}
