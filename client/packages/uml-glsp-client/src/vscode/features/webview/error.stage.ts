/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { type EditorStageResolver, type StageContext } from './stage.js';

export class ErrorStageResolver implements EditorStageResolver {
    async error(resource: StageContext, message: string, details?: string): Promise<void> {
        await resource.webviewPanel.webview.postMessage({ command: 'error', message, details });
    }

    async resolve(resource: StageContext): Promise<void> {
        resource.webviewPanel.webview.options = {
            enableScripts: true
        };
        resource.webviewPanel.webview.html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Error</title>
            <style>
                html, body {
                    height: 100%;
                }

                .root {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                }

                .container {
                    display: flex;
                    flex-direction: column;
                }

                .loading {
                    width: 100%;
                    height: 64px;
                    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' width='575' height='6px'%3E %3Cstyle%3E circle { animation: ball 2.5s cubic-bezier(0.000, 1.000, 1.000, 0.000) infinite; fill: %23bbb; } %23balls { animation: balls 2.5s linear infinite; } %23circle2 { animation-delay: 0.1s; } %23circle3 { animation-delay: 0.2s; } %23circle4 { animation-delay: 0.3s; } %23circle5 { animation-delay: 0.4s; } @keyframes ball { from { transform: none; } 20% { transform: none; } 80% { transform: translateX(864px); } to { transform: translateX(864px); } } @keyframes balls { from { transform: translateX(-40px); } to { transform: translateX(30px); } } %3C/style%3E %3Cg id='balls'%3E %3Ccircle class='circle' id='circle1' cx='-115' cy='3' r='3'/%3E %3Ccircle class='circle' id='circle2' cx='-130' cy='3' r='3' /%3E %3Ccircle class='circle' id='circle3' cx='-145' cy='3' r='3' /%3E %3Ccircle class='circle' id='circle4' cx='-160' cy='3' r='3' /%3E %3Ccircle class='circle' id='circle5' cx='-175' cy='3' r='3' /%3E %3C/g%3E %3C/svg%3E") 50% no-repeat;
                }
            </style>
        </head>
        <body>
            <div class="root">
                <div class="container">
                    <h1 id="message">An unexpected error occured. Please check the logs.</h1>
                    <span id="details"></span>
                </div>
            </div>

            <script>
                const message = document.getElementById('message');
                const details = document.getElementById('details');

                // Handle the message inside the webview
                window.addEventListener('message', event => {

                    const data = event.data; // The JSON data our extension sent

                    switch (data.command) {
                        case 'error':
                            message.textContent = data.message;
                            details.textContent = data.details;
                            break;
                    }
                });
            </script>
        </body>
        </html>`;
    }
}
