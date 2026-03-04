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
import {} from '@borkdominik-biguml/uml-model-server/grammar';
import { DiagramModelState } from '@borkdominik-biguml/uml-glsp-server/vscode';

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

            return [SetPropertyPaletteAction.create()];
        } catch (_e: unknown) {
            return [SetPropertyPaletteAction.create()];
        }
    }
}
