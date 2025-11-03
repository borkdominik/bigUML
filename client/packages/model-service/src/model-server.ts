/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/

import { AstNode, isAstNode, isReference } from 'langium';
import { Disposable } from 'vscode-jsonrpc';
import * as rpc from 'vscode-jsonrpc/node.js';
import { ModelService } from './model-service.js';

const OpenModel = new rpc.RequestType2<string, string | undefined, void, void>('server/open');
const CloseModel = new rpc.RequestType2<string, string | undefined, void, void>('server/close');
const RequestModel = new rpc.RequestType2<string, string | undefined, AstNode | undefined, void>('server/request');
const UpdateModel = new rpc.RequestType3<string, AstNode, string | undefined, void, void>('server/update');
const SaveModel = new rpc.RequestType3<string, AstNode, string | undefined, void, void>('server/save');
export const TestModel = new rpc.RequestType1<string, string, void>('server/test');
export const UndoModel = new rpc.RequestType1('server/undo');
export const RedoModel = new rpc.RequestType1('server/redo');
export const SaveCurrentModel = new rpc.RequestType1<string, void, void>('server/save/current');

export const PatchModel = new rpc.RequestType3<string, string, string, void, void>('server/patch');

export const ReferenceModel = new rpc.RequestType2<string, AstNode, void, void>('server/references');

/**
 * The model server handles request messages on the RPC connection and ensures that any return value
 * can be sent to the client by ensuring proper serialization of semantic models.
 */
export class ModelServer implements Disposable {
    protected toDispose: Disposable[] = [];

    constructor(
        protected connection: rpc.MessageConnection,
        protected modelService: ModelService
    ) {
        this.initialize(connection);
    }

    protected initialize(connection: rpc.MessageConnection): void {
        this.toDispose.push(connection.onRequest(OpenModel, (uri, client?) => this.openModel(uri, client)));
        this.toDispose.push(connection.onRequest(CloseModel, (uri, client?) => this.closeModel(uri, client)));
        this.toDispose.push(connection.onRequest(RequestModel, (uri, client?) => this.requestModel(uri, client)));
        this.toDispose.push(connection.onRequest(UpdateModel, (uri, model, client?) => this.updateModel(uri, model, client)));
        this.toDispose.push(connection.onRequest(SaveModel, (uri, model, client?) => this.saveModel(uri, model, client)));

        this.toDispose.push(connection.onRequest(TestModel, (uri: any) => this.testModel(uri)));

        this.toDispose.push(connection.onRequest(UndoModel, (uri: any) => this.undo(uri)));
        this.toDispose.push(connection.onRequest(RedoModel, (uri: any) => this.redo(uri)));

        this.toDispose.push(connection.onRequest(SaveCurrentModel, (uri: any, model: any) => this.saveModel(uri, model)));
        this.toDispose.push(connection.onRequest(ReferenceModel, (uri: any, ref: any) => this.getReferences(uri, ref)));
        this.toDispose.push(connection.onRequest(PatchModel, (uri: any, model: any, client: any) => this.patchModel(uri, model, client)));
    }

    protected async openModel(uri: string, client?: string): Promise<void> {
        if (client) {
            await this.modelService.open(uri, client);
        } else {
            await this.modelService.open(uri);
        }
    }

    protected async closeModel(uri: string, client?: string): Promise<void> {
        if (client) {
            await this.modelService.close(uri, client);
        } else {
            await this.modelService.close(uri);
        }
    }

    protected async requestModel(uri: string, client?: string): Promise<AstNode | undefined> {
        const root = client ? await this.modelService.request(uri, isAstNode, client) : await this.modelService.request(uri);
        return toSerializable(root);
    }

    protected async updateModel(uri: string, model: AstNode, client?: string): Promise<void> {
        if (client) {
            await this.modelService.update(uri, model, client);
        } else {
            await this.modelService.update(uri, model);
        }
    }

    protected async patchModel(uri: string, patch: string, client?: string): Promise<void> {
        if (client) {
            await this.modelService.patch(uri, patch, client);
        } else {
            await this.modelService.patch(uri, patch);
        }
    }

    protected async undo(uri: string): Promise<void> {
        await this.modelService.undo(uri);
    }

    protected async redo(uri: string): Promise<void> {
        await this.modelService.redo(uri);
    }

    protected async saveModel(uri: string, model: AstNode, client?: string): Promise<void> {
        if (client) {
            await this.modelService.save(uri, model);
        } else {
            await this.modelService.save(uri, model);
        }
    }

    protected async testModel(uri: string, _model?: AstNode): Promise<string> {
        let value = await this.modelService.test(uri);
        return value;
    }

    protected async getReferences(uri: string, reference: string): Promise<any> {
        return toSerializable(await this.modelService.getCrossReferences(uri, reference));
    }

    dispose(): void {
        this.toDispose.forEach(disposable => disposable.dispose());
    }
}

/**
 * Cleans the semantic object of any property that cannot be serialized as a String and thus cannot be sent to the client
 * over the RPC connection.
 *
 * @param obj semantic object
 * @returns serializable semantic object
 */
export function toSerializable<T extends object>(obj?: T): T | undefined {
    if (!obj) {
        return;
    }
    // We remove all $<property> from the semantic object with the exception of type
    // they are added by Langium but have no additional value on the client side
    // Furtermore we ensure that for references we use their string representation ($refText)
    // instead of their real value to avoid sending whole serialized object graphs
    return <T>Object.entries(obj)
        .filter(([key, _value]) => !key.startsWith('$') || key === '$type')
        .reduce((acc, [key, value]) => ({ ...acc, [key]: cleanValue(value) }), {});
}

function cleanValue(value: any): any {
    return isContainedObject(value) ? toSerializable(value) : resolvedValue(value);
}

function isContainedObject(value: any): boolean {
    return value === Object(value) && !isReference(value);
}

function resolvedValue(value: any): any {
    if (isReference(value)) {
        return value.$refText;
    }
    return value;
}
