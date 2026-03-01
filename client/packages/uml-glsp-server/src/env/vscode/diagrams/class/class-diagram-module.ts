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
    type ContextActionsProvider,
    type ContextEditValidator,
    type DiagramConfiguration,
    type GModelFactory,
    type GModelIndex,
    type GModelSerializer,
    type InstanceMultiBinding,
    type LabelEditValidator,
    type ModelState,
    type ModelValidator,
    type MultiBinding,
    type OperationHandlerConstructor,
    type PopupModelFactory,
    type SourceModelStorage,
    type ToolPaletteItemProvider
} from '@eclipse-glsp/server';
import { injectable, type interfaces } from 'inversify';
import { ClassDiagramLanguageMetadata } from '../../../../gen/vscode/diagram/class/class-diagram-language-metadata.js';
import { ClassDiagramToolPaletteItemProvider } from '../../../../gen/vscode/diagram/class/class-diagram-tool-palette-item-provider.js';
import {
    GenericChangeBoundsOperationHandler,
    GenericCreateEdgeOperationHandler,
    GenericCreateNodeOperationHandler,
    GenericDeleteOperationHandler,
    GenericDiagramModelValidator,
    GenericLabelEditOperationHandler,
    GenericUpdateOperationHandler
} from '../../features/index.js';
import { DiagramLanguageMetadata } from '../../features/model/diagram-language-metadata.js';
import { BigDiagramModule } from '../../features/module/module.js';
import { ClassDiagramConfiguration } from './class-diagram-configuration.js';
import { ClassLabelEditValidator } from './features/index.js';
import { ClassDiagramGModelFactory } from './model/class-diagram-gmodel-factory.js';
import { ClassDiagramGModelSerializer } from './model/class-diagram-gmodel-serializer.js';
import { ClassDiagramModelIndex } from './model/class-diagram-model-index.js';
import { ClassDiagramModelState } from './model/class-diagram-model-state.js';
import { ClassDiagramModelStorage } from './model/class-diagram-model-storage.js';

@injectable()
export class ClassDiagramModule extends BigDiagramModule {
    readonly diagramType = 'uml-diagram';

    protected override configure(
        bind: interfaces.Bind,
        unbind: interfaces.Unbind,
        isBound: interfaces.IsBound,
        rebind: interfaces.Rebind
    ): void {
        super.configure(bind, unbind, isBound, rebind);
        bind(DiagramLanguageMetadata).to(ClassDiagramLanguageMetadata).inSingletonScope();
    }

    protected bindDiagramConfiguration(): BindingTarget<DiagramConfiguration> {
        return ClassDiagramConfiguration;
    }

    protected bindSourceModelStorage(): BindingTarget<SourceModelStorage> {
        return ClassDiagramModelStorage;
    }

    protected bindModelState(): BindingTarget<ModelState> {
        this.context.bind(ClassDiagramModelState).toSelf().inSingletonScope();
        return { service: ClassDiagramModelState };
    }

    protected bindGModelFactory(): BindingTarget<GModelFactory> {
        return ClassDiagramGModelFactory;
    }

    protected override bindGModelSerializer(): BindingTarget<GModelSerializer> {
        return ClassDiagramGModelSerializer;
    }

    protected override configureOperationHandlers(binding: InstanceMultiBinding<OperationHandlerConstructor>): void {
        super.configureOperationHandlers(binding);
        binding.add(GenericCreateNodeOperationHandler);
        binding.add(GenericCreateEdgeOperationHandler);
        binding.add(GenericChangeBoundsOperationHandler);
        binding.add(GenericLabelEditOperationHandler);
        binding.add(GenericUpdateOperationHandler);
        binding.add(GenericDeleteOperationHandler);
    }

    protected override bindGModelIndex(): BindingTarget<GModelIndex> {
        this.context.bind(ClassDiagramModelIndex).toSelf().inSingletonScope();
        return { service: ClassDiagramModelIndex };
    }

    protected override bindToolPaletteItemProvider(): BindingTarget<ToolPaletteItemProvider> {
        return ClassDiagramToolPaletteItemProvider;
    }

    protected override bindLabelEditValidator(): BindingTarget<LabelEditValidator> | undefined {
        return ClassLabelEditValidator;
    }

    protected override bindPopupModelFactory(): BindingTarget<PopupModelFactory> | undefined {
        return undefined;
    }

    protected override bindModelValidator(): BindingTarget<ModelValidator> | undefined {
        return GenericDiagramModelValidator;
    }

    protected override configureContextActionProviders(binding: MultiBinding<ContextActionsProvider>): void {
        super.configureContextActionProviders(binding);
    }

    protected override configureContextEditValidators(binding: MultiBinding<ContextEditValidator>): void {
        super.configureContextEditValidators(binding);
    }

    protected override configureActionHandlers(binding: InstanceMultiBinding<ActionHandlerConstructor>): void {
        super.configureActionHandlers(binding);
    }
}
