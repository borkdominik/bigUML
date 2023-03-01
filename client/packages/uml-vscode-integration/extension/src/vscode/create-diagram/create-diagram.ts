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
import { parseDiagramType } from '@eclipsesource/uml-glsp/lib/common/uml-language';
import { UmlModelServerClient } from '@eclipsesource/uml-modelserver/lib/modelserver.client';
import * as vscode from 'vscode';

export class DiagramCreator {
    constructor(
        protected readonly client: UmlModelServerClient,
        protected readonly options: {
            allowedTypes: string[];
        }
    ) {}

    async openDialog(): Promise<void> {
        const diagramName = await this.showInput('Enter name of UML diagram', 'Diagram name', async input =>
            input ? undefined : 'Diagram name can not be empty'
        );

        const diagramType = await this.showInput('Enter UML diagram type', this.options.allowedTypes.join(' | '), async input =>
            this.options.allowedTypes.includes(input) ? undefined : `${input} is not a valid value`
        );

        this.createUmlDiagram(diagramName, diagramType);
    }

    protected createUmlDiagram(diagramName: string, diagramType: string): void {
        this.client.createUmlResource(diagramName, parseDiagramType(diagramType));
    }

    protected async showInput(prefix: string, hint: string, inputCheck: (input: string) => Promise<string | undefined>): Promise<string>;
    protected async showInput(
        prefix: string,
        hint: string,
        inputCheck?: (input: string) => Promise<string | undefined>
    ): Promise<string | undefined> {
        return vscode.window.showInputBox({
            prompt: prefix,
            placeHolder: hint,
            validateInput: async input => {
                if (inputCheck) {
                    return inputCheck(input);
                }
                return !input ? `Please enter a valid string for '${prefix}'` : undefined;
            }
        });
    }
}
