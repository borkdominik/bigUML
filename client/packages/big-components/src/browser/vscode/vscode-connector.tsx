/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { messenger } from '@borkdominik-biguml/big-components';
import { ActionMessageNotification, WebviewReadyNotification } from '@borkdominik-biguml/big-vscode-integration';
import type { Action, ActionMessage } from '@eclipse-glsp/protocol';
import { useCallback, useEffect, useState, type ReactElement } from 'react';
import { HOST_EXTENSION } from 'vscode-messenger-common';
import { VSCodeContext } from './vscode-context.js';

messenger.start();

export interface VSCodeConnectorProps {
    children: React.ReactNode;
}

export function VSCodeConnector(props: VSCodeConnectorProps): ReactElement {
    const [clientId, setClientId] = useState<string | undefined>();
    const [isReady, setIsReady] = useState<boolean>(false);

    useEffect(() => {
        if (isReady) {
            return;
        }

        setIsReady(true);
        messenger.sendNotification(WebviewReadyNotification, HOST_EXTENSION);
    }, [isReady]);

    useEffect(() => {
        const dispose = messenger.listenNotification<ActionMessage>(ActionMessageNotification, message => {
            setClientId(message.clientId);
        });
        return () => {
            dispose.dispose();
        };
    }, [props]);

    const listenAction = useCallback((handler: (action: Action) => void) => {
        return messenger.listenNotification<ActionMessage>(ActionMessageNotification, message => {
            handler(message.action);
        });
    }, []);

    const dispatchAction = useCallback(
        (action: Action) => {
            if (!clientId) {
                throw new Error('Client ID is not set');
            }

            messenger.sendNotification(ActionMessageNotification, HOST_EXTENSION, {
                clientId,
                action
            });
        },
        [clientId]
    );

    return (
        <VSCodeContext.Provider
            value={{
                clientId,
                listenNotification: (type, handler) => messenger.onNotification(type, handler),
                dispatchNotification: (type, params) => messenger.sendNotification(type, HOST_EXTENSION, params),
                listenAction,
                dispatchAction
            }}
        >
            {props.children}
        </VSCodeContext.Provider>
    );
}
