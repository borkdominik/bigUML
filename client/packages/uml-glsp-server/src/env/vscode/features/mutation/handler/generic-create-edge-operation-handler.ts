/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { type ConnectionPoint, edgeAnchorId, parseConnectionPointId, parseEdgeCenterId } from '@borkdominik-biguml/uml-glsp-server';
import { getDefaultProperties, storedAstTypeOf } from '@borkdominik-biguml/uml-glsp-server/gen/vscode';
import { createRandomUUID, type IdAstNode, type jsonPatch, type SerializeAstNode } from '@borkdominik-biguml/uml-model-server';
import { type Edge, reflection } from '@borkdominik-biguml/uml-model-server/grammar';
import {
    type Command,
    CreateEdgeOperation,
    type CreateEdgeOperationHandler,
    OperationHandler,
    TriggerEdgeCreationAction
} from '@eclipse-glsp/server';
import { inject, injectable, multiInject, optional } from 'inversify';
import { ModelPatchCommand } from '../../command/model-patch-command.js';
import { DiagramLanguageMetadata } from '../../model/diagram-language-metadata.js';
import { type DiagramModelState } from '../../model/diagram-model-state.js';
import { type EdgeEnds, firstClaim, MutationExtension } from '../extension/mutation-extension.js';

/** The diagram's own list of relations, where every edge drawn on the canvas lives. */
const DIAGRAM_RELATIONS = '/diagram/relations/-';
const DIAGRAM_ENTITIES = '/diagram/entities/-';

/**
 * Creates an edge of any type between the two elements it was drawn between. What one edge does
 * differently - where a package merge dropped on a connector really runs - comes from the
 * {@link MutationExtension}s.
 */
@injectable()
export class GenericCreateEdgeOperationHandler extends OperationHandler implements CreateEdgeOperationHandler {
    readonly operationType = CreateEdgeOperation.KIND;

    declare readonly modelState: DiagramModelState;

    @inject(DiagramLanguageMetadata)
    protected readonly metadata: DiagramLanguageMetadata;

    @multiInject(MutationExtension)
    @optional()
    protected readonly extensions: MutationExtension[] = [];

    get elementTypeIds(): string[] {
        return this.metadata.edgeTypeIds;
    }

    override label = 'Relation';

    getTriggerActions(): TriggerEdgeCreationAction[] {
        return this.elementTypeIds.map(typeId => TriggerEdgeCreationAction.create(typeId));
    }

    override createCommand(operation: CreateEdgeOperation): Command {
        // Anchors first: the relation refers to them, and one ending on another edge's centre dot needs the
        // anchor on that edge to exist when it is linked (see `anchorReferenceFor`).
        const anchors: jsonPatch.AddOperation<unknown>[] = [];
        const relation = this.createSemantic(operation, anchors);
        return new ModelPatchCommand(this.modelState, JSON.stringify([...anchors, relation]));
    }

    protected createSemantic(
        operation: CreateEdgeOperation,
        anchors: jsonPatch.AddOperation<unknown>[] = []
    ): jsonPatch.AddOperation<SerializeAstNode<Edge>> {
        // An end dropped on a connection point names the port, not the shape. The edge is still between
        // the two shapes - a transition runs to the choice, not to a point on it - so the port is split
        // back into its owner, and which point it was records the pin.
        const source = parseConnectionPointId(operation.sourceElementId);
        const target = parseConnectionPointId(operation.targetElementId);

        // An end dropped on the centre dot of an edge ends on that edge's anchor instead of on a node.
        const sourceAnchor = this.anchorReferenceFor(operation.sourceElementId, anchors);
        const targetAnchor = this.anchorReferenceFor(operation.targetElementId, anchors);

        // Extensions read the two nodes an edge runs between, so they are asked only where both ends are nodes.
        const { source: sourceNode, target: targetNode } =
            sourceAnchor || targetAnchor
                ? {
                      source: sourceAnchor ? undefined : this.modelState.index.findIdElement(source?.ownerId ?? operation.sourceElementId),
                      target: targetAnchor ? undefined : this.modelState.index.findIdElement(target?.ownerId ?? operation.targetElementId)
                  }
                : this.resolveEnds(source?.ownerId ?? operation.sourceElementId, target?.ownerId ?? operation.targetElementId);
        if ((!sourceAnchor && !sourceNode) || (!targetAnchor && !targetNode)) {
            throw new Error('Source or target node not found for creating edge');
        }

        const astType = storedAstTypeOf(operation.elementTypeId);
        const value: Record<string, unknown> = {
            $type: astType,
            __id: createRandomUUID(astType),
            source: sourceAnchor ?? this.referenceTo(sourceNode!),
            target: targetAnchor ?? this.referenceTo(targetNode!)
        };

        for (const { property, defaultValue } of getDefaultProperties(operation.elementTypeId)) {
            if (value[property] === undefined) {
                value[property] = defaultValue;
            }
        }

        // Written after the defaults, and removed rather than left unset, because the generated defaults
        // do not know what a connection point is: `getDefaultProperties` falls through to an empty array
        // for a property type it has no case for, and `sourcePoint: []` is nothing the grammar can read
        // back. An absent property is what marks an end as unpinned.
        this.setConnectionPoint(value, astType, 'sourcePoint', source?.point);
        this.setConnectionPoint(value, astType, 'targetPoint', target?.point);

        return { op: 'add', path: DIAGRAM_RELATIONS, value: value as SerializeAstNode<Edge> };
    }

    /**
     * A reference to the `EdgeAnchor` of the edge whose centre dot `endId` is, or `undefined` where it is not
     * a centre dot. The anchor is the edge's existing one where it has one - every edge attached to an edge
     * shares it - and otherwise added to `anchors`, next to the diagram's other elements.
     */
    protected anchorReferenceFor(
        endId: string,
        anchors: jsonPatch.AddOperation<unknown>[]
    ): ReturnType<typeof this.referenceTo> | undefined {
        const edgeId = parseEdgeCenterId(endId);
        const edge = edgeId ? this.modelState.index.findIdElement(edgeId) : undefined;
        if (!edgeId || !edge) {
            return undefined;
        }

        const anchorId = edgeAnchorId(edgeId);
        const existing = this.modelState.index.findIdElement(anchorId);
        if (existing) {
            return this.referenceTo(existing);
        }

        const documentUri = edge.$document?.uri;
        if (!anchors.some(anchor => (anchor.value as { __id?: string }).__id === anchorId)) {
            anchors.push({
                op: 'add',
                path: DIAGRAM_ENTITIES,
                value: {
                    $type: 'EdgeAnchor',
                    __id: anchorId,
                    edge: { ref: { __id: edgeId, __documentUri: documentUri }, $refText: edgeId }
                }
            });
        }
        return { ref: { __id: anchorId, __documentUri: documentUri }, $refText: anchorId };
    }

    /** The two elements the new edge runs between: the two clicked, unless an extension reads them differently. */
    protected resolveEnds(sourceId: string, targetId: string): EdgeEnds {
        const source = this.modelState.index.findIdElement(sourceId);
        const target = this.modelState.index.findIdElement(targetId);
        return firstClaim(this.extensions, extension => extension.resolveEdgeEnds?.(source, target)) ?? { source, target };
    }

    protected referenceTo(node: IdAstNode): { ref: { __id: string; __documentUri: unknown }; $refText: string } {
        return {
            ref: { __id: node.__id, __documentUri: node.$document?.uri },
            $refText: this.modelState.nameProvider.getLocalName(node) ?? node.__id
        };
    }

    /**
     * Stores a pinned connection point, or removes the property entirely when the end is not pinned or
     * the edge has nowhere to keep it. Only some edges declare `sourcePoint`/`targetPoint`; written onto
     * one of the others the pin would go into the file under a rule with no field to read it back.
     * Asked of the grammar rather than kept as a list, so an edge given the property later is pinnable
     * by that alone.
     */
    protected setConnectionPoint(
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
}
