// AUTO-GENERATED – DO NOT EDIT
/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
  RequestPropertyPaletteAction,
  SetPropertyPaletteAction,
} from '@borkdominik-biguml/uml-protocol';
import { ActionHandler, MaybePromise } from '@eclipse-glsp/server';
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
  isSlot,
} from '@borkdominik-biguml/model-server/grammar';
import { ClassDiagramModelState } from '../../../glsp-server/class-diagram/model/class-diagram-model-state.js';
import { AbstractClassPropertyPaletteHandler } from './elements/AbstractClassPropertyPaletteHandler.js';
import { ClassPropertyPaletteHandler } from './elements/ClassPropertyPaletteHandler.js';
import { DataTypePropertyPaletteHandler } from './elements/DataTypePropertyPaletteHandler.js';
import { EnumerationPropertyPaletteHandler } from './elements/EnumerationPropertyPaletteHandler.js';
import { EnumerationLiteralPropertyPaletteHandler } from './elements/EnumerationLiteralPropertyPaletteHandler.js';
import { InstanceSpecificationPropertyPaletteHandler } from './elements/InstanceSpecificationPropertyPaletteHandler.js';
import { InterfacePropertyPaletteHandler } from './elements/InterfacePropertyPaletteHandler.js';
import { LiteralSpecificationPropertyPaletteHandler } from './elements/LiteralSpecificationPropertyPaletteHandler.js';
import { OperationPropertyPaletteHandler } from './elements/OperationPropertyPaletteHandler.js';
import { PackagePropertyPaletteHandler } from './elements/PackagePropertyPaletteHandler.js';
import { ParameterPropertyPaletteHandler } from './elements/ParameterPropertyPaletteHandler.js';
import { PrimitiveTypePropertyPaletteHandler } from './elements/PrimitiveTypePropertyPaletteHandler.js';
import { PropertyPropertyPaletteHandler } from './elements/PropertyPropertyPaletteHandler.js';
import { SlotPropertyPaletteHandler } from './elements/SlotPropertyPaletteHandler.js';

@injectable()
export class RequestClassPropertyPaletteActionHandler implements ActionHandler {
  actionKinds = [RequestPropertyPaletteAction.KIND];

  @inject(ClassDiagramModelState)
  protected modelState!: ClassDiagramModelState;

  execute(action: RequestPropertyPaletteAction): MaybePromise<any[]> {
    try {
      if (!action.elementId) {
        return [SetPropertyPaletteAction.create()];
      }
      if (
        typeof action.elementId !== 'string' ||
        action.elementId.endsWith('_refValue')
      ) {
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
          secondaryText: item.$type,
        }));
      const definingFeatureChoices = (
        this.modelState.index.getAllDefiningFeatures?.() ?? []
      )
        .filter((item: any) => !!item && !!item.__id && !!item.name)
        .map((item: any) => ({
          label: item.name,
          value: item.__id + '_refValue',
          secondaryText: item.$type,
        }));

      if (false) {
      } else if (isEnumeration(semanticElement)) {
        return EnumerationPropertyPaletteHandler.getPropertyPalette(
          semanticElement,
        );
      } else if (isEnumerationLiteral(semanticElement)) {
        return EnumerationLiteralPropertyPaletteHandler.getPropertyPalette(
          semanticElement,
        );
      } else if (isClass(semanticElement)) {
        return ClassPropertyPaletteHandler.getPropertyPalette(semanticElement);
      } else if (isAbstractClass(semanticElement)) {
        return AbstractClassPropertyPaletteHandler.getPropertyPalette(
          semanticElement,
        );
      } else if (isInterface(semanticElement)) {
        return InterfacePropertyPaletteHandler.getPropertyPalette(
          semanticElement,
        );
      } else if (isProperty(semanticElement)) {
        return PropertyPropertyPaletteHandler.getPropertyPalette(
          semanticElement,
          dataTypeChoices,
        );
      } else if (isOperation(semanticElement)) {
        return OperationPropertyPaletteHandler.getPropertyPalette(
          semanticElement,
        );
      } else if (isParameter(semanticElement)) {
        return ParameterPropertyPaletteHandler.getPropertyPalette(
          semanticElement,
          dataTypeChoices,
        );
      } else if (isDataType(semanticElement)) {
        return DataTypePropertyPaletteHandler.getPropertyPalette(
          semanticElement,
        );
      } else if (isPrimitiveType(semanticElement)) {
        return PrimitiveTypePropertyPaletteHandler.getPropertyPalette(
          semanticElement,
        );
      } else if (isInstanceSpecification(semanticElement)) {
        return InstanceSpecificationPropertyPaletteHandler.getPropertyPalette(
          semanticElement,
        );
      } else if (isSlot(semanticElement)) {
        return SlotPropertyPaletteHandler.getPropertyPalette(
          semanticElement,
          definingFeatureChoices,
        );
      } else if (isLiteralSpecification(semanticElement)) {
        return LiteralSpecificationPropertyPaletteHandler.getPropertyPalette(
          semanticElement,
        );
      } else if (isPackage(semanticElement)) {
        return PackagePropertyPaletteHandler.getPropertyPalette(
          semanticElement,
        );
      }
      return [SetPropertyPaletteAction.create()];
    } catch (_e: unknown) {
      return [SetPropertyPaletteAction.create()];
    }
  }
}
