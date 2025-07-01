/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { helloWorldModule } from '@borkdominik-biguml/big-hello-world/vscode';
import { eyeTrackingModule } from '@borkdominik-biguml/big-eye-tracking/vscode';
import { minimapModule } from '@borkdominik-biguml/big-minimap/vscode';
import { outlineModule } from '@borkdominik-biguml/big-outline/vscode';
import { propertyPaletteModule } from '@borkdominik-biguml/big-property-palette/vscode';
import { createVSCodeCommonContainer, TYPES, type ActionListener, type GLSPDiagramSettings } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { loadVSCodeNodeContainer, type GLSPServerConfig } from '@borkdominik-biguml/big-vscode-integration/vscode-node';
import { editorModule, themeModule } from '@borkdominik-biguml/uml-glsp-client/vscode';
import { type Container } from 'inversify';
import type * as vscode from 'vscode';
import { VSCodeSettings } from './language.js';
import { DefaultCommandsProvider } from './vscode/command/default-commands.js';
import { vscodeModule } from './vscode/vscode.module.js';
import { DisposableCollection, type ActionMessage } from '@eclipse-glsp/protocol';


// ActionMonitorService - implementing VS Code's Disposable interface
class ActionMonitorService implements vscode.Disposable {
    private readonly toDispose = new DisposableCollection();
    private monitoringEndpoint = 'http://127.0.0.1:8000/interactions';
    private isInitialized = false;
    private sessionId: string;

    constructor(private readonly actionListener: ActionListener) {
        this.initialize();
    }

    private initialize(): void {
        if (this.isInitialized) {
            return;
        }

        console.log('[ActionMonitor] Initializing action monitoring service');
        this.sessionId = this.generateSessionId();

        try {
            // Monitor all client-to-server actions
            this.toDispose.push(
                this.actionListener.registerListener(async message => {
                    await this.sendToMonitoringServer(message, 'client-to-server');
                })
            );

            // Monitor server-to-client actions
            this.toDispose.push(
                this.actionListener.registerServerListener(async message => {
                    await this.sendToMonitoringServer(message, 'server-to-client');
                })
            );

            // Monitor VS Code specific actions
            this.toDispose.push(
                this.actionListener.registerVSCodeListener(async message => {
                    await this.sendToMonitoringServer(message, 'vscode-internal');
                })
            );

            this.isInitialized = true;
            console.log('[ActionMonitor] Action monitoring successfully initialized');
        } catch (error) {
            console.error('[ActionMonitor] Failed to initialize:', error);
        }
    }


    /**
     * Generates a unique session ID
     */
    private generateSessionId(): string {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    
    getSessionId(): string {
        return this.sessionId;
    }

    /**
     * Generates a unique batch ID
     */
    private generateBatchId(): string {
        return `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }


    private async sendToMonitoringServer(message: ActionMessage, direction: string): Promise<void> {
        try {
            const payload = {
                timestamp: new Date().toISOString(),
                sessionId: this.sessionId,
                source: direction,
                actionKind: message.action.kind,
                clientId: message.clientId,
                userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'VSCode Extension',
                url: typeof window !== 'undefined' ? window.location?.href : 'vscode://extension',
                metadata: {
                    action: message.action,
                    extension: 'bigUML',
                    version: '1.0.0'
                }
            };

            console.log(`[ActionMonitor] 📤 Sending: ${message.action.kind} (${direction})`);
            
            const batch = {
                interactions: [payload],
                batchId: this.generateBatchId(),
                timestamp: new Date().toISOString(),
                sessionId: this.getSessionId()
            }

            const response = await fetch(this.monitoringEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(batch)
            });

            if (response.ok) {
                console.log(`[ActionMonitor] Successfully sent: ${message.action.kind}`);
            } else {
                console.warn(`[ActionMonitor] HTTP ${response.status} for: ${message.action.kind}`);
            }
        } catch (error) {
            console.error(`[ActionMonitor] Network error for ${message.action.kind}:`, error);
        }
    }

    public isMonitoring(): boolean {
        return this.isInitialized;
    }

    public updateEndpoint(newEndpoint: string): void {
        this.monitoringEndpoint = newEndpoint;
        console.log(`[ActionMonitor] Updated endpoint to: ${newEndpoint}`);
    }

    dispose(): void {
        this.toDispose.dispose();
        this.isInitialized = false;
        console.log('[ActionMonitor] Disposed action monitoring service');
    }

    [Symbol.dispose](): void {
        this.dispose();
    }
}


export function createContainer(
    extensionContext: vscode.ExtensionContext,
    options: {
        diagram: GLSPDiagramSettings;
        glspServerConfig: GLSPServerConfig;
    }
): Container {
    const container = createVSCodeCommonContainer(extensionContext, options);
    loadVSCodeNodeContainer(container, options);

    container.bind(DefaultCommandsProvider).toSelf().inSingletonScope();
    container.bind(TYPES.RootInitialization).toService(DefaultCommandsProvider);

    container.load(
        vscodeModule,
        editorModule({
            diagramType: VSCodeSettings.diagramType,
            viewType: VSCodeSettings.editor.viewType
        }),
        outlineModule(VSCodeSettings.outline.viewId),
        propertyPaletteModule(VSCodeSettings.propertyPalette.viewId),
        minimapModule(VSCodeSettings.minimap.viewId),
        helloWorldModule(VSCodeSettings.helloWorld.viewId),
        eyeTrackingModule(VSCodeSettings.eyeTracking.viewId),
        themeModule
    );


    // Initialize action monitoring with proper type casting
    try {
        //console.log('[Monitoring] Setting up action monitoring...');

        // Type-safe container get with explicit typing
        //const actionListener = container.get<ActionListener>(TYPES.ActionListener);
        //const monitor = new ActionMonitorService(actionListener);

        // Register for cleanup when extension deactivates
        //extensionContext.subscriptions.push(monitor);

        console.log('[Monitoring] Action monitoring is now ACTIVE!');
        console.log('[Monitoring] All actions will be sent to http://localhost:3001/actions');
        //console.log('[Monitoring] Status:', monitor.isMonitoring() ? 'RUNNING' : 'STOPPED');
    } catch (error) {
        console.error('[Monitoring] Failed to initialize action monitoring:', error);
        console.log('[Monitoring] Extension will continue to work normally without monitoring');

        // Additional debugging info
        if (error instanceof Error) {
            console.error('[Monitoring] Error details:', error.message);
        }
    }

    return container;
}
