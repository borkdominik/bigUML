/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import * as childProcess from 'child_process';
import { inject } from 'inversify';
import * as net from 'net';
import { TYPES } from '../di.types';
import { OutputChannel } from '../vscode/output/output.channel';

export interface UmlServerLauncherOptions {
    readonly logging?: boolean;
    readonly server: {
        name: string;
        port: number;
        host: string;
        logPrefix: string;
        startUpMessage: string;
    };
}

export abstract class UmlServerLauncher {
    protected readonly options: Required<UmlServerLauncherOptions>;
    protected serverProcess?: childProcess.ChildProcess;
    @inject(TYPES.OutputChannel) protected readonly outputChannel: OutputChannel;

    constructor(options: UmlServerLauncherOptions) {
        this.options = {
            logging: true,
            ...options
        };
    }

    get serverName(): string {
        return this.options.server.name;
    }

    abstract readonly isEnabled: boolean;

    get isRunning(): boolean {
        return this.serverProcess !== undefined && this.serverProcess.pid !== undefined && !this.serverProcess.killed;
    }

    async start(): Promise<void> {
        return new Promise(resolve => {
            this.onReady();
            resolve();
        });
    }

    async stop(): Promise<void> {}

    async ping(): Promise<void> {
        const error = await checkService('localhost', this.options.server.port, 2000);
        if (error !== undefined) {
            this.outputChannel.appendLine(error);
            throw new Error(`Failed to connect to port ${this.options.server.port}`);
        }
    }

    protected onReady(): void {
        // Nothing to do
    }

    protected onStdoutData(data: string | Buffer): void {
        // Nothing to do
    }

    protected onStderrData(data: string | Buffer): void {
        // Nothing to do
    }

    protected onProcessError(error: Error): void {
        // Nothing to do
    }
}

// https://jakegut.com/posts/ext-svr/
async function checkService(host: string, port: number, timeout: number): Promise<string | undefined> {
    const promise = new Promise<string | undefined>((res, rej) => {
        const socket = new net.Socket();

        const onError = (msg: string) => () => {
            socket.destroy();
            rej(msg);
        };

        socket.setTimeout(timeout);
        socket.once('error', err => onError(String(err))());
        socket.once('timeout', onError('Connection timeout'));

        socket.connect(port, host, () => {
            socket.end();
            // In this situation, a successful connection is null
            // "No news is good news" type of thing
            res(undefined);
        });
    });

    try {
        return await promise;
    } catch (e: any) {
        return e;
    }
}
