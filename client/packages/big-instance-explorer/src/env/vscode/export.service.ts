/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import {
    TYPES,
    type ActionDispatcher,
    type ActionListener,
    type OnActivate,
    type OnDispose,
    type SelectionService
} from '@borkdominik-biguml/big-vscode/vscode';
import { DisposableCollection } from '@eclipse-glsp/protocol';
import { inject, injectable } from 'inversify';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import * as vscode from 'vscode';
import {
    AvailableExportTemplatesResponse,
    RequestSaveExportedInstancesAction,
    RequestAvailableExportTemplatesAction,
    SaveExportedInstancesResponse
} from '../common/index.js';

@injectable()
export class InstanceExportService implements OnActivate, OnDispose {
    @inject(TYPES.ActionListener)
    protected readonly actionListener: ActionListener;

    @inject(TYPES.ActionDispatcher)
    protected readonly actionDispatcher: ActionDispatcher;

    @inject(TYPES.SelectionService)
    protected readonly selectionService: SelectionService;

    protected readonly toDispose = new DisposableCollection();
    protected readonly onDidRequestOpenExportDialogEmitter = new vscode.EventEmitter<void>();
    readonly onDidRequestOpenExportDialog = this.onDidRequestOpenExportDialogEmitter.event;
    protected pendingOpenDialogRequest = false;

    onActivate(): void {
        this.toDispose.push(
            this.actionListener.handleVSCodeRequest<RequestSaveExportedInstancesAction>(
                RequestSaveExportedInstancesAction.KIND,
                async message => {
                    try {
                        const target = await this.selectExportTarget(message.action.suggestedFileName);
                        if (!target) {
                            return SaveExportedInstancesResponse.create({
                                responseId: message.action.requestId,
                                success: false,
                                message: 'Export cancelled.'
                            });
                        }

                        await vscode.workspace.fs.writeFile(target, new TextEncoder().encode(message.action.content));
                        return SaveExportedInstancesResponse.create({
                            responseId: message.action.requestId,
                            success: true,
                            filePath: target.fsPath
                        });
                    } catch (error: any) {
                        return SaveExportedInstancesResponse.create({
                            responseId: message.action.requestId,
                            success: false,
                            message: error?.message ?? String(error)
                        });
                    }
                }
            )
        );
    }

    dispose(): void {
        this.toDispose.dispose();
    }

    requestOpenExportDialog(): void {
        this.pendingOpenDialogRequest = true;
        this.onDidRequestOpenExportDialogEmitter.fire();
    }

    consumePendingOpenDialogRequest(): boolean {
        const pending = this.pendingOpenDialogRequest;
        this.pendingOpenDialogRequest = false;
        return pending;
    }

    getSelectedElementIds(): string[] {
        return this.selectionService.selection?.selectedElementsIDs ?? [];
    }

    async getAvailableTemplates(): Promise<AvailableExportTemplatesResponse> {
        const workspaceTemplateDirectory = this.resolveWorkspaceTemplateDirectory();
        const response = await this.actionDispatcher.request(
            RequestAvailableExportTemplatesAction.create({
                workspaceTemplateDirectory
            })
        );

        return AvailableExportTemplatesResponse.create({
            responseId: response.action.responseId,
            templates: response.action.templates,
            workspaceTemplateDirectory: response.action.workspaceTemplateDirectory ?? workspaceTemplateDirectory
        });
    }

    protected resolveWorkspaceTemplateDirectory(): string | null {
        for (const workspaceFolder of vscode.workspace.workspaceFolders ?? []) {
            const templateDirectory = join(workspaceFolder.uri.fsPath, '.biguml', 'templates');
            if (existsSync(templateDirectory)) {
                return templateDirectory;
            }
        }

        return null;
    }

    protected async selectExportTarget(suggestedFileName: string): Promise<vscode.Uri | undefined> {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        const defaultUri = workspaceFolder ? vscode.Uri.file(join(workspaceFolder.uri.fsPath, suggestedFileName)) : undefined;

        return vscode.window.showSaveDialog({
            defaultUri,
            saveLabel: 'Export Instances'
        });
    }
}
