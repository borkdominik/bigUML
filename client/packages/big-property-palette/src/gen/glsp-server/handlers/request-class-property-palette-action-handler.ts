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
    isClass,
    isDataType,
    isEnumeration,
    isEnumerationLiteral,
    isInstanceSpecification,
    isInterface,
    isLiteralSpecification,
    isOperation,
    isPackage,
    isParameter,
    isPrimitiveType,
    isProperty,
    isSlot
} from '@borkdominik-biguml/uml-model-server/grammar';
import { DiagramModelState } from '@borkdominik-biguml/uml-glsp-server/vscode';
import { AbstractClassPropertyPaletteHandler } from './elements/abstract-class.property-palette-handler.js';
import { ClassPropertyPaletteHandler } from './elements/class.property-palette-handler.js';
import { DataTypePropertyPaletteHandler } from './elements/data-type.property-palette-handler.js';
import { EnumerationPropertyPaletteHandler } from './elements/enumeration.property-palette-handler.js';
import { EnumerationLiteralPropertyPaletteHandler } from './elements/enumeration-literal.property-palette-handler.js';
import { InstanceSpecificationPropertyPaletteHandler } from './elements/instance-specification.property-palette-handler.js';
import { InterfacePropertyPaletteHandler } from './elements/interface.property-palette-handler.js';
import { LiteralSpecificationPropertyPaletteHandler } from './elements/literal-specification.property-palette-handler.js';
import { OperationPropertyPaletteHandler } from './elements/operation.property-palette-handler.js';
import { PackagePropertyPaletteHandler } from './elements/package.property-palette-handler.js';
import { ParameterPropertyPaletteHandler } from './elements/parameter.property-palette-handler.js';
import { PrimitiveTypePropertyPaletteHandler } from './elements/primitive-type.property-palette-handler.js';
import { PropertyPropertyPaletteHandler } from './elements/property.property-palette-handler.js';
import { SlotPropertyPaletteHandler } from './elements/slot.property-palette-handler.js';
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
                return OperationPropertyPaletteHandler.getPropertyPalette(semanticElement, dataTypeChoices);
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
            } else if (isPackage(semanticElement)) {
                return PackagePropertyPaletteHandler.getPropertyPalette(semanticElement);
            }

            return [SetPropertyPaletteAction.create()];
        } catch (_e: unknown) {
            return [SetPropertyPaletteAction.create()];
        }
    }
}
