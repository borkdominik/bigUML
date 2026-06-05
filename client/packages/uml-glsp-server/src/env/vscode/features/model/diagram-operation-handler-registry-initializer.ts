/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { OperationHandlerRegistryInitializer } from '@eclipse-glsp/server';
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

    protected reregisterHandlers(): void {
        const handlers = this.handlerConstructors.map(constructor => this.factory(constructor));
        handlers.forEach(handler => this.registry.registerHandler(handler));
    }
}
