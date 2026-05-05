/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { Action } from '@eclipse-glsp/protocol';
import { createContext } from 'react';
import type { NotificationHandler, NotificationType } from 'vscode-messenger-common';

/**
 * VSCodeContext is a context that provides methods to communicate with the VSCode extension.
 * It is used to send and receive notifications and actions.
 *
 * @see {@link https://github.com/TypeFox/vscode-messenger}
 */
export interface VSCodeContext {
    clientId?: string;
    /**
     * Listen for a notification of the given type.
     */
    listenNotification: <P>(type: NotificationType<P>, handler: NotificationHandler<P>) => void;
    /**
     * Dispatch a notification of the given type with the given parameters.
     */
    dispatchNotification: <P>(type: NotificationType<P>, params?: P) => void;
    /**
     * Listen for an action notification.
     */
    listenAction: (handler: (action: Action) => void) => void;
    /**
     * Dispatch an action notification.
     * The client id will be automatically added to the action.
     */
    dispatchAction: (action: Action) => void;
}

export const VSCodeContext = createContext<VSCodeContext>({} as any);
