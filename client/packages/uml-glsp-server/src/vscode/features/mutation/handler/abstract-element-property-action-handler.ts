/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { UpdateElementPropertyAction } from '@borkdominik-biguml/big-property-palette';
import { type ActionHandler, type MaybePromise, type Operation } from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { UpdateOperation } from '../../../../common/operations/update-operation.js';
import { type BaseDiagramModelState } from '../../model/base-diagram-model-state.js';

@injectable()
export abstract class AbstractUpdateElementPropertyActionHandler implements ActionHandler {
    actionKinds = [UpdateElementPropertyAction.KIND];

    abstract readonly modelState: BaseDiagramModelState;

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
