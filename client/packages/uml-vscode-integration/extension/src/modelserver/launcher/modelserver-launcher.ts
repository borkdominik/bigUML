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

import { ModelServerConfig } from '@borkdominik-biguml/uml-modelserver/lib/config';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import { Container, inject, injectable } from 'inversify';
import * as net from 'net';
import * as path from 'path';
import * as vscode from 'vscode';
import { TYPES, VSCODE_TYPES } from '../../di.types';
import { OutputChannel } from '../../vscode/output/output.channel';

const START_UP_COMPLETE_MSG = 'Javalin started in';
const LOG_PREFIX = '[Model-Server]';

interface JavaSocketServerLauncherOptions {
    /** Path to the location of the server executable (JAR or node module) that should be launched as process */
    readonly executable: string;
    /** Socket connection on which the server should listen for new client connections */
    socketConnectionOptions: net.TcpSocketConnectOpts;
    /** Set to `true` if server stdout and stderr should be printed in extension host console. Default: `false` */
    readonly logging?: boolean;
    readonly serverType: 'java';
    /** Additional arguments that should be passed when starting the server process. */
    readonly additionalArgs?: string[];
}

const MODEL_SERVER_PATH = '../server/modelserver';
const MODEL_SERVER_VERSION = '0.1.0-SNAPSHOT';
const JAVA_EXECUTABLE = path.join(__dirname, MODEL_SERVER_PATH, `com.eclipsesource.uml.modelserver-${MODEL_SERVER_VERSION}-standalone.jar`);

export async function launchModelServer(container: Container, config: ModelServerConfig): Promise<void> {
    const launchOptions: JavaSocketServerLauncherOptions = {
        executable: JAVA_EXECUTABLE,
        socketConnectionOptions: { port: config.port },
        additionalArgs: [],
        logging: process.env.UML_MODEL_SERVER_LOGGING === 'true',
        serverType: 'java'
    };

    container.bind(TYPES.ModelServerLaunchOptions).toConstantValue(launchOptions);
    container.bind(TYPES.ModelServerLauncher).to(ModelServerLauncher).inSingletonScope();
    container.bind(VSCODE_TYPES.Disposable).toService(TYPES.ModelServerLauncher);

    await container.get<ModelServerLauncher>(TYPES.ModelServerLauncher).start();
}

/**
 * This component can be used to bootstrap your extension when using the default
 * GLSP server implementations, which you can find here:
 * https://github.com/eclipse-glsp/glsp-server
 * https://github.com/eclipse-glsp/glsp-server-node
 *
 * It simply starts up a server executable (JAR or node module) located at a specified path on a specified port.
 * You can pass additional launch arguments through the options.
 *
 * If you need a component to quickly connect your default GLSP server to the GLSP-VSCode
 * integration, take a look at the `SocketGlspVscodeServer` quickstart component.
 */
@injectable()
export class ModelServerLauncher implements vscode.Disposable {
    protected readonly options: Required<JavaSocketServerLauncherOptions>;
    protected serverProcess?: childProcess.ChildProcess;

    constructor(
        @inject(VSCODE_TYPES.OutputChannel) protected readonly outputChannel: OutputChannel,
        @inject(TYPES.ModelServerLaunchOptions) options: JavaSocketServerLauncherOptions
    ) {
        this.options = {
            logging: false,
            additionalArgs: [],
            ...options
        };
    }

    /**
     * Starts up the server.
     */
    async start(): Promise<void> {
        return new Promise(resolve => {
            const executable = this.options.executable;

            if (!fs.existsSync(executable)) {
                throw Error(`Could not launch Model server. The given server executable path is not valid: ${executable}`);
            }

            const process = this.startJavaProcess();

            this.serverProcess = process;

            process.stdout.on('data', data => {
                if (data.toString().includes(START_UP_COMPLETE_MSG)) {
                    this.outputChannel.channel.appendLine(`The ${LOG_PREFIX} listens on port ${this.options.socketConnectionOptions.port}`);
                    resolve();
                }

                this.handleStdoutData(data);
            });

            process.stderr.on('data', error => this.handleStderrData(error));
            process.on('error', error => this.handleProcessError(error));
        });
    }

    protected startJavaProcess(): childProcess.ChildProcessWithoutNullStreams {
        if (!this.options.executable.endsWith('jar')) {
            throw new Error(`Could not launch Java Model server. The given executable is no JAR: ${this.options.executable}`);
        }

        // TODO: Workaround https://github.com/eclipse-glsp/glsp/issues/727
        const args = [
            '--add-opens',
            'java.base/java.util=ALL-UNNAMED',
            '-jar',
            this.options.executable,
            '--port',
            `${this.options.socketConnectionOptions.port}`,
            ...this.options.additionalArgs
        ];

        if (this.options.socketConnectionOptions.host) {
            args.push('--host', `${this.options.socketConnectionOptions.host}`);
        }
        return childProcess.spawn('java', args);
    }

    protected handleStdoutData(data: string | Buffer): void {
        if (this.options.logging) {
            this.outputChannel.channel.appendLine(`${LOG_PREFIX} ${data.toString()}`);
        }
    }

    protected handleStderrData(data: string | Buffer): void {
        if (data) {
            console.error(LOG_PREFIX, data.toString());
            this.outputChannel.channel.appendLine(`${LOG_PREFIX} ${data.toString()}`);
        }
    }

    protected handleProcessError(error: Error): never {
        console.error(LOG_PREFIX, error);
        this.outputChannel.channel.appendLine(`${LOG_PREFIX} ${error.toString()}`);

        throw error;
    }

    /**
     * Stops the server.
     */
    stop(): void {
        if (this.serverProcess && !this.serverProcess.killed) {
            this.serverProcess.kill('SIGINT');
            // TODO: Think of a process that does this elegantly with the same consistency.
        }
    }

    dispose(): void {
        this.stop();
    }
}
