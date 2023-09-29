/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { UmlDiagramType } from '@borkdominik-biguml/uml-common';
import { inject, injectable } from 'inversify';
import URIJS from 'urijs';
import * as vscode from 'vscode';
import { TYPES } from '../../di.types';
import { UVLangugageEnvironment, VSCodeSettings } from '../../language';
import { UVModelServerClient } from '../../modelserver/uv-modelserver.client';
import { UmlDiagramEditorProvider } from '../editor/editor.provider';
import { newDiagramWizard } from './wizard';

const nameRegex = /^([\w_-]+\/?)*[\w_-]+$/;

@injectable()
export class NewFileCreator {
    constructor(
        @inject(TYPES.ModelServerClient)
        protected readonly modelServerClient: UVModelServerClient,
        @inject(TYPES.EditorProvider)
        protected readonly editor: UmlDiagramEditorProvider,
        @inject(TYPES.ExtensionContext)
        protected readonly context: vscode.ExtensionContext
    ) {}

    async create(targetUri?: vscode.Uri): Promise<void> {
        const workspaces = vscode.workspace.workspaceFolders;
        const workspace = workspaces?.[0];
        if (workspace === undefined) {
            throw new Error('Workspace was not defined');
        }

        const rootUri = targetUri ?? workspace.uri;
        let prefixPath = '';
        if (targetUri !== undefined) {
            const relativePath = targetUri.path.replace(workspace.uri.path, '').slice(1);
            prefixPath = relativePath.length === 0 ? '' : relativePath + '/';
        }

        const wizard = await newDiagramWizard(this.context, {
            diagramTypes: UVLangugageEnvironment.supportedTypes,
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

                const models = await this.modelServerClient.getAll();
                const newModelUri = `${prefixPath}${this.diagramDestination(input)}`;

                if (models.some(model => model.modeluri === newModelUri)) {
                    return 'Model already exists';
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
                } catch (error) {
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
        const workspaceRoot = new URIJS(decodeURIComponent(this.rootDestination(rootUri)));
        const modelUri = new URIJS(workspaceRoot + '/' + this.diagramDestination(diagramName));

        await this.modelServerClient.create(
            modelUri,
            {
                data: {
                    $type: 'com.eclipsesource.uml.modelserver.model.impl.NewDiagramRequestImpl',
                    diagramType
                }
            },
            undefined,
            'raw-json'
        );

        vscode.window.showInformationMessage(
            'Thank you for testing bigUML. We want to remind you that bigUML is still in the early development phase.',
            'Close'
        );
        await vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
        const filePath = vscode.Uri.file(modelUri.path().toString());
        await vscode.commands.executeCommand('vscode.openWith', filePath, VSCodeSettings.editor.viewType);
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
            path: `${prefix}/model/${name}.uml`
        };
    }

    protected diagramDestination(input: string): string {
        return this.diagramTarget(input).path;
    }
}
