/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { CreateNewFileResponseAction } from '@borkdominik-biguml/uml-glsp-server';
import { Deferred, type Disposable, type GLSPClient } from '@eclipse-glsp/protocol';
import { inject, injectable } from 'inversify';
import type { GlspDiagramSettings } from '../../../vscode/features/glsp/settings.js';
import { TYPES } from '../../../vscode/vscode-common.types.js';
import { type IDEServer, IDEServerClientId } from './ide-server.js';

@injectable()
export class IDESessionClient implements Disposable {
    protected _client: GLSPClient;
    protected readyDeferred = new Deferred<void>();
    protected isRunning = false;

    get onReady(): Promise<void> {
        return this.readyDeferred.promise;
    }

    constructor(
        @inject(TYPES.IdeServer) protected readonly server: IDEServer,
        @inject(TYPES.GlspDiagramSettings) protected readonly diagramSettings: GlspDiagramSettings
    ) {}

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
                clientActionKinds: [CreateNewFileResponseAction.KIND],
                diagramType: this.diagramSettings.diagramType
            });
            (this._client as any)['id'] = IDEServerClientId;
            this.readyDeferred.resolve();
        } catch (error) {
            console.error('IDE Session client errored', error);
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
