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
import { inject, injectable } from 'inversify';
import { BigUmlCommand } from '../../../biguml/index.js';
import { ModelTypes } from '../../../util/model-types.js';
import { getProperties, getRelationTypeFromElementId } from '../../../yo-generated/getDefaultValue.js';
import { ClassDiagramModelState } from '../../model/class-diagram-model-state.js';

@injectable()
export class GenericCreateEdgeOperationHandler extends OperationHandler implements CreateEdgeOperationHandler {
    readonly operationType = CreateEdgeOperation.KIND;

    elementTypeIds = [
        ModelTypes.ABSTRACTION,
        ModelTypes.AGGREGATION,
        ModelTypes.ASSOCIATION,
        ModelTypes.COMPOSITION,
        ModelTypes.DEPENDENCY,
        ModelTypes.GENERALIZATION,
        ModelTypes.INTERFACE_REALIZATION,
        ModelTypes.PACKAGE_IMPORT,
        ModelTypes.PACKAGE_MERGE,
        ModelTypes.REALIZATION,
        ModelTypes.SUBSTITUTION,
        ModelTypes.USAGE
    ];

    /** Palette label */
    override label = 'Relation';

    @inject(ClassDiagramModelState)
    declare modelState: ClassDiagramModelState;

    getTriggerActions(): TriggerEdgeCreationAction[] {
        return this.elementTypeIds.map(typeId => TriggerEdgeCreationAction.create(typeId));
    }

    override createCommand(operation: CreateEdgeOperation): Command {
        const patch = this.createEdge(operation);
        return new BigUmlCommand(this.modelState, patch);
    }

    protected createEdge(operation: CreateEdgeOperation): string {
        const sourceNode = this.modelState.index.findIdElement(operation.sourceElementId);
        const targetNode = this.modelState.index.findIdElement(operation.targetElementId);
        if (!sourceNode || !targetNode) {
            return;
        }

        const id = createRandomUUID();

        const astType = getRelationTypeFromElementId(operation.elementTypeId, false);
        console.log('KOKOT', operation.elementTypeId);
        console.log('ASTTYPE: ', astType);
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

    /*protected getRelationTypeFromElementId(elementTypeId: string, upperCase: boolean): string {
        console.log('ELEMENTTYPEID: ', elementTypeId);
        const withoutPrefix = elementTypeId.replace(/^.*?__/, '');
        const head = withoutPrefix.split('__')[0];

        if (upperCase) {
            const withUnderscore = head.replace(/([a-z])([A-Z])/g, '$1_$2');
            return withUnderscore.toUpperCase();
        } else {
            return head.charAt(0).toUpperCase() + head.slice(1);
        }
    }*/
}
