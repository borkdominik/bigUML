/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import type { OutputChannel } from '../../../../vscode/features/output/output.channel.js';
import { ServerLauncher, type ServerLauncherOptions } from './launcher.js';

export abstract class BIGServerLauncher extends ServerLauncher {
    constructor(
        options: ServerLauncherOptions,
        protected readonly outputChannel: OutputChannel
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
