/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { FileSearchService } from '@theia/file-search/lib/common/file-search-service';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { FileOperation } from '@theia/filesystem/lib/common/files';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { inject, injectable } from 'inversify';
import URI from 'urijs';
import { UTModelServerClient } from '../../../common/modelserver.client';

@injectable()
export class WorkspaceWatcher {
    @inject(FileService)
    protected readonly fileService: FileService;
    @inject(FileSearchService)
    protected readonly fileSearchService: FileSearchService;
    @inject(WorkspaceService)
    protected readonly workspaceService: WorkspaceService;
    @inject(UTModelServerClient)
    protected readonly modelServerClient: UTModelServerClient;

    async watch(): Promise<void> {
        this.fileService.onWillRunUserOperation(async e => {
            let resolve: undefined | ((value: unknown) => void);
            const promise = new Promise(res => {
                resolve = res;
            });

            if (resolve !== undefined) {
                e.waitUntil(promise);

                const umlFiles = await this.getUmlFiles();

                if (e.operation === FileOperation.DELETE) {
                    const promises = umlFiles
                        .filter(uf => uf.startsWith(e.target.toString()))
                        .map(uf => this.modelServerClient.delete(new URI(decodeURIComponent(uf))));
                    Promise.all(promises).then(() => resolve!(undefined));
                } else {
                    resolve(undefined);
                }
            }
        });
    }

    protected async getUmlFiles(): Promise<string[]> {
        const roots = await this.workspaceService.roots;
        return this.fileSearchService.find('uml', {
            rootUris: roots.map(r => r.resource.path.fsPath()),
            useGitIgnore: true,
            limit: 50
        });
    }
}
