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
import { UmlDiagramType } from '@eclipsesource/uml-glsp/lib/common/uml-language';
import { inject, injectable } from 'inversify';
import URI from 'urijs';
import * as vscode from 'vscode';
import { TYPES } from '../../di.types';
import { VSCodeModelServerClient } from '../../modelserver/modelserver.client';

@injectable()
export class NewDiagramFileCreator {
    readonly options;

    constructor(
        @inject(TYPES.ModelServerClient)
        protected readonly client: VSCodeModelServerClient
    ) {
        this.options = {
            allowedTypes: [UmlDiagramType.CLASS.toLowerCase(), UmlDiagramType.COMMUNICATION.toLocaleLowerCase()]
        };
    }

    async start(): Promise<void> {
        const diagramName = await this.showInput('Diagram name', 'Enter name of UML diagram', async input =>
            input ? undefined : 'Diagram name can not be empty'
        );

        if (diagramName !== undefined) {
            const diagramType = await this.showInput(this.options.allowedTypes.join(' | '), 'Enter UML diagram type', async input =>
                this.options.allowedTypes.includes(input) ? undefined : `${input} is not a valid value`
            );

            if (diagramType !== undefined) {
                this.createUmlDiagram(diagramName, diagramType);
            }
        }
    }

    protected createUmlDiagram(diagramName: string, diagramType: string): void {
        const workspaces = vscode.workspace.workspaceFolders;
        if (workspaces && workspaces.length > 0) {
            const workspaceRoot = new URI(workspaces[0].uri.toString());
            const modelUri = new URI(workspaceRoot + `/${diagramName}/model/${diagramName}.uml`);

            this.client.create(
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
