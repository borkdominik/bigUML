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

import { GlspServerLauncher } from '@eclipse-glsp/vscode-integration/lib/quickstart-components/glsp-server-launcher';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import { Container, inject, injectable } from 'inversify';
import * as net from 'net';
import * as path from 'path';
import { TYPES, VSCODE_TYPES } from '../../di.types';
import { OutputChannel } from '../../vscode/output/output.channel';

const START_UP_COMPLETE_MSG = 'Startup completed';
const LOG_PREFIX = '[GLSP-Server]';

interface JavaSocketServerLauncherOptions {
    /** Path to the location of the server executable (JAR or node module) that should be launched as process */
    readonly executable: string;
    /** Socket connection on which the server should listen for new client connections */
    socketConnectionOptions: net.TcpSocketConnectOpts;
    /** Set to `true` if server stdout and stderr should be printed in extension host console. Default: `false` */
    readonly logging?: boolean;
    readonly serverType: 'java' | 'node';
    /** Additional arguments that should be passed when starting the server process. */
    readonly additionalArgs?: string[];
}

const GLSP_SERVER_PATH = '../server/glsp';
const GLSP_SERVER_VERSION = '0.1.0-SNAPSHOT';
const JAVA_EXECUTABLE = path.join(__dirname, GLSP_SERVER_PATH, `com.eclipsesource.uml.glsp-${GLSP_SERVER_VERSION}-glsp.jar`);

export interface GlspServerConfig {
    port: number;
}

export async function launchGLSPServer(container: Container, config: GlspServerConfig): Promise<void> {
    const launchOptions: JavaSocketServerLauncherOptions = {
        executable: JAVA_EXECUTABLE,
        socketConnectionOptions: { port: config.port },
        additionalArgs: [],
        logging: process.env.UML_GLSP_SERVER_LOGGING === 'true',
        serverType: 'java'
    };

    container.bind(TYPES.GlspServerLaunchOptions).toConstantValue(launchOptions);
    container.bind(TYPES.GlspServerLauncher).to(UmlGLSPServerLauncher).inSingletonScope();
    container.bind(VSCODE_TYPES.Disposable).toService(TYPES.GlspServerLauncher);

    await container.get<UmlGLSPServerLauncher>(TYPES.GlspServerLauncher).start();
}

@injectable()
export class UmlGLSPServerLauncher extends GlspServerLauncher {
    protected override options: Required<JavaSocketServerLauncherOptions>;

    constructor(
        @inject(VSCODE_TYPES.OutputChannel) protected readonly outputChannel: OutputChannel,
        @inject(TYPES.GlspServerLaunchOptions) options: JavaSocketServerLauncherOptions
    ) {
        super(options);
    }

    override async start(): Promise<void> {
        return new Promise(resolve => {
            const executable = this.options.executable;

            if (!fs.existsSync(executable)) {
                throw Error(`Could not launch GLSP server. The given server executable path is not valid: ${executable}`);
            }

            const process = this.options.serverType === 'java' ? this.startJavaProcess() : this.startNodeProcess();

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

    protected override startJavaProcess(): childProcess.ChildProcessWithoutNullStreams {
        if (!this.options.executable.endsWith('jar')) {
            throw new Error(`Could not launch Java GLSP server. The given executable is no JAR: ${this.options.executable}`);
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

    protected override handleStdoutData(data: string | Buffer): void {
        if (data && this.options.logging) {
            this.outputChannel.channel.appendLine(`${LOG_PREFIX} ${data.toString()}`);
        }
    }

    protected override handleStderrData(data: string | Buffer): void {
        if (data) {
            console.error(LOG_PREFIX, data.toString());
            this.outputChannel.channel.appendLine(`${LOG_PREFIX} ${data.toString()}`);
        }
    }

    protected override handleProcessError(error: Error): never {
        console.error(LOG_PREFIX, error);
        this.outputChannel.channel.appendLine(`${LOG_PREFIX} ${error.toString()}`);

        throw error;
    }

    override stop(): void {
        if (this.serverProcess && this.serverProcess.pid && !this.serverProcess.killed) {
            if (process.platform == 'win32') {
                childProcess.execSync(`taskkill /F /T /PID ${this.serverProcess.pid}`);
            } else {
                this.serverProcess.kill('SIGINT');
            }
        }
    }
}
