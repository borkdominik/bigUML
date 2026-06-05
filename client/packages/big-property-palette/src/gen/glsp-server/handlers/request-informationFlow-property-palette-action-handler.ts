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
import { isActor, isClass, isInformationFlow, isOperation, isParameter, isProperty } from '@borkdominik-biguml/uml-model-server/grammar';
import { DiagramModelState, DiagramLanguageMetadata } from '@borkdominik-biguml/uml-glsp-server/vscode';
import type { DiagramLanguageMetadata as DiagramLanguageMetadataType } from '@borkdominik-biguml/uml-glsp-server/vscode';
import { ActorPropertyPaletteHandler } from './elements/actor.property-palette-handler.js';
import { ClassPropertyPaletteHandler } from './elements/class.property-palette-handler.js';
import { InformationFlowPropertyPaletteHandler } from './elements/information-flow.property-palette-handler.js';
import { OperationPropertyPaletteHandler } from './elements/operation.property-palette-handler.js';
import { ParameterPropertyPaletteHandler } from './elements/parameter.property-palette-handler.js';
import { PropertyPropertyPaletteHandler } from './elements/property.property-palette-handler.js';
@injectable()
export class RequestInformationFlowPropertyPaletteActionHandler implements ActionHandler {
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
            } else if (isActor(semanticElement)) {
                return ActorPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isInformationFlow(semanticElement)) {
                return InformationFlowPropertyPaletteHandler.getPropertyPalette(context);
            }

            return [SetPropertyPaletteAction.create()];
        } catch (_e: unknown) {
            return [SetPropertyPaletteAction.create()];
        }
    }
}
