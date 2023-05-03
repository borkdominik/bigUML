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
import { TYPES, VSCODE_TYPES } from '../di.types';
import { OutputChannel } from '../vscode/output/output.channel';

export const serverLauncherModule = new ContainerModule(bind => {
    bind(ServerLauncherManager).toSelf().inSingletonScope();
    bind(TYPES.ServerLauncherManager).toService(ServerLauncherManager);
});

@injectable()
export class ServerLauncherManager {
    constructor(
        @inject(VSCODE_TYPES.OutputChannel) protected readonly output: OutputChannel,
        @multiInject(TYPES.ServerLauncher) protected readonly launchers: UmlServerLauncher[]
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
            } else {
                this.output.appendLine('Starting bigUML failed. Please install Java 11+ on your machine.', {
                    errorMessage: true
                });
            }
        } else {
            this.output.channel.appendLine('Skip starting servers, no server enabled.');
        }
    }

    async stop(): Promise<void> {
        const launchers = this.launchers.filter(l => l.isRunning);

        for (const launcher of launchers) {
            await launcher.stop();
        }
    }

    protected async assertJava(): Promise<boolean> {
        const javaVersion = await java.installedMajorVersion();

        if (javaVersion === undefined || +javaVersion < 11) {
            return false;
        }

        return true;
    }
}

export namespace ServerLauncherManager {
    export enum State {
        NONE,
        ASSERTION_FAILED,
        SERVER_RUNNING
    }

    interface CommonState {
        readonly state: State;
    }

    export interface NoneState extends CommonState {
        readonly state: State.NONE;
    }

    export interface AssertionFailedState extends CommonState {
        readonly state: State.ASSERTION_FAILED;
        readonly reason: any;
    }

    export type ServerType = 'GLSPServer' | 'ModelServer';
    export interface ServerRunningState extends CommonState {
        readonly state: State.SERVER_RUNNING;
        readonly runningServers: ServerType[];

        isRunning(type: ServerType): boolean;
    }
}
