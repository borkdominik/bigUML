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
    type CommandPaletteActionProvider,
    type ContextActionsProvider,
    type ContextEditValidator,
    type ContextMenuItemProvider,
    type DiagramConfiguration,
    DiagramModule,
    type GModelFactory,
    type GModelIndex,
    type InstanceMultiBinding,
    type LabelEditValidator,
    type ModelState,
    type ModelValidator,
    type MultiBinding,
    type NavigationTargetProvider,
    type NavigationTargetResolver,
    type OperationHandlerConstructor,
    type PopupModelFactory,
    type SourceModelStorage,
    type ToolPaletteItemProvider
} from '@eclipse-glsp/server';
import { injectable, type interfaces } from 'inversify';
// import { RequestClassOutlineActionHandler } from '../../yo-generated/outline/request-class-outline-action-handler.js';
// import { RequestClassPropertyPaletteActionHandler } from '../../yo-generated/property-palette/request-class-property-palette-action-handler.js';

import { ClassDiagramConfiguration } from './class-diagram-configuration.js';
import {
    ClassCreateEdgeOperationHandler,
    ClassCreateNodeOperationHandler,
    ClassDiagramChangeBoundsOperationHandler,
    ClassDiagramCommandPaletteActionProvider,
    ClassDiagramContextMenuItemProvider,
    ClassDiagramDeleteOperationHandler,
    ClassDiagramModelValidator,
    ClassDiagramNavigationTargetResolver,
    ClassDiagramNextNodeNavigationTargetProvider,
    ClassDiagramNodeDocumentationNavigationTargetProvider,
    ClassDiagramPreviousNodeNavigationTargetProvider,
    ClassDiagramToolPaletteItemProvider,
    ClassDiagramUpdateElementPropertyActionHandler,
    ClassDiagramUpdateOperationHandler,
    ClassLabelEditOperationHandler,
    ClassLabelEditValidator
} from './features/index.js';
import { ClassDiagramGModelFactory } from './model/class-diagram-gmodel-factory.js';
import { ClassDiagramModelIndex } from './model/class-diagram-model-index.js';
import { ClassDiagramModelState } from './model/class-diagram-model-state.js';
import { ClassDiagramModelStorage } from './model/class-diagram-model-storage.js';

@injectable()
export class ClassDiagramModule extends DiagramModule {
    readonly diagramType = 'uml-diagram';

    protected override configure(
        bind: interfaces.Bind,
        unbind: interfaces.Unbind,
        isBound: interfaces.IsBound,
        rebind: interfaces.Rebind
    ): void {
        super.configure(bind, unbind, isBound, rebind);
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

    protected override configureOperationHandlers(binding: InstanceMultiBinding<OperationHandlerConstructor>): void {
        super.configureOperationHandlers(binding);
        binding.add(ClassCreateNodeOperationHandler);
        binding.add(ClassCreateEdgeOperationHandler);
        binding.add(ClassDiagramChangeBoundsOperationHandler);
        binding.add(ClassLabelEditOperationHandler);
        binding.add(ClassDiagramUpdateOperationHandler);
        binding.add(ClassDiagramDeleteOperationHandler);
    }

    protected override bindGModelIndex(): BindingTarget<GModelIndex> {
        this.context.bind(ClassDiagramModelIndex).toSelf().inSingletonScope();
        return { service: ClassDiagramModelIndex };
    }

    protected override bindNavigationTargetResolver(): BindingTarget<NavigationTargetResolver> | undefined {
        return ClassDiagramNavigationTargetResolver;
    }

    protected override bindContextMenuItemProvider(): BindingTarget<ContextMenuItemProvider> | undefined {
        return ClassDiagramContextMenuItemProvider;
    }

    protected override bindToolPaletteItemProvider(): BindingTarget<ToolPaletteItemProvider> {
        return ClassDiagramToolPaletteItemProvider;
    }

    protected override bindCommandPaletteActionProvider(): BindingTarget<CommandPaletteActionProvider> | undefined {
        return ClassDiagramCommandPaletteActionProvider;
    }

    protected override bindLabelEditValidator(): BindingTarget<LabelEditValidator> | undefined {
        return ClassLabelEditValidator;
    }

    protected override bindPopupModelFactory(): BindingTarget<PopupModelFactory> | undefined {
        return undefined;
    }

    protected override bindModelValidator(): BindingTarget<ModelValidator> | undefined {
        return ClassDiagramModelValidator;
    }

    protected override configureNavigationTargetProviders(binding: MultiBinding<NavigationTargetProvider>): void {
        super.configureNavigationTargetProviders(binding);
        binding.add(ClassDiagramNextNodeNavigationTargetProvider);
        binding.add(ClassDiagramPreviousNodeNavigationTargetProvider);
        binding.add(ClassDiagramNodeDocumentationNavigationTargetProvider);
    }

    protected override configureContextActionProviders(binding: MultiBinding<ContextActionsProvider>): void {
        super.configureContextActionProviders(binding);
    }

    protected override configureContextEditValidators(binding: MultiBinding<ContextEditValidator>): void {
        super.configureContextEditValidators(binding);
    }

    protected override configureActionHandlers(binding: InstanceMultiBinding<ActionHandlerConstructor>): void {
        super.configureActionHandlers(binding);
        // binding.add(RequestClassPropertyPaletteActionHandler);
        binding.add(ClassDiagramUpdateElementPropertyActionHandler);
        // binding.add(RequestClassOutlineActionHandler);
    }
}
