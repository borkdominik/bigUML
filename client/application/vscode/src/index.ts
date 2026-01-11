/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import 'reflect-metadata';

import '../css/colors.css';

import type * as vscode from 'vscode';
import { activateClient, deactivateClient } from './extension.client.js';
import { activateServer, deactivateServer } from './extension.server.js';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    await activateServer(context);
    await activateClient(context);
}

export async function deactivate(context: vscode.ExtensionContext): Promise<void> {
    await deactivateClient(context);
    await deactivateServer();
}
