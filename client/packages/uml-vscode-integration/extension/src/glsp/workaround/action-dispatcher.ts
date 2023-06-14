/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import {
    Action,
    ActionHandlerRegistration,
    IActionDispatcher,
    IActionHandler,
    isInjectable,
    MultiInstanceRegistry,
    RequestAction,
    ResponseAction
} from '@eclipse-glsp/client';
import { inject, injectable, interfaces, multiInject, optional } from 'inversify';
import { TYPES } from '../../di.types';

/**
 * Workaround Action Dispatcher until the framework supports it directly
 * TODO: Add support
 */
@injectable()
export class ActionDispatcher implements IActionDispatcher {
    @inject(TYPES.ActionHandlerRegistryProvider) protected actionHandlerRegistryProvider: () => Promise<ActionHandlerRegistry>;

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
 * Workaround Action Registry until the framework supports it directly
 * TODO: Add support
 */
@injectable()
export class ActionHandlerRegistry extends MultiInstanceRegistry<IActionHandler> {
    constructor(@multiInject(TYPES.ActionHandlerRegistration) @optional() registrations: ActionHandlerRegistration[]) {
        super();
        registrations.forEach(registration => this.register(registration.actionKind, registration.factory()));
    }
}

export function configureActionHandler(
    context: { bind: interfaces.Bind; isBound: interfaces.IsBound },
    kind: string,
    constr: interfaces.ServiceIdentifier<IActionHandler>
): void {
    if (typeof constr === 'function') {
        if (!isInjectable(constr)) {
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
