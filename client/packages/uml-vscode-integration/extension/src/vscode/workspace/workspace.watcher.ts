/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { injectable } from 'inversify';

@injectable()
export class WorkspaceWatcher {
    /*
    constructor(@inject(TYPES.ModelServerClient) protected readonly modelServerClient: ModelServerClient) {}

    @postConstruct()
    initialize(): void {
        vscode.workspace.onWillDeleteFiles(async e => {
            let promiseResolve: ((value: unknown) => void) | undefined = undefined;

            const promise = new Promise(resolve => {
                promiseResolve = resolve;
            });
            e.waitUntil(promise);

            const workspaceUMLFiles = await vscode.workspace.findFiles(`** /*.${VSCodeSettings.editor.extension}`);
            const jobs: Promise<unknown>[] = [];

            e.files.forEach(df => {
                const umlFiles = workspaceUMLFiles.filter(uf => uf.path.startsWith(df.path));

                umlFiles.forEach(uf => {
                    const uri = new URI(decodeURIComponent(uf.toString()));
                    jobs.push(this.modelServerClient.delete(uri));
                });
            });

            await Promise.all(jobs);
            promiseResolve!(undefined);
        });
    }
    */
}
