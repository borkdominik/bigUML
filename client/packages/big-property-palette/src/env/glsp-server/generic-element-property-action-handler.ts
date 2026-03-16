/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { UpdateElementPropertyAction } from '@borkdominik-biguml/big-property-palette';
import { UpdateOperation } from '@borkdominik-biguml/uml-glsp-server';
import type { DiagramModelState } from '@borkdominik-biguml/uml-glsp-server/vscode';
import { ModelState, type ActionHandler, type MaybePromise, type Operation } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';

@injectable()
export class GenericUpdateElementPropertyActionHandler implements ActionHandler {
    actionKinds = [UpdateElementPropertyAction.KIND];

    @inject(ModelState)
    readonly modelState: DiagramModelState;

    execute(action: UpdateElementPropertyAction): MaybePromise<Operation[]> {
        if (!action.elementId) {
            return [];
        }

        const semanticElement = this.modelState.index.findIdElement(action.elementId);
        if (!semanticElement) {
            return [];
        }

        return [UpdateOperation.create(action.elementId, action.propertyId, action.value)];
    }
}
