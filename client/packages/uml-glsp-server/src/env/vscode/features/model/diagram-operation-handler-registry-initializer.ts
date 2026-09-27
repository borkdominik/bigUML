/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { CreateOperationHandler, OperationHandlerRegistryInitializer } from '@eclipse-glsp/server';
import { inject, injectable, postConstruct } from 'inversify';
import { DiagramModelState } from './diagram-model-state.js';

/**
 * Extends the default {@link OperationHandlerRegistryInitializer} to re-register
 * operation handlers whenever the source model is loaded. This is necessary because
 * create handlers (e.g. {@link GenericCreateNodeOperationHandler}) resolve their
 * element type IDs from {@link DiagramLanguageMetadata}, which in turn depends on
 * the diagram type stored in {@link DiagramModelState}. That type is only available
 * after {@link DiagramModelState.setSemanticRoot} is called, which happens during
 * {@link DiagramModelStorage.loadSourceModel}.
 */
@injectable()
export class DiagramOperationHandlerRegistryInitializer extends OperationHandlerRegistryInitializer {
    @inject(DiagramModelState)
    protected readonly modelState: DiagramModelState;

    @postConstruct()
    protected init(): void {
        this.modelState.onDidLoadSourceModel(() => this.reregisterHandlers());
    }

    /**
     * Only the create handlers: they are registered once per element type they create, and which types
     * those are is not known until the model has loaded. Every other handler is keyed by its operation
     * alone and was registered correctly the first time - registering it again is refused as a duplicate.
     */
    protected reregisterHandlers(): void {
        this.handlerConstructors
            .map(constructor => this.factory(constructor))
            .filter(handler => CreateOperationHandler.is(handler))
            .forEach(handler => this.registry.registerHandler(handler));
    }
}
