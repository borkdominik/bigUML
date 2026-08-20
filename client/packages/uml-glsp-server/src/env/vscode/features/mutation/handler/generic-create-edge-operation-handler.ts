/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { type ConnectionPoint, parseConnectionPointId } from '@borkdominik-biguml/uml-glsp-server';
import { getDefaultProperties, getRelationTypeFromElementId } from '@borkdominik-biguml/uml-glsp-server/gen/vscode';
import { createRandomUUID, type IdAstNode, type jsonPatch, type SerializeAstNode } from '@borkdominik-biguml/uml-model-server';
import { type Edge, isPackageMerge, reflection } from '@borkdominik-biguml/uml-model-server/grammar';
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
        // An end dropped on a connection point names the port, not the shape. The edge is still between
        // the two shapes - a transition runs to the choice, not to a point on it - so the port is split
        // back into its owner, and which point it was records the pin.
        const source = parseConnectionPointId(operation.sourceElementId);
        const target = parseConnectionPointId(operation.targetElementId);

        const { source: sourceNode, target: targetNode } = this.findEnds(
            source?.ownerId ?? operation.sourceElementId,
            target?.ownerId ?? operation.targetElementId
        );
        if (!sourceNode || !targetNode) {
            throw new Error('Source or target node not found for creating edge');
        }

        const astType = getRelationTypeFromElementId(operation.elementTypeId, false);
        const id = createRandomUUID(astType);

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
            }
        };

        for (const { property, defaultValue } of getDefaultProperties(operation.elementTypeId)) {
            if (value[property] === undefined) {
                value[property] = defaultValue;
            }
        }

        // Written after the defaults, and removed rather than left unset, because the generated
        // defaults do not know what a connection point is: `getDefaultProperties` falls through to an
        // empty array for any property type it has no case for, so an unpinned end would be stored as
        // `sourcePoint: []` - which the grammar, expecting one of four names, cannot read back.
        // An absent property is what marks an end as unpinned.
        setConnectionPoint(value, astType, 'sourcePoint', source?.point);
        setConnectionPoint(value, astType, 'targetPoint', target?.point);

        return {
            op: 'add',
            path: '/diagram/relations/-',
            value
        };
    }

    /**
     * The two elements the new edge is to run between.
     *
     * Usually the two that were clicked, the way round they were clicked. A package merge is the
     * exception: the merges into one package are drawn as a single connector, and an end dropped on it
     * names that connector rather than a package - so it is read back to the package the connector
     * runs into, and the merge joins the set instead of ending on one of its lines.
     *
     * A connector also says which way round the new merge goes, whichever end it was dropped on. It
     * gathers packages into the one it runs into, so the package is what the merge runs from and that
     * one is what it runs to - clicking the connector first and the package second is the same thing
     * said in the other order. Nothing but a merge can be dropped on a connector; the client sees to
     * that (see `GPackageMergeEdge`).
     */
    protected findEnds(sourceId: string, targetId: string): { source?: IdAstNode; target?: IdAstNode } {
        const source = this.modelState.index.findIdElement(sourceId);
        const target = this.modelState.index.findIdElement(targetId);
        const sourceConnector = isPackageMerge(source) ? source : undefined;
        const targetConnector = isPackageMerge(target) ? target : undefined;

        if (sourceConnector && targetConnector) {
            // Both ends on a connector, and so no package to gather. Left unresolved, which is
            // reported rather than stored.
            return {};
        }
        if (sourceConnector) {
            return { source: target, target: sourceConnector.target?.ref };
        }
        if (targetConnector) {
            return { source, target: targetConnector.target?.ref };
        }
        return { source, target };
    }
}

/**
 * Stores a pinned connection point, or removes the property entirely when the end is not pinned or the
 * edge has nowhere to keep it.
 *
 * The tips of a diamond are dropped on with whatever tool the user reached for, and only some edges
 * declare `sourcePoint`/`targetPoint` - a transition, a control flow, an association. Written onto one
 * of the others the pin would go into the file under a rule with no field to read it back, and the
 * diagram would stop opening. That end stays unpinned instead, which is where the client's anchor puts
 * it anyway: on the nearest tip, recomputed as the shapes move rather than held.
 *
 * Asked of the grammar rather than kept as a list here, so an edge given the property later is pinnable
 * by that alone.
 */
function setConnectionPoint(
    value: Record<string, unknown>,
    astType: string,
    property: string,
    point: ConnectionPoint | undefined
): void {
    if (point && property in reflection.getTypeMetaData(astType).properties) {
        value[property] = point;
    } else {
        delete value[property];
    }
}
