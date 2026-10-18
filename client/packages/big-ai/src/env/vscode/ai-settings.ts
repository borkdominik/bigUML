/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import * as vscode from 'vscode';

/** Whether the AI features are enabled through the `bigUML.ai.enabled` setting. Read once on activation. */
export function isAiEnabled(): boolean {
    return vscode.workspace.getConfiguration('bigUML.ai').get<boolean>('enabled', true);
}
