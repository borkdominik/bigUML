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
    ActionHandlerConstructor,
    BindingTarget,
    CommandPaletteActionProvider,
    ContextActionsProvider,
    ContextEditValidator,
    ContextMenuItemProvider,
    DiagramConfiguration,
    DiagramModule,
    GModelFactory,
    GModelIndex,
    InstanceMultiBinding,
    LabelEditValidator,
    ModelState,
    ModelValidator,
    MultiBinding,
    NavigationTargetProvider,
    NavigationTargetResolver,
    OperationHandlerConstructor,
    SourceModelStorage,
    ToolPaletteItemProvider
} from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { RequestPackageOutlineActionHandler } from '../../yo-generated/outline/request-package-outline-action-handler.js';
import { RequestPackagePropertyPaletteActionHandler } from '../../yo-generated/property-palette/request-package-property-palette-action-handler.js';
import { PackageDiagramChangeBoundsOperationHandler } from '../common/handler/change-bounds-operation-handler.js';
import { PackageDiagramDeleteOperationHandler } from '../common/handler/delete-operation-handler.js';
import { PackageCreateEdgeOperationHandler } from '../common/handler/generic-create-edge-operation-handler.js';
import { PackageCreateNodeOperationHandler } from '../common/handler/generic-create-node-operation-handler.js';
import { PackageDiagramUpdateElementPropertyActionHandler } from '../common/handler/update-element-property-action-handler.js';
import { PackageDiagramUpdateOperationHandler } from '../common/handler/update-operation-handler.js';
import { PackageLabelEditOperationHandler } from '../common/labeledit/package-label-edit-operation-handler.js';
import { PackageLabelEditValidator } from '../common/labeledit/package-label-edit-validator.js';
import { PackageDiagramNavigationTargetResolver } from '../common/model/package-diagram-navigation-target-resolver.js';
import {
    PackageDiagramNextNodeNavigationTargetProvider,
    PackageDiagramPreviousNodeNavigationTargetProvider
} from '../common/provider/base-next-prev-target-provider.js';
import { PackageDiagramCommandPaletteActionProvider } from '../common/provider/package-command-palette-action-provider.js';
import { PackageDiagramContextMenuItemProvider } from '../common/provider/package-context-menu-item-provider.js';
import { PackageDiagramToolPaletteItemProvider } from '../common/provider/package-diagram-tool-palette-item-provider.js';
import { PackageDiagramNodeDocumentationNavigationTargetProvider } from '../common/provider/package-node-doc-nav-target-provider.js';
import { PackageDiagramModelValidator } from '../common/validator/package-diagram-model-validator.js';
import { PackageDiagramGModelFactory } from '../model/package-diagram-gmodel-factory.js';
import { PackageDiagramModelIndex } from '../model/package-diagram-model-index.js';
import { PackageDiagramModelState } from '../model/package-diagram-model-state.js';
import { PackageDiagramModelStorage } from '../model/package-diagram-model-storage.js';
import { PackageDiagramConfiguration } from './package-diagram-configuration.js';

@injectable()
export class PackageDiagramModule extends DiagramModule {
    readonly diagramType = 'uml';

    protected bindDiagramConfiguration(): BindingTarget<DiagramConfiguration> {
        return PackageDiagramConfiguration;
    }

    protected bindSourceModelStorage(): BindingTarget<SourceModelStorage> {
        return PackageDiagramModelStorage;
    }

    protected bindModelState(): BindingTarget<ModelState> {
        this.context.bind(PackageDiagramModelState).toSelf().inSingletonScope();
        return { service: PackageDiagramModelState };
    }

    protected bindGModelFactory(): BindingTarget<GModelFactory> {
        return PackageDiagramGModelFactory;
    }

    protected override configureOperationHandlers(binding: InstanceMultiBinding<OperationHandlerConstructor>): void {
        super.configureOperationHandlers(binding);
        binding.add(PackageCreateNodeOperationHandler);
        binding.add(PackageCreateEdgeOperationHandler);

        binding.add(PackageDiagramChangeBoundsOperationHandler);
        binding.add(PackageLabelEditOperationHandler);
        binding.add(PackageDiagramUpdateOperationHandler);
        binding.add(PackageDiagramDeleteOperationHandler);
    }

    protected override bindGModelIndex(): BindingTarget<GModelIndex> {
        this.context.bind(PackageDiagramModelIndex).toSelf().inSingletonScope();
        return { service: PackageDiagramModelIndex };
    }

    protected override bindNavigationTargetResolver(): BindingTarget<NavigationTargetResolver> | undefined {
        return PackageDiagramNavigationTargetResolver;
    }

    protected override bindContextMenuItemProvider(): BindingTarget<ContextMenuItemProvider> | undefined {
        return PackageDiagramContextMenuItemProvider;
    }

    protected override bindToolPaletteItemProvider(): BindingTarget<ToolPaletteItemProvider> {
        return PackageDiagramToolPaletteItemProvider;
    }

    protected override bindCommandPaletteActionProvider(): BindingTarget<CommandPaletteActionProvider> | undefined {
        return PackageDiagramCommandPaletteActionProvider;
    }

    protected override bindLabelEditValidator(): BindingTarget<LabelEditValidator> | undefined {
        return PackageLabelEditValidator;
    }

    protected override bindModelValidator(): BindingTarget<ModelValidator> | undefined {
        return PackageDiagramModelValidator;
    }

    protected override configureNavigationTargetProviders(binding: MultiBinding<NavigationTargetProvider>): void {
        super.configureNavigationTargetProviders(binding);
        binding.add(PackageDiagramNextNodeNavigationTargetProvider);
        binding.add(PackageDiagramPreviousNodeNavigationTargetProvider);
        binding.add(PackageDiagramNodeDocumentationNavigationTargetProvider);
    }

    protected override configureContextActionProviders(binding: MultiBinding<ContextActionsProvider>): void {
        super.configureContextActionProviders(binding);
    }

    protected override configureContextEditValidators(binding: MultiBinding<ContextEditValidator>): void {
        super.configureContextEditValidators(binding);
    }

    protected override configureActionHandlers(binding: InstanceMultiBinding<ActionHandlerConstructor>): void {
        super.configureActionHandlers(binding);
        binding.add(RequestPackagePropertyPaletteActionHandler);
        binding.add(PackageDiagramUpdateElementPropertyActionHandler);
        binding.add(RequestPackageOutlineActionHandler);
    }
}
