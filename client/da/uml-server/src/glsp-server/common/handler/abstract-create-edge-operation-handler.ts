/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { createRandomUUID } from '@borkdominik-biguml/model-service';
import {
    Command,
    CreateEdgeOperation,
    CreateEdgeOperationHandler,
    OperationHandler,
    TriggerEdgeCreationAction
} from '@eclipse-glsp/server';
import { BigUmlCommand } from '../../biguml/index.js';
import { getProperties, getRelationTypeFromElementId } from '../../yo-generated/getDefaultValue.js';
import { BaseDiagramModelState } from '../model/base-diagram-model-state.js';

export abstract class AbstractCreateEdgeOperationHandler extends OperationHandler implements CreateEdgeOperationHandler {
    readonly operationType = CreateEdgeOperation.KIND;

    abstract override readonly modelState: BaseDiagramModelState;

    abstract readonly elementTypeIds: string[];

    override label = 'Relation';

    override createCommand(operation: CreateEdgeOperation): Command {
        const patch = this.createEdge(operation);
        return new BigUmlCommand(this.modelState, patch);
    }

    getTriggerActions(): TriggerEdgeCreationAction[] {
        return this.elementTypeIds.map(typeId => TriggerEdgeCreationAction.create(typeId));
    }

    protected createEdge(operation: CreateEdgeOperation): string {
        const sourceNode = this.modelState.index.findIdElement(operation.sourceElementId);
        const targetNode = this.modelState.index.findIdElement(operation.targetElementId);
        if (!sourceNode || !targetNode) {
            return '';
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

        const patch = {
            op: 'add' as const,
            path: '/diagram/relations/-',
            value
        };

        return JSON.stringify(patch);
    }
}
