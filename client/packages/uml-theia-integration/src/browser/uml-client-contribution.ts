/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
import { Args, ClientState, ConnectionProvider, GLSPClient, JsonrpcGLSPClient, MaybePromise } from '@eclipse-glsp/client';
import { BaseGLSPClientContribution } from '@eclipse-glsp/theia-integration/lib/browser';
import { TheiaJsonrpcGLSPClient } from '@eclipse-glsp/theia-integration/lib/browser/theia-jsonrpc-glsp-client';
import { injectable } from 'inversify';
import { MessageConnection } from 'vscode-jsonrpc';

import { UmlLanguage } from '../common/uml-language';

export interface UmlInitializeOptions {
    timestamp: Date;
    modelServerURL: string;
}

@injectable()
export class UmlGLSPClientContribution extends BaseGLSPClientContribution {
    readonly id = UmlLanguage.contributionId;
    readonly fileExtensions = UmlLanguage.fileExtensions;

    protected override createInitializeOptions(): MaybePromise<Args | undefined> {
        return {
            ['timestamp']: new Date().toString(),
            ['modelServerURL']: 'http://localhost:8081/api/v2/'
        };
    }

    protected override createGLSPCLient(connectionProvider: ConnectionProvider): GLSPClient {
        return new UmlCLient({
            id: this.id,
            connectionProvider,
            messageService: this.messageService
        });
    }
}

class UmlCLient extends TheiaJsonrpcGLSPClient {
    override async start(): Promise<void> {
        try {
            this.state = ClientState.Starting;
            const connection = await this.resolveConnection2();
            connection.listen();
            this.resolvedConnection = connection;
            this.state = ClientState.Running;
        } catch (error) {
            JsonrpcGLSPClient.error('Failed to start connection to server', error);
            this.state = ClientState.StartFailed;
        }
    }

    protected resolveConnection2(): Promise<MessageConnection> {
        if (!this.connectionPromise) {
            this.connectionPromise = this.doCreateConnection();
        }
        return this.connectionPromise;
    }
}
