/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { getDefaultProperties, getRelationTypeFromElementId } from '@borkdominik-biguml/uml-glsp-server/gen/vscode';
import { createRandomUUID, type jsonPatch, type SerializeAstNode } from '@borkdominik-biguml/uml-model-server';
import type { Edge } from '@borkdominik-biguml/uml-model-server/grammar';
import {
    type Command,
    CreateEdgeOperation,
    type CreateEdgeOperationHandler,
    OperationHandler,
    TriggerEdgeCreationAction
} from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { ModelPatchCommand } from '../../command/model-patch-command.js';
import { DiagramLanguageMetadata } from '../../model/diagram-language-metadata.js';
import { type DiagramModelState } from '../../model/diagram-model-state.js';

@injectable()
export class GenericCreateEdgeOperationHandler extends OperationHandler implements CreateEdgeOperationHandler {
    readonly operationType = CreateEdgeOperation.KIND;

    declare readonly modelState: DiagramModelState;

    @inject(DiagramLanguageMetadata)
    protected readonly metadata: DiagramLanguageMetadata;

    get elementTypeIds(): string[] {
        return this.metadata.edgeTypeIds;
    }

    override label = 'Relation';

    getTriggerActions(): TriggerEdgeCreationAction[] {
        return this.elementTypeIds.map(typeId => TriggerEdgeCreationAction.create(typeId));
    }

    override createCommand(operation: CreateEdgeOperation): Command {
        const patch = this.createSemantic(operation);
        return new ModelPatchCommand(this.modelState, JSON.stringify(patch));
    }

    protected createSemantic(operation: CreateEdgeOperation): jsonPatch.AddOperation<SerializeAstNode<Edge>> {
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

        for (const { property, defaultValue } of getDefaultProperties(operation.elementTypeId)) {
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
