/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
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
import { UmlModelServerClient } from '@borkdominik-biguml/uml-modelserver/lib/modelserver.client';
import { inject, injectable } from 'inversify';
import URI from 'urijs';
import * as vscode from 'vscode';
import { TYPES } from '../di.types';
import { ServerManager, ServerManagerStateListener } from '../server/server.manager';
import { OutputChannel } from '../vscode/output/output.channel';

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
