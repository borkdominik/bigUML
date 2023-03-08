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

import { FileSearchService } from '@theia/file-search/lib/common/file-search-service';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
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
        let umlFiles = await this.getUmlFiles();
        this.fileService.onDidFilesChange(async e => {
            if (e.gotDeleted()) {
                e.getDeleted().forEach(d => {
                    const path = `${d.resource.scheme}://${d.resource.path.fsPath()}`;
                    umlFiles
                        .filter(f => f.startsWith(path))
                        .forEach(f => {
                            this.modelServerClient.delete(new URI(f));
                        });
                });
            }

            umlFiles = await this.getUmlFiles();
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
