/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import * as vscode from 'vscode';

export interface WebviewResource {
    document: vscode.CustomDocument;
    webviewPanel: vscode.WebviewPanel;
    token: vscode.CancellationToken;
}

export interface WebviewResolver {
    resolve(resource: WebviewResource): Promise<void>;
}
