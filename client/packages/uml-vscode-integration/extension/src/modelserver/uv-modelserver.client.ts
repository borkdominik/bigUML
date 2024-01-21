/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { inject, injectable } from 'inversify';
import URI from 'urijs';
import * as vscode from 'vscode';
import { TYPES } from '../di.types';
import { ServerManager, ServerManagerStateListener } from '../server/server.manager';
import { OutputChannel } from '../vscode/output/output.channel';
import { ModelServerConfig } from './config';
import { UmlModelServerClient } from './modelserver.client';

@injectable()
export class UVModelServerClient extends UmlModelServerClient implements ServerManagerStateListener {
    constructor(
        @inject(TYPES.OutputChannel) protected readonly output: OutputChannel,
        @inject(TYPES.ModelServerConfig) protected override readonly config: ModelServerConfig
    ) {
        super(config);
    }

    serverManagerStateChanged(_manager: ServerManager, state: ServerManager.State): void {
        if (state.state === 'servers-launched') {
            this.setUpModelServer();
        }
    }

    protected async setUpModelServer(): Promise<void> {
        const workspaces = vscode.workspace.workspaceFolders;
        if (workspaces && workspaces.length > 0) {
            const workspaceRoot = new URI(workspaces[0].uri.toString());
            const uiSchemaFolder = workspaceRoot.clone().segment('.ui-schemas');

            try {
                if (
                    !(await this.configureServer({
                        workspaceRoot,
                        uiSchemaFolder
                    }))
                ) {
                    vscode.window.showErrorMessage('Configuration of ModelServer failed.');
                }
            } catch (error: any) {
                console.error(error);

                if (error instanceof Error) {
                    const e = error;
                    this.output.error(e);
                    vscode.window.showErrorMessage('Configuration of ModelServer failed.', 'Details').then(value => {
                        if (value === 'Details') {
                            vscode.window.showErrorMessage(e.message, {
                                modal: true,
                                detail: e.stack ?? e.message
                            });
                        }
                    });
                }
            }
        }
    }
}
