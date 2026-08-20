/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { ChangeRoutingPointsOperation, type Command, OperationHandler } from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { type DiagramModelState } from '../../model/diagram-model-state.js';

@injectable()
export class GenericChangeRoutingPointsOperationHandler extends OperationHandler {
    readonly operationType = ChangeRoutingPointsOperation.KIND;

    declare readonly modelState: DiagramModelState;

    override createCommand(operation: ChangeRoutingPointsOperation): Command {
        return {
            execute: async () => {
                operation.newRoutingPoints.forEach(({ elementId, newRoutingPoints }) => {
                    this.modelState.setRoutingPoints(elementId, newRoutingPoints ?? []);
                });
            },
            undo: async () => {
                // Routing points are session-local layout state, not part of the semantic model's undo stack.
            },
            redo: async () => {}
        };
    }
}
