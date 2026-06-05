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
    isActor,
    isAssociation,
    isExtend,
    isGeneralization,
    isInclude,
    isSubject,
    isUseCase
} from '@borkdominik-biguml/uml-model-server/grammar';
import { DiagramModelState, DiagramLanguageMetadata } from '@borkdominik-biguml/uml-glsp-server/vscode';
import type { DiagramLanguageMetadata as DiagramLanguageMetadataType } from '@borkdominik-biguml/uml-glsp-server/vscode';
import { ActorPropertyPaletteHandler } from './elements/actor.property-palette-handler.js';
import { AssociationPropertyPaletteHandler } from './elements/association.property-palette-handler.js';
import { ExtendPropertyPaletteHandler } from './elements/extend.property-palette-handler.js';
import { GeneralizationPropertyPaletteHandler } from './elements/generalization.property-palette-handler.js';
import { IncludePropertyPaletteHandler } from './elements/include.property-palette-handler.js';
import { SubjectPropertyPaletteHandler } from './elements/subject.property-palette-handler.js';
import { UseCasePropertyPaletteHandler } from './elements/use-case.property-palette-handler.js';
@injectable()
export class RequestUseCasePropertyPaletteActionHandler implements ActionHandler {
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

            if (isUseCase(semanticElement)) {
                return UseCasePropertyPaletteHandler.getPropertyPalette(context);
            } else if (isSubject(semanticElement)) {
                return SubjectPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isInclude(semanticElement)) {
                return IncludePropertyPaletteHandler.getPropertyPalette(context);
            } else if (isGeneralization(semanticElement)) {
                return GeneralizationPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isExtend(semanticElement)) {
                return ExtendPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isAssociation(semanticElement)) {
                return AssociationPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isActor(semanticElement)) {
                return ActorPropertyPaletteHandler.getPropertyPalette(context);
            }

            return [SetPropertyPaletteAction.create()];
        } catch (_e: unknown) {
            return [SetPropertyPaletteAction.create()];
        }
    }
}
