/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { RequestModelResourcesAction, type ModelResource, type UMLSourceModel } from '@borkdominik-biguml/uml-protocol';
import { DisposableCollection, UpdateModelAction, type Disposable, type TypeGuard } from '@eclipse-glsp/vscode-integration';
import { inject, injectable, postConstruct, preDestroy } from 'inversify';
import * as vscode from 'vscode';
import { TYPES } from '../../../vscode-common.types.js';
import type { ActionDispatcher } from '../../action/action-dispatcher.js';
import type { ActionListener } from '../../action/action-listener.js';
import type { ConnectionManager } from '../../connector/connection-manager.js';

/**
 * EXPERIMENTAL
 *
 * Event emitted when the model state changes.
 */
export interface ModelStateChangeEvent {
    clientId: string;
    state: ExperimentalModelState;
}

/**
 * EXPERIMENTAL
 *
 * This class allows to access the source model and its elements within the VSCode extension.
 * Usually, this is done by the server, but until we migrate to the NodeJS based server,
 * we can use this class to access the source model.
 */
export class ExperimentalModelState {
    protected readonly elements: Map<string, Readonly<unknown>> = new Map();

    constructor(protected readonly resources: ModelResource[]) {
        this.processElement(this.getSourceModel());
    }

    protected processElement(element: any): void {
        if (element && typeof element === 'object') {
            if ('id' in element) {
                this.elements.set(element.id, element);
            }

            for (const key in element) {
                if (Object.prototype.hasOwnProperty.call(element, key) && Array.isArray(element[key])) {
                    element[key].forEach((child: any) => this.processElement(child));
                } else if (Object.prototype.hasOwnProperty.call(element, key) && typeof element[key] === 'object') {
                    this.processElement(element[key]);
                }
            }
        }
    }

    /**
     * Returns all resources for a GLSP client.
     */
    getResources(): ReadonlyArray<ModelResource> {
        return this.resources;
    }

    /**
     * Returns the source model of the GLSP client.
     */
    getSourceModel(): Readonly<UMLSourceModel> {
        const resource = this.resources.find(resource => resource.format === 'json' && resource.uri.endsWith('.uml'));
        if (!resource) {
            throw new Error('No source model found');
        }

        return JSON.parse(resource.content) as any;
    }

    /**
     * Returns the source model element with the given ID for the GLSP client.
     */
    getSourceElement<T>(id: string, guard: TypeGuard<T>): Readonly<T> | undefined {
        const sourceModel = this.getSourceModel();
        return sourceModel.packagedElement?.find(element => element.id === id && guard(element)) as any;
    }
}

/**
 * EXPERIMENTAL
 *
 * This class is used to manage the model state of the GLSP server.
 * It is used to store the model state of the GLSP server and to notify the clients
 * about changes in the model state.
 *
 * It returns {@link ExperimentalModelState} which contains the source model and its elements.
 */
@injectable()
export class ExperimentalGLSPServerModelState implements Disposable {
    @inject(TYPES.ActionDispatcher)
    protected readonly actionDispatcher: ActionDispatcher;
    @inject(TYPES.ActionListener)
    protected readonly actionListener: ActionListener;
    @inject(TYPES.ConnectionManager)
    protected readonly connectionManager: ConnectionManager;

    protected readonly onDidChangeModelStateEmitter = new vscode.EventEmitter<ModelStateChangeEvent>();
    readonly onDidChangeModelState = this.onDidChangeModelStateEmitter.event;

    protected readonly modelStates: Map<string, ExperimentalModelState> = new Map();
    protected readonly toDispose = new DisposableCollection();

    @postConstruct()
    protected init(): void {
        this.toDispose.push(
            this.connectionManager.onDidDispose(client => {
                this.modelStates.delete(client.clientId);
            }),
            this.connectionManager.onDidActiveClientChange(async () => {
                await this.refreshModelState();
            }),
            this.actionListener.registerServerListener(async message => {
                if (UpdateModelAction.is(message.action)) {
                    await this.refreshModelState();
                }
            })
        );
    }

    @preDestroy()
    dispose(): void {
        this.toDispose.dispose();
    }

    async refreshModelState(): Promise<void> {
        const response = await this.actionDispatcher.request(RequestModelResourcesAction.create({ formats: ['json', 'xml'] }));
        const resources = Object.values(response.action.resources);

        const state = new ExperimentalModelState(resources);
        this.modelStates.set(response.clientId, state);
        this.onDidChangeModelStateEmitter.fire({ clientId: response.clientId, state });
    }

    /**
     * Returns the model state of the active client.
     * If no client is active, undefined is returned.
     */
    getModelState(): ExperimentalModelState | undefined {
        if (!this.connectionManager.activeClient) {
            return undefined;
        }

        return this.modelStates.get(this.connectionManager.activeClient.clientId);
    }
}
