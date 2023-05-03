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
import { TYPES, VSCODE_TYPES } from '../di.types';
import { OutputChannel } from '../vscode/output/output.channel';

export interface ServerManagerStateListener {
    serverManagerStateChanged(manager: ServerManager, state: ServerManager.State): void;
}

export const serverManager = new ContainerModule(bind => {
    bind(ServerManager).toSelf().inSingletonScope();
    bind(TYPES.ServerManager).toService(ServerManager);
});

@injectable()
export class ServerManager {
    protected _state: ServerManager.State = {
        state: 'none'
    };

    protected get state(): ServerManager.State {
        return this._state;
    }

    protected set state(value: ServerManager.State) {
        this._state = value;
        this.listeners.forEach(l => l.serverManagerStateChanged(this, this._state));
    }

    constructor(
        @inject(VSCODE_TYPES.OutputChannel) protected readonly output: OutputChannel,
        @multiInject(TYPES.ServerLauncher) protected readonly launchers: UmlServerLauncher[],
        @multiInject(TYPES.ServerManagerStateListener) protected readonly listeners: ServerManagerStateListener[]
    ) {}

    async start(): Promise<void> {
        const launchers = this.launchers.filter(l => l.isEnabled);
        this.output.channel.appendLine(`Registered server launchers: ${this.launchers.map(l => l.constructor.name).join(', ')}`);

        if (launchers.length > 0) {
            this.output.channel.appendLine(`Enabled server launchers: ${launchers.map(l => l.constructor.name).join(', ')}`);

            if (await this.assertJava()) {
                for (const launcher of launchers) {
                    await launcher.start();
                }
                this.state = {
                    state: 'servers-launched',
                    launchers
                };
            } else {
                this.output.appendLine(ServerManager.JAVA_MISSING_MESSAGE);
                vscode.window.showErrorMessage(ServerManager.JAVA_MISSING_MESSAGE);

                this.state = {
                    state: 'assertion-failed',
                    reason: 'java'
                };
            }
        } else {
            this.output.channel.appendLine('Skip starting servers, no server enabled.');
            this.state = {
                state: 'servers-launched',
                launchers
            };
        }
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

        if (javaVersion === undefined || +javaVersion < 11) {
            return false;
        }

        return true;
    }
}

export namespace ServerManager {
    export const JAVA_MISSING_MESSAGE = 'Starting bigUML failed. Please install Java 11+ on your machine.';

    export type ActiveState = 'none' | 'assertion-failed' | 'servers-launched';

    interface CommonState {
        readonly state: ActiveState;
    }

    export interface NoneState extends CommonState {
        readonly state: 'none';
    }

    export interface AssertionFailedState extends CommonState {
        readonly state: 'assertion-failed';
        readonly reason: any;
    }

    export interface ServerLaunchedState extends CommonState {
        readonly state: 'servers-launched';
        readonly launchers: UmlServerLauncher[];
    }

    export type State = NoneState | AssertionFailedState | ServerLaunchedState;
}
