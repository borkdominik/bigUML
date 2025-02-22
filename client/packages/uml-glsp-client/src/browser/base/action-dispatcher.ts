/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { ComputedBoundsAction, GLSPActionDispatcher, RequestAction, type Action, type ResponseAction } from '@eclipse-glsp/client';

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

    protected override handleAction(action: Action): Promise<void> {
        if (ComputedBoundsAction.is(action)) {
            console.log('Handling ComputedBoundsAction');
        }
        return super.handleAction(action);
    }
}
