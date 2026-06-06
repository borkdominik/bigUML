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
    isChoice,
    isDeepHistory,
    isFinalState,
    isFork,
    isInitialState,
    isJoin,
    isRegion,
    isShallowHistory,
    isState,
    isStateMachine,
    isTransition
} from '@borkdominik-biguml/uml-model-server/grammar';
import { DiagramModelState, DiagramLanguageMetadata } from '@borkdominik-biguml/uml-glsp-server/vscode';
import type { DiagramLanguageMetadata as DiagramLanguageMetadataType } from '@borkdominik-biguml/uml-glsp-server/vscode';
import { ChoicePropertyPaletteHandler } from './elements/choice.property-palette-handler.js';
import { DeepHistoryPropertyPaletteHandler } from './elements/deep-history.property-palette-handler.js';
import { FinalStatePropertyPaletteHandler } from './elements/final-state.property-palette-handler.js';
import { ForkPropertyPaletteHandler } from './elements/fork.property-palette-handler.js';
import { InitialStatePropertyPaletteHandler } from './elements/initial-state.property-palette-handler.js';
import { JoinPropertyPaletteHandler } from './elements/join.property-palette-handler.js';
import { RegionPropertyPaletteHandler } from './elements/region.property-palette-handler.js';
import { ShallowHistoryPropertyPaletteHandler } from './elements/shallow-history.property-palette-handler.js';
import { StatePropertyPaletteHandler } from './elements/state.property-palette-handler.js';
import { StateMachinePropertyPaletteHandler } from './elements/state-machine.property-palette-handler.js';
import { TransitionPropertyPaletteHandler } from './elements/transition.property-palette-handler.js';
@injectable()
export class RequestStateMachinePropertyPaletteActionHandler implements ActionHandler {
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

            if (isTransition(semanticElement)) {
                return TransitionPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isStateMachine(semanticElement)) {
                return StateMachinePropertyPaletteHandler.getPropertyPalette(context);
            } else if (isRegion(semanticElement)) {
                return RegionPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isState(semanticElement)) {
                return StatePropertyPaletteHandler.getPropertyPalette(context);
            } else if (isShallowHistory(semanticElement)) {
                return ShallowHistoryPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isJoin(semanticElement)) {
                return JoinPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isInitialState(semanticElement)) {
                return InitialStatePropertyPaletteHandler.getPropertyPalette(context);
            } else if (isFork(semanticElement)) {
                return ForkPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isFinalState(semanticElement)) {
                return FinalStatePropertyPaletteHandler.getPropertyPalette(context);
            } else if (isDeepHistory(semanticElement)) {
                return DeepHistoryPropertyPaletteHandler.getPropertyPalette(context);
            } else if (isChoice(semanticElement)) {
                return ChoicePropertyPaletteHandler.getPropertyPalette(context);
            }

            return [SetPropertyPaletteAction.create()];
        } catch (_e: unknown) {
            return [SetPropertyPaletteAction.create()];
        }
    }
}
