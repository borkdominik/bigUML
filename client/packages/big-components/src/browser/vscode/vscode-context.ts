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
import type { MessengerAPI } from 'vscode-messenger-common';

export interface VSCodeContext {
    clientId?: string;
    listenNotification: MessengerAPI['onNotification'];
    dispatchNotification: MessengerAPI['sendNotification'];
    listenAction: (handler: (action: Action) => void) => void;
    dispatchAction: (action: Action) => void;
}

export const VSCodeContext = createContext<VSCodeContext>({} as any);
