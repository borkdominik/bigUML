/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import 'reflect-metadata';

import type * as vscode from 'vscode';
import { activate as extensionActivate, deactivate as extensionDeactivate } from './extension.js';

export function activate(context: vscode.ExtensionContext): Promise<void> {
    return extensionActivate(context);
}

export function deactivate(context: vscode.ExtensionContext): Promise<void> {
    return extensionDeactivate(context);
}
