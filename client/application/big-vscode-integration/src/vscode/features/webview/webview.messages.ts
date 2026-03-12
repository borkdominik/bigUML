/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type ActionMessage } from '@eclipse-glsp/protocol';
import { type NotificationType } from 'vscode-messenger-common';

/**
 * Notification to send/receive a message from/to the webview.
 */
export const ActionMessageNotification: NotificationType<ActionMessage> = { method: 'actionMessage' };

/**
 * Notification to notify the webview that it is ready.
 */
export const WebviewReadyNotification: NotificationType<ActionMessage> = { method: 'webviewReady' };

export interface WebviewOptions {
    clientId: string;
}

/**
 * Notification to initialize the webview after it is ready.
 */
export const SetupWebviewNotification: NotificationType<WebviewOptions> = { method: 'setupWebview' };
