/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as net from 'net';
import { osUtils } from './os.js';

export interface ServerLauncherOptions {
    readonly executable: string;
    readonly additionalArgs?: string[];
    readonly logging?: boolean;
    readonly server: {
        name: string;
        port: number;
        logPrefix: string;
        startUpMessage: string;
    };
}

export abstract class ServerLauncher {
    protected readonly options: Required<ServerLauncherOptions>;
    protected serverProcess?: childProcess.ChildProcess;

    constructor(options: ServerLauncherOptions) {
        this.options = {
            logging: false,
            additionalArgs: [],
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
            const executable = this.options.executable;
            const server = this.options.server;

            if (!fs.existsSync(executable)) {
                throw Error(`Could not launch ${server.logPrefix}. The given server executable path is not valid: ${executable}`);
            }

            const process = this.startJavaProcess();

            this.serverProcess = process;

            process.stdout.on('data', data => {
                if (data.toString().includes(server.startUpMessage)) {
                    this.onReady();
                    resolve();
                }

                this.onStdoutData(data);
            });

            process.stderr.on('data', error => this.onStderrData(error));
            process.on('error', error => this.onProcessError(error));
        });
    }

    async ping(): Promise<void> {
        const error = await checkService('localhost', this.options.server.port, 2000);
        if (error !== undefined) {
            throw new Error(`Failed to connect to port ${this.options.server.port}`);
        }
    }

    async stop(): Promise<void> {
        if (this.serverProcess !== undefined && this.serverProcess.pid !== undefined && !this.serverProcess.killed) {
            await osUtils.kill(this.serverProcess.pid, 'SIGINT');
        }
    }

    protected startJavaProcess(): childProcess.ChildProcessWithoutNullStreams {
        if (!this.options.executable.endsWith('jar')) {
            throw new Error(`Could not launch Java GLSP server. The given executable is no JAR: ${this.options.executable}`);
        }

        // TODO: Workaround https://github.com/eclipse-glsp/glsp/issues/727
        const args = ['--add-opens', 'java.base/java.util=ALL-UNNAMED', '-jar', this.options.executable, ...this.options.additionalArgs];

        return childProcess.spawn('java', args, {
            detached: false
        });
    }

    protected onReady(): void {
        // Nothing to do
    }

    protected onStdoutData(_data: string | Buffer): void {
        // Nothing to do
    }

    protected onStderrData(_data: string | Buffer): void {
        // Nothing to do
    }

    protected onProcessError(_error: Error): void {
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
