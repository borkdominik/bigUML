/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Advanced Search - integration', () => {
    test('Advanced Search view can be shown in the UML panel', async () => {
        const extensionId = 'BIGModelingTools.umldiagram'; // publisher.name
        const extension = vscode.extensions.getExtension(extensionId);

        assert.ok(extension, `Extension ${extensionId} not found`);

        await extension!.activate();
        assert.ok(extension!.isActive, 'Extension did not activate');

        await vscode.commands.executeCommand('workbench.view.extension.bigUML-panel');

        await vscode.commands.executeCommand('bigUML.panel.advancedsearch.focus');

        assert.ok(true);
    });
});
