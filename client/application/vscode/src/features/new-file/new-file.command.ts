/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { type VSCodeCommand } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { inject, injectable } from 'inversify';
import * as vscode from 'vscode';
import { type Uri } from 'vscode';
import { NewFileCreator } from './new-file.creator.js';

@injectable()
export class NewFileCommand implements VSCodeCommand {
    constructor(@inject(NewFileCreator) private creator: NewFileCreator) {}

    get id(): string {
        return 'bigUML.model.newEmpty';
    }

    execute(...args: any[]): void {
        createNewUmlDiagram();
        return;
        let uri: Uri | undefined = undefined;
        if (args[0] !== undefined && args[0] !== null) {
            uri = args[0];
        }

        this.creator.create(uri);
    }
}

async function createNewUmlDiagram(): Promise<void> {
    const wf = vscode.workspace.workspaceFolders?.[0];
    if (!wf) {
        vscode.window.showErrorMessage('Open a workspace folder first.');
        return;
    }

    console.log('[bigUML] Workspace:', wf.uri.fsPath);

    // let the user name the file
    const name = await vscode.window.showInputBox({
        prompt: 'New UML diagram file name (without extension)',
        value: 'class_' + Date.now(),
        validateInput: v => (v.trim() ? undefined : 'Please provide a file name')
    });
    if (!name) {
        console.log('[bigUML] User cancelled diagram creation');
        return;
    }

    console.log('[bigUML] Diagram name chosen:', name);

    // choose the target subfolder; keep it simple (class_diagram) for now
    const targetDir = vscode.Uri.joinPath(wf.uri, 'class_diagram');
    console.log('[bigUML] Target dir:', targetDir.fsPath);
    await vscode.workspace.fs.createDirectory(targetDir);

    const file = vscode.Uri.joinPath(targetDir, `${name}.uml`);
    console.log('[bigUML] Target file:', file.fsPath);

    // Avoid accidental overwrite
    try {
        await vscode.workspace.fs.stat(file);
        console.log('[bigUML] File already exists, asking overwrite');
        const overwrite = await vscode.window.showWarningMessage(`${file.fsPath} already exists. Overwrite?`, 'Overwrite', 'Cancel');
        if (overwrite !== 'Overwrite') {
            return;
        }
    } catch {
        /* file does not exist — OK */
        console.log('[bigUML] File does not exist yet, creating new one');
    }

    // minimal valid model your server can parse
    const minimalModel = {
        diagram: {
            __type: 'ClassDiagram',
            __id: 'ClassDiagram1',
            diagramType: 'CLASS',
            entities: [],
            relations: []
        },
        metaInfos: []
    };

    console.log('[bigUML] Writing minimal model JSON');
    await vscode.workspace.fs.writeFile(file, Buffer.from(JSON.stringify(minimalModel, null, 2), 'utf8'));

    // open with your custom editor (matches contributes.customEditors.viewType)
    const viewType = 'bigUML.diagramView';

    console.log('[bigUML] Opening new file with custom editor');
    await vscode.commands.executeCommand('vscode.openWith', file, viewType);
}
