/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Deferred, Disposable, GLSPClient } from '@eclipse-glsp/protocol';
import { inject, injectable } from 'inversify';
import { TYPES } from '../di.types.js';
import { VSCodeSettings } from '../language.js';
import { IDEServer, IDEServerClientId } from './ide-server';

@injectable()
export class IDESessionClient implements Disposable {
    protected _client: GLSPClient;
    protected readyDeferred = new Deferred<void>();
    protected isRunning = false;

    get onReady(): Promise<void> {
        return this.readyDeferred.promise;
    }

    constructor(@inject(TYPES.IDEServer) protected readonly server: IDEServer) {}

    dispose(): void {}

    protected async start(): Promise<void> {
        if (this.isRunning) {
            await this.onReady;
            return;
        }
        try {
            this.isRunning = true;
            await this.server.start();
            this._client = await this.server.glspClient;
            await this._client.start();
            await this._client.initializeClientSession({
                clientSessionId: IDEServerClientId,
                clientActionKinds: ['newFileResponse'],
                diagramType: VSCodeSettings.diagramType
            });
            this.readyDeferred.resolve();
        } catch (error) {
            this.readyDeferred.reject(error);
        }
    }

    async client(): Promise<GLSPClient> {
        if (this._client === undefined) {
            await this.start();
        }

        await this.onReady;
        return this._client;
    }
}
