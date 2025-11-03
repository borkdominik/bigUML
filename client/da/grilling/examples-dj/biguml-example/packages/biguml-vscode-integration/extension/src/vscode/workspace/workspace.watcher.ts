/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { inject, injectable, postConstruct } from 'inversify';
import URI from 'urijs';
import * as vscode from 'vscode';
import { TYPES } from '../../di.types';
import { VSCodeSettings } from '../../language';
import { UVLanguageClient } from '../../languageclient/uv-languageclient';

@injectable()
export class WorkspaceWatcher {
    constructor(@inject(TYPES.LanguageClient) protected readonly modelServerClient: UVLanguageClient) {}

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
                    console.log(uri);
                    // jobs.push(this.modelServerClient.delete(uri));
                });
            });

            await Promise.all(jobs);
            promiseResolve!(undefined);
        });
    }
}
