/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { OutputChannel } from '../vscode/output/output.channel';
import { UmlServerLauncher, UmlServerLauncherOptions } from './launcher';

export abstract class UVServerLauncher extends UmlServerLauncher {
    constructor(
        options: UmlServerLauncherOptions,
        protected override readonly outputChannel: OutputChannel
    ) {
        super(options);
    }

    protected override onReady(): void {
        this.outputChannel.channel.appendLine(`The ${this.options.server.logPrefix} listens on port ${this.options.server.port}`);
    }

    protected override onStdoutData(data: string | Buffer): void {
        if (data && this.options.logging) {
            this.outputChannel.channel.appendLine(`${this.options.server.logPrefix} ${data.toString()}`);
        }
    }

    protected override onStderrData(data: string | Buffer): void {
        if (data) {
            console.error(this.options.server.logPrefix, data.toString());
            this.outputChannel.channel.appendLine(`${this.options.server.logPrefix} ${data.toString()}`);
        }
    }

    protected override onProcessError(error: Error): never {
        console.error(this.options.server.logPrefix, error);
        this.outputChannel.channel.appendLine(`${this.options.server.logPrefix} ${error.toString()}`);

        throw error;
    }
}
