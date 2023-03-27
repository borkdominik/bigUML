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

import { inject, injectable, postConstruct } from 'inversify';
import URI from 'urijs';
import * as vscode from 'vscode';
import { TYPES } from '../../di.types';
import { VSCodeSettings } from '../../language';
import { UVModelServerClient } from '../../modelserver/uv-modelserver.client';

@injectable()
export class WorkspaceWatcher {
    constructor(@inject(TYPES.ModelServerClient) protected readonly modelServerClient: UVModelServerClient) {}

    @postConstruct()
    initialize(): void {
        vscode.workspace.onWillDeleteFiles(async e => {
            let promiseResolve: ((value: unknown) => void) | undefined = undefined;

            const promise = new Promise(resolve => {
                promiseResolve = resolve;
            });
            e.waitUntil(promise);

            const workspaceUmlFiles = await vscode.workspace.findFiles(`**/*.${VSCodeSettings.editor.extension}`);
            const jobs: Promise<unknown>[] = [];

            e.files.forEach(df => {
                const umlFiles = workspaceUmlFiles.filter(uf => uf.path.startsWith(df.path));

                umlFiles.forEach(uf => {
                    const uri = new URI(decodeURIComponent(uf.toString()));
                    jobs.push(this.modelServerClient.delete(uri));
                });
            });

            await Promise.all(jobs);
            promiseResolve!(undefined);
        });
    }
}
