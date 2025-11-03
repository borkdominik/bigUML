/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import 'reflect-metadata';

import { configureDefaultCommands } from '@eclipse-glsp/vscode-integration/node.js';
import { Container } from 'inversify';
import * as vscode from 'vscode';
import { LanguageClient } from 'vscode-languageclient/node.js';
import { createContainer } from './di.config.js';
import { TYPES } from './di.types.js';
import { UVGlspConnector } from './glsp/uv-glsp-connector.js';
import { UVGlspServer } from './glsp/uv-glsp-server.js';
import { VSCodeSettings } from './language.js';
import { createLanguageClientConfig, createModelServerConfig } from './languageclient/uv-languageclient.js';
import { createGLSPServerConfig } from './server/glsp-server.launcher.js';
import { ServerManager } from './server/server.manager.js';

let diContainer: Container | undefined;

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    console.log('ACTIVATING EXTENSION');

    // Start server process using quickstart component
    const languageClientConfig = createLanguageClientConfig(context);
    const modelServerConfig = createModelServerConfig();
    const glspServerConfig = createGLSPServerConfig();
    // Wrap server with quickstart component

    console.log('GOT MODELSERVER CONFIG AND GLSP SERVER CONFIG');

    diContainer = createContainer(context, {
        glspServerConfig,
        languageClientConfig,
        modelServerConfig
    });
    console.log('CREATED DI CONTAINER');
    configureDefaultCommands({
        extensionContext: context,
        connector: diContainer.get<UVGlspConnector>(TYPES.Connector),
        diagramPrefix: VSCodeSettings.commands.prefix
    });
    context.subscriptions.push(
        vscode.commands.registerCommand('bigUML.model.createEmpty', async () => {
            await createNewUmlDiagram();
        })
    );
    console.log('CONFIGURED DEFAULT COMMANDS');
    diContainer.getAll<any>(TYPES.RootInitialization);
    console.log('GOT ALL ROOT INITIALIZATION');
    diContainer.get<LanguageClient>(TYPES.LanguageClient).start();
    console.log('STARTED LANGUAGE CLIENT');
    setTimeout(() => {
        diContainer!.get<UVGlspServer>(TYPES.GlspServer).start();
        console.log('STARTED GLSP SERVER');
        setTimeout(() => {
            diContainer!.get<ServerManager>(TYPES.ServerManager).start();
            console.log('STARTED SERVER MANAGER');
            vscode.commands.executeCommand('setContext', `${VSCodeSettings.name}.isRunning`, true);
        }, 3000);
    }, 5000);
}

export async function deactivate(context: vscode.ExtensionContext): Promise<any> {
    if (diContainer) {
        return Promise.all([diContainer.get<ServerManager>(TYPES.ServerManager).stop()]);
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
