/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { ChangeRoutingPointsOperation, type Command, OperationHandler } from '@eclipse-glsp/server';
import type * as jsonpatch from 'fast-json-patch';
import { inject, injectable } from 'inversify';
import { ModelPatchCommand } from '../../command/model-patch-command.js';
import { type DiagramModelState } from '../../model/diagram-model-state.js';
import { ModelPatchBuilder } from '../model-patch.js';

/**
 * Stores the bend points of edges on the edges themselves, as their `routingPoints` - so they are saved
 * with the file, and undone and redone with everything else.
 */
@injectable()
export class GenericChangeRoutingPointsOperationHandler extends OperationHandler {
    readonly operationType = ChangeRoutingPointsOperation.KIND;

    declare readonly modelState: DiagramModelState;

    @inject(ModelPatchBuilder)
    protected readonly patches: ModelPatchBuilder;

    override createCommand(operation: ChangeRoutingPointsOperation): Command | undefined {
        const patch = operation.newRoutingPoints
            .map(({ elementId, newRoutingPoints }) => this.patches.routingPoints(elementId, newRoutingPoints ?? []))
            .filter((patchOperation): patchOperation is jsonpatch.Operation => patchOperation !== undefined);
        if (patch.length === 0) {
            return undefined;
        }
        return new ModelPatchCommand(this.modelState, JSON.stringify(patch));
    }
}
