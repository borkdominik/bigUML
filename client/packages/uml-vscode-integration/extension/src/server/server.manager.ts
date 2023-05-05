/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
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
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { java, UmlServerLauncher } from '@borkdominik-biguml/uml-integration';
import { ContainerModule, inject, injectable, multiInject } from 'inversify';
import * as vscode from 'vscode';
import { TYPES } from '../di.types';
import { VSCodeSettings } from '../language';
import { OutputChannel } from '../vscode/output/output.channel';

export interface ServerManagerStateListener {
    serverManagerStateChanged(manager: ServerManager, state: ServerManager.State): void | Promise<void>;
}

export const serverManagerModule = new ContainerModule(bind => {
    bind(ServerManager).toSelf().inSingletonScope();
    bind(TYPES.ServerManager).toService(ServerManager);
});

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
        @multiInject(TYPES.ServerLauncher) protected readonly launchers: UmlServerLauncher[],
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
                title: `Initializing ${VSCodeSettings.name} environment`,
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
                let details: string | undefined = 'Please check the logs.';

                if (error instanceof Error) {
                    reason = error.message;
                    details = error.stack;
                }

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
    export const MIN_JAVA = 11;
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
        readonly launcher: UmlServerLauncher;
    }

    export interface ServerLaunchedState extends CommonState {
        readonly state: 'servers-launched';
        readonly launchers: UmlServerLauncher[];
    }

    export type State = NoneState | ErrorState | AssertionSucceededState | LaunchingServerState | ServerLaunchedState;
}
