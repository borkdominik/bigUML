/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { NotificationType } from 'vscode-messenger-common';

export namespace WebviewProtocol {
    export const Ready: NotificationType<boolean> = { method: 'webview/ready' };
}
