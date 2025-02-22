/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { inject, injectable, multiInject } from 'inversify';
import * as vscode from 'vscode';
import type { GLSPDiagramSettings, OutputChannel } from '../../../vscode/index.js';
import { TYPES } from '../../../vscode/vscode-common.types.js';
import { java } from './launcher/java.js';
import type { ServerLauncher } from './launcher/launcher.js';

export interface ServerManagerStateListener {
    serverManagerStateChanged(manager: ServerManager, state: ServerManager.State): void | Promise<void>;
}

@injectable()
export class ServerManager {
    protected _state: ServerManager.State = {
        state: 'none'
    };

    public get state(): ServerManager.State {
        return this._state;
    }

    protected set state(value: ServerManager.State) {
        this._state = value;
        this.emit(l => l.serverManagerStateChanged(this, this._state));
    }

    constructor(
        @inject(TYPES.OutputChannel) protected readonly output: OutputChannel,
        @inject(TYPES.GLSPDiagramSettings) protected readonly diagramSettings: GLSPDiagramSettings,
        @multiInject(TYPES.ServerLauncher) protected readonly launchers: ServerLauncher[],
        @multiInject(TYPES.ServerManagerStateListener) protected readonly listeners: ServerManagerStateListener[]
    ) {
        this.listeners.forEach(l => l.serverManagerStateChanged(this, this.state));
    }

    async start(): Promise<void> {
        let progressResolve: (() => void) | undefined;
        let progress: vscode.Progress<{ message?: string; increment?: number }> | undefined;

        vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: `Initializing ${this.diagramSettings.name} environment`,
                cancellable: false
            },
            p => {
                progress = p;
                return new Promise<void>(resolve => {
                    progressResolve = resolve;
                });
            }
        );

        const launchers = this.launchers.filter(l => l.isEnabled);
        this.output.channel.appendLine(`Registered server launchers: ${this.launchers.map(l => l.serverName).join(', ')}`);

        if (launchers.length > 0) {
            this.output.channel.appendLine(`Enabled server launchers: ${launchers.map(l => l.serverName).join(', ')}`);

            try {
                if (await this.assertJava()) {
                    this.state = {
                        state: 'assertion-succeeded'
                    };

                    for (const launcher of launchers) {
                        this.state = {
                            state: 'launching-server',
                            launcher
                        };

                        progress?.report({
                            message: `Starting ${launcher.serverName}`
                        });

                        await launcher.start();
                        await launcher.ping();
                    }
                    progress?.report({
                        message: undefined
                    });

                    this.state = {
                        state: 'servers-launched',
                        launchers
                    };
                } else {
                    this.output.appendLine(ServerManager.JAVA_MISSING_MESSAGE);
                    vscode.window.showErrorMessage(ServerManager.JAVA_MISSING_MESSAGE);

                    this.state = {
                        state: 'error',
                        reason: 'Java not found.',
                        details: `Please install Java ${ServerManager.MIN_JAVA}+ and restart VS Code.`
                    };
                }
            } catch (error) {
                this.output.appendLine('Something went wrong. Please check the logs.');
                vscode.window.showErrorMessage('Something went wrong. Please check the logs.');

                let reason = 'Something went wrong.';
                let details: string | undefined =
                    'Please check the logs (Command: > Output: Show Output Channels... -> bigUML Modeling Tool).';

                if (error instanceof Error) {
                    reason = error.message;
                    details = error.stack;
                }

                this.output.appendLine(reason);
                this.output.appendLine(details ?? 'No details available.');

                this.state = {
                    state: 'error',
                    reason,
                    details
                };
            }
        } else {
            this.output.channel.appendLine('Skip starting servers, no server enabled.');
            this.state = {
                state: 'servers-launched',
                launchers
            };
        }

        progressResolve?.();
    }

    async stop(): Promise<void> {
        const launchers = this.launchers.filter(l => l.isRunning);

        for (const launcher of launchers) {
            await launcher.stop();
        }

        this.state = {
            state: 'none'
        };
    }

    protected async assertJava(): Promise<boolean> {
        const javaVersion = await java.installedMajorVersion();

        if (javaVersion === undefined || +javaVersion < ServerManager.MIN_JAVA) {
            return false;
        }

        return true;
    }

    protected emit(cb: (l: ServerManagerStateListener) => void): void {
        this.listeners.forEach(cb);
    }
}

export namespace ServerManager {
    export const MIN_JAVA = 17;
    export const JAVA_MISSING_MESSAGE = `Starting bigUML failed. Please install Java ${MIN_JAVA}+ on your machine.`;

    export type ActiveState = 'none' | 'error' | 'assertion-succeeded' | 'launching-server' | 'servers-launched';

    interface CommonState {
        readonly state: ActiveState;
    }

    export interface NoneState extends CommonState {
        readonly state: 'none';
    }

    export interface ErrorState extends CommonState {
        readonly state: 'error';
        readonly reason: any;
        readonly details?: any;
    }

    export interface AssertionSucceededState extends CommonState {
        readonly state: 'assertion-succeeded';
    }

    export interface LaunchingServerState extends CommonState {
        readonly state: 'launching-server';
        readonly launcher: ServerLauncher;
    }

    export interface ServerLaunchedState extends CommonState {
        readonly state: 'servers-launched';
        readonly launchers: ServerLauncher[];
    }

    export type State = NoneState | ErrorState | AssertionSucceededState | LaunchingServerState | ServerLaunchedState;
}
