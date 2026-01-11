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
import { isClass, isPackage } from '@borkdominik-biguml/model-server/grammar';
import { PackageDiagramModelState } from '../../../glsp-server/package-diagram/model/package-diagram-model-state.js';
import { ClassPropertyPaletteHandler } from './elements/ClassPropertyPaletteHandler.js';
import { PackagePropertyPaletteHandler } from './elements/PackagePropertyPaletteHandler.js';

@injectable()
export class RequestPackagePropertyPaletteActionHandler implements ActionHandler {
  actionKinds = [RequestPropertyPaletteAction.KIND];

  @inject(PackageDiagramModelState)
  protected modelState!: PackageDiagramModelState;

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

      if (false) {
      } else if (isClass(semanticElement)) {
        return ClassPropertyPaletteHandler.getPropertyPalette(semanticElement);
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
