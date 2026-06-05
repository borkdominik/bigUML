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
    isAbstractClass,
    isAbstraction,
    isAggregation,
    isAssociation,
    isClass,
    isComposition,
    isDataType,
    isDependency,
    isElementImport,
    isEnumeration,
    isEnumerationLiteral,
    isGeneralization,
    isInstanceSpecification,
    isInterface,
    isInterfaceRealization,
    isLiteralSpecification,
    isOperation,
    isPackage,
    isPackageImport,
    isPackageMerge,
    isParameter,
    isPrimitiveType,
    isProperty,
    isRealization,
    isSlot,
    isSubstitution,
    isUsage
} from '@borkdominik-biguml/uml-model-server/grammar';
import { DiagramModelState } from '@borkdominik-biguml/uml-glsp-server/vscode';
import { AbstractClassPropertyPaletteHandler } from './elements/abstract-class.property-palette-handler.js';
import { AbstractionPropertyPaletteHandler } from './elements/abstraction.property-palette-handler.js';
import { AggregationPropertyPaletteHandler } from './elements/aggregation.property-palette-handler.js';
import { AssociationPropertyPaletteHandler } from './elements/association.property-palette-handler.js';
import { ClassPropertyPaletteHandler } from './elements/class.property-palette-handler.js';
import { CompositionPropertyPaletteHandler } from './elements/composition.property-palette-handler.js';
import { DataTypePropertyPaletteHandler } from './elements/data-type.property-palette-handler.js';
import { DependencyPropertyPaletteHandler } from './elements/dependency.property-palette-handler.js';
import { ElementImportPropertyPaletteHandler } from './elements/element-import.property-palette-handler.js';
import { EnumerationPropertyPaletteHandler } from './elements/enumeration.property-palette-handler.js';
import { EnumerationLiteralPropertyPaletteHandler } from './elements/enumeration-literal.property-palette-handler.js';
import { GeneralizationPropertyPaletteHandler } from './elements/generalization.property-palette-handler.js';
import { InstanceSpecificationPropertyPaletteHandler } from './elements/instance-specification.property-palette-handler.js';
import { InterfacePropertyPaletteHandler } from './elements/interface.property-palette-handler.js';
import { InterfaceRealizationPropertyPaletteHandler } from './elements/interface-realization.property-palette-handler.js';
import { LiteralSpecificationPropertyPaletteHandler } from './elements/literal-specification.property-palette-handler.js';
import { OperationPropertyPaletteHandler } from './elements/operation.property-palette-handler.js';
import { PackagePropertyPaletteHandler } from './elements/package.property-palette-handler.js';
import { PackageImportPropertyPaletteHandler } from './elements/package-import.property-palette-handler.js';
import { PackageMergePropertyPaletteHandler } from './elements/package-merge.property-palette-handler.js';
import { ParameterPropertyPaletteHandler } from './elements/parameter.property-palette-handler.js';
import { PrimitiveTypePropertyPaletteHandler } from './elements/primitive-type.property-palette-handler.js';
import { PropertyPropertyPaletteHandler } from './elements/property.property-palette-handler.js';
import { RealizationPropertyPaletteHandler } from './elements/realization.property-palette-handler.js';
import { SlotPropertyPaletteHandler } from './elements/slot.property-palette-handler.js';
import { SubstitutionPropertyPaletteHandler } from './elements/substitution.property-palette-handler.js';
import { UsagePropertyPaletteHandler } from './elements/usage.property-palette-handler.js';
@injectable()
export class RequestClassPropertyPaletteActionHandler implements ActionHandler {
    actionKinds = [RequestPropertyPaletteAction.KIND];

    @inject(DiagramModelState)
    protected modelState!: DiagramModelState;

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

            const dataTypeChoices = (this.modelState.index.getAllDataTypes?.() ?? [])
                .filter((item: any) => !!item && !!item.__id && !!item.name)
                .map((item: any) => ({
                    label: item.name,
                    value: item.__id + '_refValue',
                    secondaryText: item.$type
                }));
            const definingFeatureChoices = (this.modelState.index.getAllDefiningFeatures?.() ?? [])
                .filter((item: any) => !!item && !!item.__id && !!item.name)
                .map((item: any) => ({
                    label: item.name,
                    value: item.__id + '_refValue',
                    secondaryText: item.$type
                }));
            if (isEnumeration(semanticElement)) {
                return EnumerationPropertyPaletteHandler.getPropertyPalette(semanticElement);
            } else if (isEnumerationLiteral(semanticElement)) {
                return EnumerationLiteralPropertyPaletteHandler.getPropertyPalette(semanticElement);
            } else if (isClass(semanticElement)) {
                return ClassPropertyPaletteHandler.getPropertyPalette(semanticElement);
            } else if (isAbstractClass(semanticElement)) {
                return AbstractClassPropertyPaletteHandler.getPropertyPalette(semanticElement);
            } else if (isInterface(semanticElement)) {
                return InterfacePropertyPaletteHandler.getPropertyPalette(semanticElement);
            } else if (isProperty(semanticElement)) {
                return PropertyPropertyPaletteHandler.getPropertyPalette(semanticElement, dataTypeChoices);
            } else if (isOperation(semanticElement)) {
                return OperationPropertyPaletteHandler.getPropertyPalette(semanticElement);
            } else if (isParameter(semanticElement)) {
                return ParameterPropertyPaletteHandler.getPropertyPalette(semanticElement, dataTypeChoices);
            } else if (isDataType(semanticElement)) {
                return DataTypePropertyPaletteHandler.getPropertyPalette(semanticElement);
            } else if (isPrimitiveType(semanticElement)) {
                return PrimitiveTypePropertyPaletteHandler.getPropertyPalette(semanticElement);
            } else if (isInstanceSpecification(semanticElement)) {
                return InstanceSpecificationPropertyPaletteHandler.getPropertyPalette(semanticElement);
            } else if (isSlot(semanticElement)) {
                return SlotPropertyPaletteHandler.getPropertyPalette(semanticElement, definingFeatureChoices);
            } else if (isLiteralSpecification(semanticElement)) {
                return LiteralSpecificationPropertyPaletteHandler.getPropertyPalette(semanticElement);
            } else if (isAbstraction(semanticElement)) {
                return AbstractionPropertyPaletteHandler.getPropertyPalette(semanticElement);
            } else if (isDependency(semanticElement)) {
                return DependencyPropertyPaletteHandler.getPropertyPalette(semanticElement);
            } else if (isAssociation(semanticElement)) {
                return AssociationPropertyPaletteHandler.getPropertyPalette(semanticElement);
            } else if (isAggregation(semanticElement)) {
                return AggregationPropertyPaletteHandler.getPropertyPalette(semanticElement);
            } else if (isComposition(semanticElement)) {
                return CompositionPropertyPaletteHandler.getPropertyPalette(semanticElement);
            } else if (isInterfaceRealization(semanticElement)) {
                return InterfaceRealizationPropertyPaletteHandler.getPropertyPalette(semanticElement);
            } else if (isGeneralization(semanticElement)) {
                return GeneralizationPropertyPaletteHandler.getPropertyPalette(semanticElement);
            } else if (isPackageImport(semanticElement)) {
                return PackageImportPropertyPaletteHandler.getPropertyPalette(semanticElement);
            } else if (isPackageMerge(semanticElement)) {
                return PackageMergePropertyPaletteHandler.getPropertyPalette(semanticElement);
            } else if (isElementImport(semanticElement)) {
                return ElementImportPropertyPaletteHandler.getPropertyPalette(semanticElement);
            } else if (isRealization(semanticElement)) {
                return RealizationPropertyPaletteHandler.getPropertyPalette(semanticElement);
            } else if (isSubstitution(semanticElement)) {
                return SubstitutionPropertyPaletteHandler.getPropertyPalette(semanticElement);
            } else if (isUsage(semanticElement)) {
                return UsagePropertyPaletteHandler.getPropertyPalette(semanticElement);
            } else if (isPackage(semanticElement)) {
                return PackagePropertyPaletteHandler.getPropertyPalette(semanticElement);
            }

            return [SetPropertyPaletteAction.create()];
        } catch (_e: unknown) {
            return [SetPropertyPaletteAction.create()];
        }
    }
}
