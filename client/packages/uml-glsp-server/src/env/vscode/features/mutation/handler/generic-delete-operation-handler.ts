/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import type { IdAstNode } from '@borkdominik-biguml/uml-model-server';
import { edgeAnchorId } from '@borkdominik-biguml/uml-glsp-server';
import {
    isClassifier,
    isEdge,
    isEdgeAnchor,
    isElement,
    isElementWithSizeAndPosition,
    type Relation
} from '@borkdominik-biguml/uml-model-server/grammar';
import { type Command, DeleteElementOperation, OperationHandler } from '@eclipse-glsp/server';
import type * as jsonpatch from 'fast-json-patch';
import { injectable } from 'inversify';
import { type AstNode, AstUtils } from 'langium';
import { TYPED_PROPERTIES } from '../../../notation/typed-element.js';
import { ModelPatchCommand } from '../../command/model-patch-command.js';
import { type DiagramModelState } from '../../model/diagram-model-state.js';

type RemoveOp = { op: 'remove'; path: string };

/**
 * Deletes elements of any kind: a node together with the edges that run to it, an edge together with
 * the anchors only it was attached to, an element placed by its owner on its own. Layout is stored on the
 * element it belongs to and goes with it.
 */
@injectable()
export class GenericDeleteOperationHandler extends OperationHandler {
    readonly operationType = DeleteElementOperation.KIND;

    declare readonly modelState: DiagramModelState;

    override createCommand(operation: DeleteElementOperation): Command | undefined {
        if (!operation.elementIds || operation.elementIds.length === 0) {
            return undefined;
        }
        const removes = this.buildDeletePatch(operation);
        if (removes.length === 0) {
            return undefined;
        }
        // Applied first, while every path still points where it was read from - the removes after them
        // shift the lists they take elements out of.
        const patch: jsonpatch.Operation[] = [...this.retypeReferencesToDeleted(operation), ...removes];
        if (patch.length === 0) {
            return undefined;
        }
        return new ModelPatchCommand(this.modelState, JSON.stringify(patch));
    }

    protected buildDeletePatch(operation: DeleteElementOperation): RemoveOp[] {
        const removes: RemoveOp[] = [];
        const visitedAnchors = new Set<string>();

        for (const elementId of operation.elementIds) {
            const element = this.modelState.index.findSemanticElement(elementId, isElement);
            if (!element) {
                continue;
            }
            const semanticId = (element as IdAstNode).__id ?? elementId;
            const elementPath = this.modelState.index.findPath(semanticId);

            if (isElementWithSizeAndPosition(element)) {
                removes.push(...this.removeIncidentEdges(semanticId, visitedAnchors));
            }
            if (isEdge(element)) {
                removes.push(...this.removeAnchorOf(semanticId, visitedAnchors));
                removes.push(...this.removeAnchorsLeftUnused(element as Relation, operation.elementIds));
            }
            if (elementPath) {
                removes.push({ op: 'remove', path: elementPath });
            }
        }

        // The same path can be collected more than once - an edge selected and also incident to a
        // selected node. Duplicate removes would shift indices and delete unrelated elements.
        const unique = new Map<string, RemoveOp>();
        for (const op of removes) {
            unique.set(op.path, op);
        }
        return sortRemoves([...unique.values()]);
    }

    /**
     * The properties and parameters typed with a type that is being deleted - on its own, or with the
     * package it is in - keep that type as the name it had. A reference to an element that is gone would
     * leave them with no type at all, where the name is what the user last saw them typed with.
     */
    protected retypeReferencesToDeleted(operation: DeleteElementOperation): jsonpatch.Operation[] {
        const deletedTypes = new Map<string, string | undefined>();
        for (const elementId of operation.elementIds) {
            const element = this.modelState.index.findSemanticElement(elementId, isElement);
            if (!element) {
                continue;
            }
            for (const node of [element, ...AstUtils.streamAllContents(element)]) {
                if (isClassifier(node)) {
                    deletedTypes.set(node.__id, node.name);
                }
            }
        }
        if (deletedTypes.size === 0) {
            return [];
        }

        const patch: jsonpatch.Operation[] = [];
        for (const node of AstUtils.streamAllContents(this.modelState.semanticRoot as AstNode)) {
            for (const [property, referenceProperty] of Object.entries(TYPED_PROPERTIES)) {
                const reference = (node as unknown as Record<string, { ref?: { __id?: string } } | undefined>)[referenceProperty];
                const referencedId = reference?.ref?.__id;
                if (!referencedId || !deletedTypes.has(referencedId)) {
                    continue;
                }
                const path = this.modelState.index.findPath((node as IdAstNode).__id);
                if (!path) {
                    continue;
                }
                const name = deletedTypes.get(referencedId);
                if (name) {
                    patch.push({ op: 'add', path: `${path}/${property}`, value: name });
                }
                patch.push({ op: 'remove', path: `${path}/${referenceProperty}` });
            }
        }
        return patch;
    }

    /**
     * The edges that run to or from a node, wherever they are stored - on the diagram's own list or on
     * a container that owns them, the way a region owns its transitions.
     */
    protected removeIncidentEdges(nodeId: string, visitedAnchors = new Set<string>()): RemoveOp[] {
        const removes: RemoveOp[] = [];
        for (const edge of AstUtils.streamAllContents(this.modelState.semanticRoot).filter(isEdge)) {
            const relation = edge as Relation;
            if (relation.source?.ref?.__id !== nodeId && relation.target?.ref?.__id !== nodeId) {
                continue;
            }
            const edgePath = this.modelState.index.findPath(edge.__id);
            if (edgePath) {
                removes.push({ op: 'remove', path: edgePath });
            }
            removes.push(...this.removeAnchorOf(edge.__id, visitedAnchors));
        }
        return removes;
    }

    /**
     * The anchor on an edge that is going, and everything attached to the edge through it - which goes
     * with it, as the edges of a deleted node do. Followed on through edges attached to those in turn;
     * `visitedAnchors` stops it going round where edges are attached to each other.
     */
    protected removeAnchorOf(edgeId: string, visitedAnchors: Set<string>): RemoveOp[] {
        const anchorId = edgeAnchorId(edgeId);
        if (visitedAnchors.has(anchorId)) {
            return [];
        }
        visitedAnchors.add(anchorId);
        const anchorPath = this.modelState.index.findPath(anchorId);
        if (!anchorPath) {
            return [];
        }
        return [...this.removeIncidentEdges(anchorId, visitedAnchors), { op: 'remove', path: anchorPath }];
    }

    /**
     * The anchors a deleted edge ended on that nothing else is attached to any more. An anchor only stands
     * for the point an edge was drawn to, so once the last edge drawn to it is gone there is nothing left
     * for it to be.
     */
    protected removeAnchorsLeftUnused(relation: Relation, deletedIds: string[]): RemoveOp[] {
        const removes: RemoveOp[] = [];
        for (const end of [relation.source?.ref, relation.target?.ref]) {
            if (!isEdgeAnchor(end)) {
                continue;
            }
            const stillAttached = AstUtils.streamAllContents(this.modelState.semanticRoot)
                .filter(isEdge)
                .some(edge => {
                    const other = edge as Relation;
                    return (
                        other !== relation &&
                        !deletedIds.includes(other.__id) &&
                        (other.source?.ref?.__id === end.__id || other.target?.ref?.__id === end.__id)
                    );
                });
            const anchorPath = this.modelState.index.findPath(end.__id);
            if (!stillAttached && anchorPath) {
                removes.push({ op: 'remove', path: anchorPath });
            }
        }
        return removes;
    }
}

/**
 * Removes in the order JSON Patch needs them: edges before the nodes they run to, and otherwise from the
 * end of the document back to its start - so that no remove shifts the index of one still to come, and
 * an element nested in another that is going too - a region selected along with its state - is taken
 * out before its owner, while its path still leads somewhere.
 */
function sortRemoves(ops: ReadonlyArray<RemoveOp>): RemoveOp[] {
    const bucket = (path: string): number =>
        path.startsWith('/diagram/relations') ? 0 : path.startsWith('/diagram/') ? 1 : 2;

    return [...ops].sort((a, b) => bucket(a.path) - bucket(b.path) || compareDocumentOrder(b.path, a.path));
}

/**
 * Where two JSON pointers stand in the document, compared segment by segment: list indices as the
 * numbers they are - `10` after `9` - and a pointer after the one it is nested in.
 */
function compareDocumentOrder(a: string, b: string): number {
    const as = a.split('/');
    const bs = b.split('/');
    for (let i = 0; i < Math.min(as.length, bs.length); i++) {
        if (as[i] === bs[i]) {
            continue;
        }
        const an = Number(as[i]);
        const bn = Number(bs[i]);
        if (Number.isInteger(an) && Number.isInteger(bn)) {
            return an - bn;
        }
        return as[i] < bs[i] ? -1 : 1;
    }
    return as.length - bs.length;
}
