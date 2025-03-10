/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { VscodeAction } from '@borkdominik-biguml/big-vscode-integration';
import { ActionDispatcher, GLSPActionDispatcher, OptionalAction, RequestAction, ResponseAction, type Action } from '@eclipse-glsp/client';

export class UMLActionDispatcher extends GLSPActionDispatcher {
    override requestUntil<Res extends ResponseAction>(
        action: RequestAction<Res>,
        timeoutMs = 10000,
        rejectOnTimeout = false
    ): Promise<Res> {
        if (!action.requestId && action.requestId === '') {
            // No request id has been specified. So we use a generated one.
            action.requestId = RequestAction.generateRequestId();
        }

        const requestId = action.requestId;
        const timeout = setTimeout(() => {
            const deferred = this.requests.get(requestId);
            if (deferred !== undefined) {
                // cleanup
                clearTimeout(timeout);
                this.requests.delete(requestId);

                const notification = 'Request ' + requestId + ' (' + action.kind + ') time out after ' + timeoutMs + 'ms.';
                if (rejectOnTimeout) {
                    deferred.reject(notification);
                } else {
                    this.logger.info(this, notification, action);
                    deferred.resolve();
                }
            }
        }, timeoutMs);
        this.timeouts.set(requestId, timeout);

        return super.request(action);
    }

    /**
     * Changes: Does not clear the responseId for VSCode requests.
     */
    protected override handleAction(action: Action): Promise<void> {
        if (ResponseAction.hasValidResponseId(action)) {
            // clear timeout
            const timeout = this.timeouts.get(action.responseId);
            if (timeout !== undefined) {
                clearTimeout(timeout);
                this.timeouts.delete(action.responseId);
            }

            // Check if we have a pending request for the response.
            // If not the  we clear the responseId => action will be dispatched normally
            const deferred = this.requests.get(action.responseId);
            if (deferred === undefined && !VscodeAction.isVSCodeRequestId(action.responseId)) {
                action.responseId = '';
            }
        }

        if (!this.hasHandler(action) && OptionalAction.is(action)) {
            return Promise.resolve();
        }

        return ActionDispatcher.prototype['handleAction'].call(this, action);
    }
}
