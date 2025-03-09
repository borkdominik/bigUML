/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { TYPES } from '@borkdominik-biguml/big-vscode-integration/vscode';
import type { IDESessionClient } from '@borkdominik-biguml/big-vscode-integration/vscode-node';
import type { UMLDiagramEditorProvider } from '@borkdominik-biguml/uml-glsp-client/vscode';
import { NewFileResponseAction, RequestNewFileAction, type UMLDiagramType } from '@borkdominik-biguml/uml-protocol';
import { type Disposable, DisposableCollection } from '@eclipse-glsp/protocol';
import { inject, injectable } from 'inversify';
import URIJS from 'urijs';
import * as vscode from 'vscode';
import { UMLLangugageEnvironment, VSCodeSettings } from '../../language.js';
import { newDiagramWizard } from './wizard.js';

const nameRegex = /^([\w_-]+\/?)*[\w_-]+$/;

@injectable()
export class NewFileCreator implements Disposable {
    protected toDispose = new DisposableCollection();

    constructor(
        @inject(TYPES.IDESessionClient)
        protected readonly session: IDESessionClient,
        @inject(TYPES.EditorProvider)
        protected readonly editor: UMLDiagramEditorProvider,
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
            diagramTypes: UMLLangugageEnvironment.supportedTypes,
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
                    const target = vscode.Uri.joinPath(rootUri, this.diagramTarget(input).folder);
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
            await this.createUMLDiagram(rootUri, wizard.name.trim(), wizard.diagramPick.diagramType);
        }
    }

    protected async createUMLDiagram(rootUri: vscode.Uri, diagramName: string, diagramType: UMLDiagramType): Promise<void> {
        const workspaceRoot = new URIJS(decodeURIComponent(this.rootDestination(rootUri)));
        const modelUri = new URIJS(workspaceRoot + '/' + this.diagramDestination(diagramName));

        const client = await this.session.client();
        client.sendActionMessage({
            action: RequestNewFileAction.create(diagramType, modelUri.path()),
            clientId: client.id
        });
        const dispose = client.onActionMessage(async message => {
            if (NewFileResponseAction.is(message.action)) {
                dispose.dispose();

                vscode.window.showInformationMessage(
                    'Thank you for testing bigUML. We want to remind you that bigUML is at an early stage of development.',
                    'Close'
                );
                await vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
                await vscode.commands.executeCommand(
                    'vscode.openWith',
                    vscode.Uri.file(`${message.action.sourceUri}.uml`),
                    VSCodeSettings.editor.viewType
                );
            }
        }, client.id);
    }

    protected rootDestination(uri: vscode.Uri): string {
        return uri.toString();
    }

    protected diagramTarget(input: string): {
        folder: string;
        path: string;
    } {
        let prefix = input;
        let name = input;

        if (input.includes('/')) {
            const lastIndex = input.lastIndexOf('/');

            name = input.slice(lastIndex + 1);
            prefix = `${input.slice(0, lastIndex)}/${name}`;
        }

        return {
            folder: prefix,
            path: `${prefix}/${name}`
        };
    }

    protected diagramDestination(input: string): string {
        return this.diagramTarget(input).path;
    }
}
