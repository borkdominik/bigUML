/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import type * as vscode from 'vscode';

export interface StageContext {
    document: vscode.CustomDocument;
    webviewPanel: vscode.WebviewPanel;
    token: vscode.CancellationToken;
}

export interface EditorStageResolver {
    resolve(context: StageContext): Promise<void>;
}
