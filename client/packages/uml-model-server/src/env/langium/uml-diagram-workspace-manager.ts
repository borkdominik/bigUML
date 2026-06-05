/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 * Copyright (c) 2023 CrossBreeze.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type AstNode, DefaultWorkspaceManager, Deferred, type FileSystemNode, type LangiumDocument } from 'langium';
import { type CancellationToken, Emitter, type Event, type WorkspaceFolder } from 'vscode-languageserver';
import { type URI, Utils } from 'vscode-uri';
import { type UmlDiagramSharedServices } from './uml-diagram-module.js';

/**
 * A cusotm workspace manager that:
 * - fires an event when the workspace is initialized (we use this for starting LSP-dependent servers)
 * - sets up a package-system on top of the workspace folders (including the 'node_modules' folder)
 * - validates all documents after workspace initialization
 */
export class UmlDiagramWorkspaceManager extends DefaultWorkspaceManager {
    protected onWorkspaceInitializedEmitter = new Emitter<URI[]>();
    protected workspaceInitializedDeferred = new Deferred<URI[]>();
    workspaceInitialized = this.workspaceInitializedDeferred.promise;

    constructor(
        protected services: UmlDiagramSharedServices,
        protected logger = services.logger.ClientLogger
    ) {
        super(services);
        this.initialBuildOptions = { validation: true };
    }

    override async initializeWorkspace(folders: WorkspaceFolder[], cancelToken?: CancellationToken | undefined): Promise<void> {
        try {
            await super.initializeWorkspace(folders, cancelToken);
            this.logger.info('Workspace Initialized');
            const uris = this.folders?.map(folder => this.getRootFolder(folder)) || [];
            this.workspaceInitializedDeferred.resolve(uris);
            this.onWorkspaceInitializedEmitter.fire(uris);
        } catch (error) {
            this.workspaceInitializedDeferred.reject(error);
        }
    }

    get onWorkspaceInitialized(): Event<URI[]> {
        return this.onWorkspaceInitializedEmitter.event;
    }

    protected override async loadAdditionalDocuments(
        folders: WorkspaceFolder[],
        _collector: (document: LangiumDocument<AstNode>) => void
    ): Promise<void> {
        // build up package-system based on the workspace
        return this.services.workspace.PackageManager.initialize(folders);
    }

    override shouldIncludeEntry(entry: FileSystemNode): boolean {
        const name = Utils.basename(entry.uri);
        if (name.startsWith('.')) {
            return false;
        }
        if (entry.isDirectory) {
            // Also support 'node_modules' directory (unlike the default which excludes it)
            return name !== 'out';
        } else if (entry.isFile) {
            // Only include files with registered language extensions; package.json is handled by PackageManager
            return this.serviceRegistry.hasServices(entry.uri);
        }
        return false;
    }
}
