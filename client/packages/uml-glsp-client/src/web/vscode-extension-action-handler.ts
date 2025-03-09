/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { VscodeAction } from '@borkdominik-biguml/big-vscode-integration';
import { type ICommand } from '@eclipse-glsp/client';
import type { Action } from '@eclipse-glsp/protocol';
import { HostExtensionActionHandler } from '@eclipse-glsp/vscode-integration-webview';
import { injectable } from 'inversify';

/**
 * Delegates actions that should be handled inside of the  host extension instead
 * of the webview. This enables the implementation of action handlers that require access
 * to the vscode API.
 */
@injectable()
export class UMLHostExtensionActionHandler extends HostExtensionActionHandler {
    override handle(action: Action): void | Action | ICommand {
        if (this.actionKinds.includes(action.kind)) {
            const message = {
                clientId: this.diagramOptions.clientId,
                action: VscodeAction.markExtensionOnly(action)
            };
            this.glspClient?.sendActionMessage(message);
        }
    }
}
