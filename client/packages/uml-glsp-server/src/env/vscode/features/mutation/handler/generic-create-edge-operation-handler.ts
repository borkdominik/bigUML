/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { createRandomUUID, type jsonPatch, type SerializedPatchValue } from '@borkdominik-biguml/model-server';
import type { Edge } from '@borkdominik-biguml/model-server/grammar';
import {
    type Command,
    CreateEdgeOperation,
    type CreateEdgeOperationHandler,
    OperationHandler,
    TriggerEdgeCreationAction
} from '@eclipse-glsp/server';
import { getProperties, getRelationTypeFromElementId } from '../../../../../gen/vscode/getDefaultValue.js';
import { ModelPatchCommand } from '../../command/model-patch-command.js';
import { type BaseDiagramModelState } from '../../model/base-diagram-model-state.js';

export abstract class GenericCreateEdgeOperationHandler extends OperationHandler implements CreateEdgeOperationHandler {
    readonly operationType = CreateEdgeOperation.KIND;

    declare readonly modelState: BaseDiagramModelState;

    abstract readonly elementTypeIds: string[];

    override label = 'Relation';

    // TODO: HAYDAR Read from meta model
    getTriggerActions(): TriggerEdgeCreationAction[] {
        return this.elementTypeIds.map(typeId => TriggerEdgeCreationAction.create(typeId));
    }

    override createCommand(operation: CreateEdgeOperation): Command {
        const patch = this.createSemantic(operation);
        return new ModelPatchCommand(this.modelState, JSON.stringify(patch));
    }

    protected createSemantic(operation: CreateEdgeOperation): jsonPatch.AddOperation<SerializedPatchValue<Edge>> {
        const sourceNode = this.modelState.index.findIdElement(operation.sourceElementId);
        const targetNode = this.modelState.index.findIdElement(operation.targetElementId);
        if (!sourceNode || !targetNode) {
            throw new Error('Source or target node not found for creating edge');
        }

        const id = createRandomUUID();

        const astType = getRelationTypeFromElementId(operation.elementTypeId, false);
        const relationType = getRelationTypeFromElementId(operation.elementTypeId, true);

        const value: any = {
            $type: astType,
            __id: id,
            source: {
                ref: { __id: sourceNode.__id, __documentUri: sourceNode.$document?.uri },
                $refText: this.modelState.nameProvider.getLocalName(sourceNode) ?? sourceNode.__id
            },
            target: {
                ref: { __id: targetNode.__id, __documentUri: targetNode.$document?.uri },
                $refText: this.modelState.nameProvider.getLocalName(targetNode) ?? targetNode.__id
            },
            relationType
        };

        for (const { property, defaultValue } of getProperties(operation.elementTypeId)) {
            if (value[property] === undefined) {
                value[property] = defaultValue;
            }
        }

        return {
            op: 'add',
            path: '/diagram/relations/-',
            value
        };
    }
}
