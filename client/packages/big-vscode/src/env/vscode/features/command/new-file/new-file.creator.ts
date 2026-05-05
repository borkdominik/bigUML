/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import type { IDESessionClient } from '@borkdominik-biguml/big-vscode/vscode';
import { TYPES } from '@borkdominik-biguml/big-vscode/vscode';
import { CreateNewFileAction, CreateNewFileResponseAction, type UmlDiagramType } from '@borkdominik-biguml/uml-glsp-server';
import { type Disposable, DisposableCollection } from '@eclipse-glsp/protocol';
import { inject, injectable } from 'inversify';
import * as vscode from 'vscode';
import { UmlLangugageEnvironment, VSCodeSettings } from '../../../../common/index.js';
import { newDiagramWizard } from './wizard.js';

const nameRegex = /^([\w_-]+\/?)*[\w_-]+$/;

@injectable()
export class NewFileCreator implements Disposable {
    protected toDispose = new DisposableCollection();

    constructor(
        @inject(TYPES.IdeSessionClient)
        protected readonly session: IDESessionClient,
        @inject(TYPES.ExtensionContext)
        protected readonly context: vscode.ExtensionContext
    ) {}

    dispose(): void {
        this.toDispose.dispose();
    }

    async create(targetUri?: vscode.Uri): Promise<void> {
        const workspaces = vscode.workspace.workspaceFolders;
        const workspace = workspaces?.[0];
        if (workspace === undefined) {
            throw new Error('Workspace was not defined');
        }

        const rootUri = targetUri ?? workspace.uri;

        const wizard = await newDiagramWizard(this.context, {
            diagramTypes: UmlLangugageEnvironment.supportedTypes,
            nameValidator: async input => {
                if (!input || input.trim().length === 0) {
                    return 'Name can not be empty';
                }

                if (input.startsWith('/') || input.endsWith('/')) {
                    return 'Path can not start or end with /';
                }

                if (!nameRegex.test(input)) {
                    return 'Invalid input - only [0-9, a-z, A-Z, /, -, _] allowed';
                }

                try {
                    const target = vscode.Uri.joinPath(rootUri, input);
                    const stat = await vscode.workspace.fs.stat(target);
                    if (stat.type === vscode.FileType.Directory) {
                        const files = await vscode.workspace.fs.readDirectory(target);
                        if (files.length > 0) {
                            return 'Provided path is not empty';
                        }
                    }
                } catch (_error) {
                    // No op
                }

                return undefined;
            }
        });

        if (wizard !== undefined) {
            await this.createUmlDiagram(rootUri, wizard.name.trim(), wizard.diagramPick.diagramType);
        }
    }

    protected async createUmlDiagram(rootUri: vscode.Uri, diagramName: string, diagramType: UmlDiagramType): Promise<void> {
        const modelUri = vscode.Uri.joinPath(rootUri, diagramName);

        const client = await this.session.client();
        client.sendActionMessage({
            action: CreateNewFileAction.create(diagramType, modelUri.toString(true)),
            clientId: client.id
        });
        const dispose = client.onActionMessage(async message => {
            if (CreateNewFileResponseAction.is(message.action)) {
                dispose.dispose();

                const open = vscode.Uri.parse(`${message.action.sourceUri}.uml`);
                console.log(message.action.sourceUri, open);

                vscode.window.showInformationMessage(
                    'Thank you for testing bigUml. We want to remind you that bigUml is at an early stage of development.',
                    'Close'
                );
                await vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
                await vscode.commands.executeCommand('vscode.openWith', open, VSCodeSettings.editor.viewType);
            }
        }, client.id);
    }
}
