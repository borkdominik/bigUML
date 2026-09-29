/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { DIAGRAM_REGISTRY } from '@borkdominik-biguml/uml-glsp-server/gen/vscode';
import {
    type BindingTarget,
    type DiagramConfiguration,
    type GModelFactory,
    type LabelEditValidator,
    type PopupModelFactory,
    type ToolPaletteItemProvider
} from '@eclipse-glsp/server';
import { injectable, type interfaces } from 'inversify';
import { BehaviorLabelExtension } from '../extensions/behavior-label.extension.js';
import { CompositeStateExtension } from '../extensions/composite-state.extension.js';
import { OrientationTurnExtension } from '../extensions/orientation-turn.extension.js';
import { PackageMergeEdgeExtension } from '../extensions/package-merge-edge.extension.js';
import { TypedElementExtension } from '../extensions/typed-element.extension.js';
import { DefaultDiagramLanguageMetadata } from '../features/model/default-diagram-language-metadata.js';
import { DiagramLanguageMetadata } from '../features/model/diagram-language-metadata.js';
import { UmlLabelEditValidator } from '../features/labeledit/uml-label-edit-validator.js';
import { DiagramServices } from '../features/model/diagram-services.js';
import { BigDiagramModule } from '../features/module/module.js';
import { MutationExtension } from '../features/mutation/extension/mutation-extension.js';
import { UmlDiagramConfiguration } from './diagram-configuration.js';
import { UmlDiagramGModelFactory } from './model/diagram-gmodel-factory.js';
import { UmlDiagramToolPaletteItemProvider } from './provider/diagram-tool-palette-item-provider.js';

@injectable()
export class UmlDiagramModule extends BigDiagramModule {
    readonly diagramType = 'uml-diagram';

    protected override configure(
        bind: interfaces.Bind,
        unbind: interfaces.Unbind,
        isBound: interfaces.IsBound,
        rebind: interfaces.Rebind
    ): void {
        super.configure(bind, unbind, isBound, rebind);
        this.bindDiagramServices(bind);
        this.bindMutationExtensions(bind);
    }

    /** One set of services per diagram of the language, and the facade that picks the loaded one. */
    protected bindDiagramServices(bind: interfaces.Bind): void {
        for (const diagram of DIAGRAM_REGISTRY) {
            bind(diagram.toolPaletteItemProvider).toSelf().inSingletonScope();
            bind(DiagramServices)
                .toDynamicValue(context => ({
                    diagramType: diagram.diagramType,
                    // What the registry says about the diagram's types is all its metadata is.
                    languageMetadata: {
                        nodeTypeIds: diagram.nodeTypeIds,
                        edgeTypeIds: diagram.edgeTypeIds,
                        convertToAst: diagram.convertToAst,
                        convertToElementType: diagram.convertToElementType
                    },
                    toolPaletteItemProvider: context.container.get(diagram.toolPaletteItemProvider)
                }))
                .inSingletonScope();
        }
        bind(DefaultDiagramLanguageMetadata).toSelf().inSingletonScope();
        bind(DiagramLanguageMetadata).toService(DefaultDiagramLanguageMetadata);
    }

    /** What one element does differently from the generic handling - see `MutationExtension`. */
    protected bindMutationExtensions(bind: interfaces.Bind): void {
        for (const extension of [
            CompositeStateExtension,
            OrientationTurnExtension,
            BehaviorLabelExtension,
            PackageMergeEdgeExtension,
            TypedElementExtension
        ]) {
            bind(MutationExtension).to(extension).inSingletonScope();
        }
    }

    protected bindDiagramConfiguration(): BindingTarget<DiagramConfiguration> {
        return UmlDiagramConfiguration;
    }

    protected bindGModelFactory(): BindingTarget<GModelFactory> {
        return UmlDiagramGModelFactory;
    }

    protected override bindToolPaletteItemProvider(): BindingTarget<ToolPaletteItemProvider> {
        return UmlDiagramToolPaletteItemProvider;
    }

    protected override bindLabelEditValidator(): BindingTarget<LabelEditValidator> | undefined {
        return UmlLabelEditValidator;
    }

    protected override bindPopupModelFactory(): BindingTarget<PopupModelFactory> | undefined {
        return undefined;
    }
}
