/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { type ActionHandlerRegistration } from '@eclipse-glsp/client';
import { Action, RequestAction, ResponseAction } from '@eclipse-glsp/protocol';
import { inject, injectable, interfaces, multiInject, optional } from 'inversify';
import { isInjectable } from 'sprotty/lib/utils/inversify';
import { MultiInstanceRegistry } from 'sprotty/lib/utils/registry';
import { TYPES } from '../../di.types';
import { UVGlspConnector } from '../uv-glsp-connector';

export interface IActionDispatcher {
    dispatch(action: Action): Promise<void>;
    dispatchAll(actions: Action[]): Promise<void>;
    request<Res extends ResponseAction>(action: RequestAction<Res>): Promise<Res>;
}

export interface IActionHandler {
    handle(action: Action): Action | void;
}

@injectable()
export class VSCodeActionDispatcher implements IActionDispatcher {
    @inject(TYPES.ActionHandlerRegistryProvider) protected actionHandlerRegistryProvider: () => Promise<ActionHandlerRegistry>;

    protected connector: UVGlspConnector;
    protected actionHandlerRegistry: ActionHandlerRegistry;
    protected initialized: Promise<void> | undefined;

    initialize(): Promise<void> {
        if (!this.initialized) {
            this.initialized = this.actionHandlerRegistryProvider().then(registry => {
                this.actionHandlerRegistry = registry;
            });
        }

        return this.initialized;
    }

    connect(connector: UVGlspConnector): void {
        this.connector = connector;
    }

    dispatchToActiveClient(action: Action): void;
    dispatchToActiveClient(action: Action[]): void;
    dispatchToActiveClient(action: Action | Action[]): void {
        this.connector.sendActionToActiveClient(action as Action[]);
    }

    dispatch(action: Action): Promise<void> {
        return this.initialize().then(() => this.handleAction(action));
    }

    dispatchAll(actions: Action[]): Promise<void> {
        return Promise.all(actions.map(action => this.dispatch(action))) as Promise<any>;
    }

    request<Res extends ResponseAction>(action: RequestAction<Res>): Promise<Res> {
        throw new Error('Method not implemented.');
    }

    protected handleAction(action: Action): Promise<void> {
        const handlers = this.actionHandlerRegistry.get(action.kind);

        const promises: Promise<any>[] = [];
        for (const handler of handlers) {
            const result = handler.handle(action);
            if (Action.is(result)) {
                promises.push(this.dispatch(result));
            }
        }

        return Promise.all(promises) as Promise<any>;
    }
}

/**
 * TODO: Workaround Action Registry until the framework supports it directly
 */
@injectable()
export class ActionHandlerRegistry extends MultiInstanceRegistry<IActionHandler> {
    constructor(@multiInject(TYPES.ActionHandlerRegistration) @optional() registrations: ActionHandlerRegistration[]) {
        super();
        registrations.forEach(registration => this.register(registration.actionKind, registration.factory() as IActionHandler));
    }
}

export function configureActionHandler(
    context: { bind: interfaces.Bind; isBound: interfaces.IsBound },
    kind: string,
    constr: interfaces.ServiceIdentifier<IActionHandler>
): void {
    if (typeof constr === 'function') {
        if (!isInjectable(constr as any)) {
            throw new Error(`Action handlers should be @injectable: ${constr.name}`);
        }
        if (!context.isBound(constr)) {
            context.bind(constr).toSelf();
        }
    }
    context.bind(TYPES.ActionHandlerRegistration).toDynamicValue(ctx => ({
        actionKind: kind,
        factory: () => ctx.container.get(constr)
    }));
}
