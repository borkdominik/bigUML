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
import { UmlDiagramType } from '@borkdominik-biguml/uml-common';
import { inject, injectable } from 'inversify';
import URIJS from 'urijs';
import * as vscode from 'vscode';
import { TYPES, VSCODE_TYPES } from '../../di.types';
import { UVLangugageEnvironment, VSCodeSettings } from '../../language';
import { UVModelServerClient } from '../../modelserver/uv-modelserver.client';
import { EditorProvider } from '../editor/editor.provider';
import { newDiagramWizard } from './wizard';

@injectable()
export class NewFileCreator {
    constructor(
        @inject(TYPES.ModelServerClient)
        protected readonly modelServerClient: UVModelServerClient,
        @inject(VSCODE_TYPES.EditorProvider)
        protected readonly editor: EditorProvider,
        @inject(VSCODE_TYPES.ExtensionContext)
        protected readonly context: vscode.ExtensionContext
    ) {}

    async create(): Promise<void> {
        const wizard = await newDiagramWizard(this.context, {
            diagramTypes: UVLangugageEnvironment.supportedTypes,
            nameValidator: async input => {
                if (!input || input.trim().length === 0) {
                    return 'Name can not be empty';
                }

                const models = await this.modelServerClient.getAll();

                if (models.some(model => model.modeluri.endsWith(`${input}.uml`))) {
                    return 'Name already exists';
                }

                return undefined;
            }
        });

        if (wizard !== undefined) {
            this.createUmlDiagram(wizard.name.trim(), wizard.diagramPick.diagramType);
        }
    }

    protected createUmlDiagram(diagramName: string, diagramType: UmlDiagramType): void {
        const workspaces = vscode.workspace.workspaceFolders;
        if (workspaces && workspaces.length > 0) {
            const workspaceRoot = new URIJS(decodeURIComponent(workspaces[0].uri.toString()));
            const modelUri = new URIJS(workspaceRoot + `/${diagramName}/model/${diagramName}.uml`);

            this.modelServerClient
                .create(
                    modelUri,
                    {
                        data: {
                            $type: 'com.eclipsesource.uml.modelserver.model.impl.NewDiagramRequestImpl',
                            diagramType
                        }
                    },
                    undefined,
                    'raw-json'
                )
                .then(async () => {
                    await vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
                    const filePath = vscode.Uri.file(modelUri.path().toString());
                    vscode.commands.executeCommand('vscode.openWith', filePath, VSCodeSettings.editor.viewType);
                });
        }
    }

    protected async showInput(
        placeHolder: string,
        hint: string,
        inputCheck?: (input: string) => Promise<string | undefined>
    ): Promise<string | undefined> {
        return vscode.window.showInputBox({
            prompt: hint,
            placeHolder: placeHolder,
            validateInput: async input => {
                if (inputCheck) {
                    return inputCheck(input);
                }
                return !input ? 'Please enter a valid string' : undefined;
            }
        });
    }
}
