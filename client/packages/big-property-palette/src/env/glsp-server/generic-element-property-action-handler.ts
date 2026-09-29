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
import { ChangeRoutingPointsOperation, ModelState, type ActionHandler, type MaybePromise, type Operation } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { applyBendPointEdit, isBendPointProperty, parseBendPointEdit } from './bend-points.js';

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

        if (isBendPointProperty(action.propertyId)) {
            return this.bendPointOperations(action);
        }

        return [UpdateOperation.create(action.elementId, action.propertyId, action.value)];
    }

    /**
     * A bend point edited in the palette, sent on as the operation a drag on the canvas sends. Never
     * passed through as a property update: a bend point is layout, not a property of the edge, and an
     * edit that cannot be applied is dropped rather than written into the model under its id.
     */
    protected bendPointOperations(action: UpdateElementPropertyAction): Operation[] {
        const edit = parseBendPointEdit(action.propertyId, action.value);
        const points = this.modelState.getRoutingPoints(action.elementId) ?? [];
        const newRoutingPoints = edit ? applyBendPointEdit(points, edit) : undefined;
        if (!newRoutingPoints) {
            return [];
        }
        return [ChangeRoutingPointsOperation.create([{ elementId: action.elementId, newRoutingPoints }])];
    }
}
