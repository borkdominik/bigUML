/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import {
    type ActionHandlerConstructor,
    type BindingTarget,
    DiagramModule,
    type GModelIndex,
    type GModelSerializer,
    type InstanceMultiBinding,
    type ModelState,
    type ModelValidator,
    type OperationHandlerConstructor,
    type SourceModelStorage
} from '@eclipse-glsp/server';
import { GenericLabelEditOperationHandler } from '../labeledit/generic-label-edit-operation-handler.js';
import { DiagramGModelSerializer } from '../model/diagram-gmodel-serializer.js';
import { DiagramModelIndex } from '../model/diagram-model-index.js';
import { DiagramModelState } from '../model/diagram-model-state.js';
import { DiagramModelStorage } from '../model/diagram-model-storage.js';
import { CreateNewFileActionHandler } from '../model/handler/create-new-file-action-handler.js';
import { RequestSemanticModelActionHandler } from '../model/index.js';
import {
    GenericChangeBoundsOperationHandler,
    GenericCreateEdgeOperationHandler,
    GenericCreateNodeOperationHandler,
    GenericDeleteOperationHandler,
    GenericUpdateOperationHandler
} from '../mutation/index.js';
import { GenericDiagramModelValidator } from '../validator/generic-diagram-model-validator.js';

export class DiagramFeatureModule {
    configureOperationHandlers?(binding: InstanceMultiBinding<OperationHandlerConstructor>): void;
    configureActionHandlers?(binding: InstanceMultiBinding<ActionHandlerConstructor>): void;
}

export abstract class BigDiagramModule extends DiagramModule {
    protected featureModules: DiagramFeatureModule[] = [];

    addDiagramFeatureModule(module: DiagramFeatureModule): void {
        this.featureModules.push(module);
    }

    protected bindSourceModelStorage(): BindingTarget<SourceModelStorage> {
        return DiagramModelStorage;
    }

    protected bindModelState(): BindingTarget<ModelState> {
        this.context.bind(DiagramModelState).toSelf().inSingletonScope();
        return { service: DiagramModelState };
    }

    protected override bindGModelSerializer(): BindingTarget<GModelSerializer> {
        return DiagramGModelSerializer;
    }

    protected override bindGModelIndex(): BindingTarget<GModelIndex> {
        this.context.bind(DiagramModelIndex).toSelf().inSingletonScope();
        return { service: DiagramModelIndex };
    }

    protected override bindModelValidator(): BindingTarget<ModelValidator> | undefined {
        return GenericDiagramModelValidator;
    }

    protected override configureOperationHandlers(binding: InstanceMultiBinding<OperationHandlerConstructor>): void {
        super.configureOperationHandlers(binding);
        binding.add(GenericChangeBoundsOperationHandler);
        binding.add(GenericCreateNodeOperationHandler);
        binding.add(GenericCreateEdgeOperationHandler);
        binding.add(GenericLabelEditOperationHandler);
        binding.add(GenericUpdateOperationHandler);
        binding.add(GenericDeleteOperationHandler);

        for (const module of this.featureModules) {
            module.configureOperationHandlers?.(binding);
        }
    }

    protected override configureActionHandlers(binding: InstanceMultiBinding<ActionHandlerConstructor>): void {
        super.configureActionHandlers(binding);
        binding.add(CreateNewFileActionHandler);
        binding.add(RequestSemanticModelActionHandler);

        for (const module of this.featureModules) {
            module.configureActionHandlers?.(binding);
        }
    }
}
