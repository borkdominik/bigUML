/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { ContainerModule, inject, injectable } from 'inversify';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient/node.js';
import { TYPES } from '../di.types';
import { OutputChannel } from '../vscode/output/output.channel';
import { LanguageClientConfig, ModelServerOptions } from './config';

import * as path from 'path';
import * as vscode from 'vscode';
import { UVServerLauncher } from '../server';
import { UmlServerLauncherOptions } from '../server/launcher';

@injectable()
export class UVLanguageClient {
    languageClient: LanguageClient;
    constructor(
        @inject(TYPES.LanguageClientConfig) protected readonly config: LanguageClientConfig,
        @inject(TYPES.OutputChannel) protected readonly outputChannel: OutputChannel
    ) {}

    async getAll(): Promise<any[]> {
        return [];
    }

    start(): void {
        this.config.modelServer_clientOptions.outputChannel = this.outputChannel.channel;
        this.languageClient = new LanguageClient(
            'bigUML',
            'bigUML Modeling Tool',
            this.config.modelServer_serverOptions,
            this.config.modelServer_clientOptions
        );
        this.languageClient.start();
    }
}

export function createModelServerConfig(): ModelServerOptions {
    return {
        host: 'localhost',
        port: 5999
    };
}

export function createLanguageClientConfig(context: vscode.ExtensionContext): LanguageClientConfig {
    const modelServer_serverOptions: ServerOptions = createServerOptions(context);
    const modelServer_clientOptions: LanguageClientOptions = createClientOptions(context);
    return { modelServer_serverOptions, modelServer_clientOptions };
}

function createServerOptions(context: vscode.ExtensionContext): ServerOptions {
    const serverModule = context.asAbsolutePath(path.join('../../', 'biguml-server', 'out', 'main.cjs'));
    const debugOptions = {
        execArgv: ['--nolazy', `--inspect${process.env.DEBUG_BREAK ? '-brk' : ''}=${process.env.DEBUG_SOCKET || '6009'}`]
    };
    return {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
    };
}

function createClientOptions(context: vscode.ExtensionContext): LanguageClientOptions {
    const umlWatcher = vscode.workspace.createFileSystemWatcher('**/*.{uml,umld}');
    context.subscriptions.push(umlWatcher);
    const packageWatcher = vscode.workspace.createFileSystemWatcher('**/package.json');
    context.subscriptions.push(packageWatcher);
    const directoryWatcher = vscode.workspace.createFileSystemWatcher('**/*/');
    context.subscriptions.push(directoryWatcher);
    return {
        documentSelector: [
            { scheme: 'file', language: 'bigUML-uml' },
            { scheme: 'file', pattern: '**/package.json' }
        ],
        synchronize: {
            fileEvents: [umlWatcher, packageWatcher, directoryWatcher]
        }
    };
}

export function languageClientModule(config: ModelServerOptions): ContainerModule {
    return new ContainerModule(bind => {
        const launchOptions: UmlServerLauncherOptions = {
            logging: true,
            server: {
                name: 'ModelServer',
                port: config.port,
                host: config.host,
                logPrefix: '[Model-Server]',
                startUpMessage: 'Model Server Startup completed'
            }
        };

        bind(TYPES.LanguageClientLaunchOptions).toConstantValue(launchOptions);

        bind(UmlLanguageClientLauncher).toSelf().inSingletonScope();
        bind(TYPES.LanguageClientLauncher).toService(UmlLanguageClientLauncher);
        bind(TYPES.ServerLauncher).toService(TYPES.LanguageClientLauncher);
        bind(TYPES.Disposable).toService(TYPES.LanguageClientLauncher);
    });
}

@injectable()
export class UmlLanguageClientLauncher extends UVServerLauncher {
    get isEnabled(): boolean {
        return true;
    }

    constructor(
        @inject(TYPES.LanguageClientLaunchOptions) options: UmlServerLauncherOptions,
        @inject(TYPES.OutputChannel) outputChannel: OutputChannel
    ) {
        super(options, outputChannel);
    }
}
