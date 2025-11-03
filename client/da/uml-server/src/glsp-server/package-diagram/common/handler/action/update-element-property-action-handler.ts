/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { UpdateElementPropertyAction } from '@borkdominik-biguml/biguml-protocol';
import { ActionHandler, MaybePromise, Operation } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { PackageDiagramModelState } from '../../../model/package-diagram-model-state.js';
import { UpdateOperation } from '../old-update-operation-handler.js';

@injectable()
export class UpdateElementPropertyActionHandler implements ActionHandler {
    actionKinds = [UpdateElementPropertyAction.KIND];

    @inject(PackageDiagramModelState)
    protected modelState: PackageDiagramModelState;

    execute(action: UpdateElementPropertyAction): MaybePromise<Operation[]> {
        if (!action.elementId) {
            console.log('Could not find element id, no property updating executed.');
            return;
        }

        const semanticElement = this.modelState.index.findIdElement(action.elementId);
        if (!semanticElement) {
            return;
        }

        return [UpdateOperation.create(action.elementId, action.propertyId, action.value)];
    }
}
