/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
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
import { ClassDiagramChangeBoundsOperationHandler } from '../common/handler/change-bounds-operation-handler.js';
import { ClassDiagramDeleteOperationHandler } from '../common/handler/delete-operation-handler.js';
import { ClassCreateEdgeOperationHandler } from '../common/handler/generic-create-edge-operation-handler.js';
import { ClassCreateNodeOperationHandler } from '../common/handler/generic-create-node-operation-handler.js';
import { ClassDiagramUpdateElementPropertyActionHandler } from '../common/handler/update-element-property-action-handler.js';
import { ClassDiagramUpdateClientOperationHandler } from '../common/handler/update-glsp-client-handler.js';
import { ClassDiagramUpdateOperationHandler } from '../common/handler/update-operation-handler.js';
import { ClassLabelEditOperationHandler } from '../common/labeledit/class-label-edit-operation-handler.js';
import { ClassLabelEditValidator } from '../common/labeledit/class-label-edit-validator.js';
import { ClassDiagramNavigationTargetResolver } from '../common/model/class-diagram-navigation-target-resolver.js';
import {
    ClassDiagramNextNodeNavigationTargetProvider,
    ClassDiagramPreviousNodeNavigationTargetProvider
} from '../common/provider/base-next-prev-target-provider.js';
import { ClassDiagramCommandPaletteActionProvider } from '../common/provider/class-command-palette-action-provider.js';
import { ClassDiagramContextMenuItemProvider } from '../common/provider/class-context-menu-item-provider.js';
import { ClassDiagramToolPaletteItemProvider } from '../common/provider/class-diagram-tool-palette-item-provider.js';
import { ClassDiagramNodeDocumentationNavigationTargetProvider } from '../common/provider/class-node-doc-nav-target-provider.js';
import { ClassDiagramModelValidator } from '../common/validator/class-diagram-model-validator.js';
import { ClassDiagramGModelFactory } from '../model/class-diagram-gmodel-factory.js';
import { ClassDiagramModelIndex } from '../model/class-diagram-model-index.js';
import { ClassDiagramModelState } from '../model/class-diagram-model-state.js';
import { ClassDiagramModelStorage } from '../model/class-diagram-model-storage.js';
import { ClassDiagramConfiguration } from './class-diagram-configuration.js';

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
        binding.add(ClassDiagramUpdateClientOperationHandler);
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
