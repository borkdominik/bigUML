// AUTO-GENERATED – DO NOT EDIT
/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { RequestPropertyPaletteAction, SetPropertyPaletteAction } from '@borkdominik-biguml/big-property-palette';
import { type ActionHandler, type MaybePromise } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import {
    isAbstraction,
    isClass,
    isDependency,
    isElementImport,
    isOperation,
    isPackage,
    isPackageImport,
    isPackageMerge,
    isParameter,
    isProperty,
    isUsage
} from '@borkdominik-biguml/uml-model-server/grammar';
import { DiagramModelState, DiagramLanguageMetadata } from '@borkdominik-biguml/uml-glsp-server/vscode';
import type { DiagramLanguageMetadata as DiagramLanguageMetadataType } from '@borkdominik-biguml/uml-glsp-server/vscode';
import { AbstractionPropertyPaletteHandler } from './elements/abstraction.property-palette-handler.js';
import { ClassPropertyPaletteHandler } from './elements/class.property-palette-handler.js';
import { DependencyPropertyPaletteHandler } from './elements/dependency.property-palette-handler.js';
import { ElementImportPropertyPaletteHandler } from './elements/element-import.property-palette-handler.js';
import { OperationPropertyPaletteHandler } from './elements/operation.property-palette-handler.js';
import { PackagePropertyPaletteHandler } from './elements/package.property-palette-handler.js';
import { PackageImportPropertyPaletteHandler } from './elements/package-import.property-palette-handler.js';
import { PackageMergePropertyPaletteHandler } from './elements/package-merge.property-palette-handler.js';
import { ParameterPropertyPaletteHandler } from './elements/parameter.property-palette-handler.js';
import { PropertyPropertyPaletteHandler } from './elements/property.property-palette-handler.js';
import { UsagePropertyPaletteHandler } from './elements/usage.property-palette-handler.js';
@injectable()
export class RequestPackagePropertyPaletteActionHandler implements ActionHandler {
    actionKinds = [RequestPropertyPaletteAction.KIND];

    @inject(DiagramModelState)
    protected modelState!: DiagramModelState;

    @inject(DiagramLanguageMetadata)
    protected languageMetadata!: DiagramLanguageMetadataType;

    execute(action: RequestPropertyPaletteAction): MaybePromise<any[]> {
        try {
            if (!action.elementId) {
                return [SetPropertyPaletteAction.create()];
            }
            if (typeof action.elementId !== 'string' || action.elementId.endsWith('_refValue')) {
                return [SetPropertyPaletteAction.create()];
            }

            let semanticElement: any | undefined;
            try {
                semanticElement = this.modelState.index.findIdElement(action.elementId);
            } catch {
                return [SetPropertyPaletteAction.create()];
            }
            if (!semanticElement) {
                return [SetPropertyPaletteAction.create()];
            }

            const context = { semanticElement, languageMetadata: this.languageMetadata };

            const dataTypeChoices = (this.modelState.index.getAllDataTypes?.() ?? [])
                .filter((item: any) => !!item && !!item.__id && !!item.name)
                .map((item: any) => ({
                    label: item.name,
                    value: item.__id + '_refValue',
                    secondaryText: item.$type
                }));
            if (isProperty(semanticElement)) {
                return PropertyPropertyPaletteHandler.getPropertyPalette(context, dataTypeChoices);
            } else if (isOperation(semanticElement)) {
                return OperationPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isParameter(semanticElement)) {
                return ParameterPropertyPaletteHandler.getPropertyPalette(context, dataTypeChoices);
            } else if (isClass(semanticElement)) {
                return ClassPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isUsage(semanticElement)) {
                return UsagePropertyPaletteHandler.getPropertyPalette(context);
            } else if (isPackageMerge(semanticElement)) {
                return PackageMergePropertyPaletteHandler.getPropertyPalette(context);
            } else if (isPackageImport(semanticElement)) {
                return PackageImportPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isPackage(semanticElement)) {
                return PackagePropertyPaletteHandler.getPropertyPalette(context);
            } else if (isElementImport(semanticElement)) {
                return ElementImportPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isDependency(semanticElement)) {
                return DependencyPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isAbstraction(semanticElement)) {
                return AbstractionPropertyPaletteHandler.getPropertyPalette(context);
            }

            return [SetPropertyPaletteAction.create()];
        } catch (_e: unknown) {
            return [SetPropertyPaletteAction.create()];
        }
    }
}
