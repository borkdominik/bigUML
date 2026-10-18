/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type AstNode, isReference } from 'langium';
import { type Disposable } from 'vscode-jsonrpc';
import * as rpc from 'vscode-jsonrpc/node.js';
import { type ClientId } from './client-id.js';
import { type ModelService } from './model-service.js';

/**
 * The requests a client may send the model server over JSON-RPC. Each one is answered by the
 * corresponding method of the {@link ModelService}; the model goes out in the wire form of
 * {@link toSerializable}.
 */
export const OpenModel = new rpc.RequestType2<string, ClientId | undefined, void, void>('server/open');
export const CloseModel = new rpc.RequestType2<string, ClientId | undefined, void, void>('server/close');
export const RequestModel = new rpc.RequestType2<string, ClientId | undefined, AstNode | undefined, void>('server/request');
export const UpdateModel = new rpc.RequestType3<string, AstNode, ClientId | undefined, void, void>('server/update');
export const SaveModel = new rpc.RequestType3<string, AstNode, ClientId | undefined, void, void>('server/save');
export const UndoModel = new rpc.RequestType1<string, void, void>('server/undo');
export const RedoModel = new rpc.RequestType1<string, void, void>('server/redo');
export const SaveCurrentModel = new rpc.RequestType2<string, AstNode, void, void>('server/save/current');
export const PatchModel = new rpc.RequestType3<string, string, ClientId | undefined, void, void>('server/patch');
export const ReferenceModel = new rpc.RequestType2<string, string, unknown, void>('server/references');

export class ModelServer implements Disposable {
    protected toDispose: Disposable[] = [];

    constructor(
        protected connection: rpc.MessageConnection,
        protected modelService: ModelService
    ) {
        this.toDispose.push(
            connection.onRequest(OpenModel, (uri, client) => this.modelService.open(uri, client)),
            connection.onRequest(CloseModel, (uri, client) => this.modelService.close(uri, client)),
            connection.onRequest(RequestModel, (uri, client) => this.requestModel(uri, client)),
            connection.onRequest(UpdateModel, async (uri, model, client) => {
                await this.modelService.update(uri, model, client);
            }),
            connection.onRequest(SaveModel, (uri, model) => this.modelService.save(uri, model)),
            connection.onRequest(SaveCurrentModel, (uri, model) => this.modelService.save(uri, model)),
            connection.onRequest(UndoModel, async uri => {
                await this.modelService.undo(uri);
            }),
            connection.onRequest(RedoModel, async uri => {
                await this.modelService.redo(uri);
            }),
            connection.onRequest(PatchModel, async (uri, patch, client) => {
                await this.modelService.patch(uri, patch, client);
            }),
            connection.onRequest(ReferenceModel, async (uri, reference) =>
                toSerializable(await this.modelService.getCrossReferences(uri, reference))
            )
        );
    }

    protected async requestModel(uri: string, client?: ClientId): Promise<AstNode | undefined> {
        return toSerializable(await this.modelService.request(uri, undefined, client));
    }

    dispose(): void {
        this.toDispose.forEach(disposable => disposable.dispose());
    }
}

/**
 * The model as it goes over the wire: without the `$`-properties Langium adds - `$type` excepted - and
 * with every reference as the text it was written as, rather than the whole graph it resolves to.
 */
export function toSerializable<T extends object>(obj?: T): T | undefined {
    if (!obj) {
        return undefined;
    }
    return Object.entries(obj)
        .filter(([key]) => !key.startsWith('$') || key === '$type')
        .reduce((acc, [key, value]) => ({ ...acc, [key]: cleanValue(value) }), {} as T);
}

function cleanValue(value: unknown): unknown {
    if (isReference(value)) {
        return value.$refText;
    }
    return typeof value === 'object' && value !== null ? toSerializable(value) : value;
}
