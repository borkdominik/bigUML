/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { CommonModelTypes, EDGE_CENTER_TYPE } from '@borkdominik-biguml/uml-glsp-server';
import {
    astTypeOf,
    DIAGRAM_REGISTRY,
    type DiagramRegistration,
    type ElementMetadata,
    getElementMetadata,
    isFloatingType,
    isOwnedElementType
} from '@borkdominik-biguml/uml-glsp-server/gen/vscode';
import { DefaultTypes, type EdgeTypeHint, type ShapeTypeHint } from '@eclipse-glsp/protocol';

/**
 * The type hints the client is given, derived from the generated element metadata.
 *
 * A hint is what grants a node its handles: `TypeHintProvider` takes `resizeFeature` from `resizable`
 * and from nothing else, so every node type of every diagram gets a hint of its own. What a node may
 * take dropped on it follows from what it is: a container takes what its containment declares, and
 * everything else takes nothing.
 */

/** The node types that may stand on the canvas of a diagram by themselves, rather than only in an owner. */
function canvasNodeTypeIds(diagram: DiagramRegistration): string[] {
    return diagram.nodeTypeIds.filter(typeId => !isOwnedElementType(typeId));
}

/**
 * The canvas itself. Without a hint of its own the client's `GGraph` takes every type there is, so a
 * literal, a property or an operation could be dropped on empty canvas as if it were a shape - UML only
 * lets them exist inside their owner. Naming what the canvas does take is what gives such a drop the
 * not-allowed cursor; the create handler refuses it on its own as well.
 */
function canvasHint(): ShapeTypeHint {
    return {
        elementTypeId: DefaultTypes.GRAPH,
        repositionable: false,
        deletable: false,
        resizable: false,
        reparentable: false,
        containableElementTypeIds: DIAGRAM_REGISTRY.flatMap(canvasNodeTypeIds)
    };
}

/**
 * What may be dropped on a node of this type.
 *
 * What its containment declares - except a note, which is in nothing, and except members of a
 * general-purpose list: a containment that admits every node admits an operation only by accident, and
 * an operation is a row of the classifier that declares it.
 */
function containableTypeIds(meta: ElementMetadata): string[] {
    const declared = new Set(
        meta.contains.flatMap(({ childTypes }) => {
            const dedicatedToOwned = childTypes.every(isOwnedElementType);
            return childTypes.filter(childType => dedicatedToOwned || !isOwnedElementType(childType));
        })
    );
    // From every diagram, not only the one the container's own type belongs to: a class, a package and
    // their rows are drawn with the class diagram's types wherever they stand, so a package in the
    // package diagram is a class diagram package - and has to take the package diagram's class.
    return DIAGRAM_REGISTRY.flatMap(diagram => diagram.nodeTypeIds).filter(
        typeId => declared.has(astTypeOf(typeId)) && !isFloatingType(typeId)
    );
}

/** What a lane is, for what may be dropped on it: a partition, which holds the nodes of its lane. */
function laneMetadata(): ElementMetadata {
    const meta = getElementMetadata('ActivityPartition')!;
    return { ...meta, contains: meta.contains.filter(({ property }) => property === 'nodes') };
}

function nodeHint(typeId: string, meta: ElementMetadata): ShapeTypeHint {
    return {
        elementTypeId: typeId,
        repositionable: meta.shape.repositionable,
        resizable: meta.shape.resizable,
        deletable: meta.shape.deletable,
        reparentable: false,
        containableElementTypeIds: containableTypeIds(meta)
    };
}

/**
 * The compartments that are drawn for an element without being one, and so carry no metadata of their
 * own: the two of a state, and the lane of a swimlane.
 *
 * The band a region is drawn as is resizable and nothing else: it is how tall the region is that the
 * user drags, and a hint is the only thing that grants the handles to do it with. Not repositionable,
 * because the band is placed by the state that owns it; deletable, because deleting the band is
 * deleting the region. What may be dropped on it is what may be dropped on the state.
 *
 * The compartment a state's parts are written in is adjusted through `State.partsHeight` in the
 * property panel rather than by dragging: a resize is recorded against the element it was performed on,
 * and this compartment is not an element. So it takes no handles, and nothing may be dropped on it.
 *
 * A lane is sized by the partition it divides and takes the nodes a lane holds; deleting it is deleting
 * the subpartition it stands for.
 */
function compartmentHints(): ShapeTypeHint[] {
    return [
        {
            elementTypeId: CommonModelTypes.COMP_STATE_REGION,
            repositionable: false,
            deletable: true,
            resizable: true,
            reparentable: false,
            containableElementTypeIds: DIAGRAM_REGISTRY.flatMap(canvasNodeTypeIds)
        },
        {
            // A lane takes what its partition's lanes hold, and is placed and sized by the partition.
            elementTypeId: CommonModelTypes.COMP_PARTITION_LANE,
            repositionable: false,
            deletable: true,
            resizable: false,
            reparentable: false,
            containableElementTypeIds: containableTypeIds(laneMetadata())
        },
        {
            elementTypeId: CommonModelTypes.COMP_STATE_PARTS,
            repositionable: false,
            deletable: false,
            resizable: false,
            reparentable: false,
            containableElementTypeIds: []
        }
    ];
}

export function shapeTypeHints(): ShapeTypeHint[] {
    const hints: ShapeTypeHint[] = [canvasHint(), ...compartmentHints()];
    for (const diagram of DIAGRAM_REGISTRY) {
        for (const typeId of diagram.nodeTypeIds) {
            const meta = getElementMetadata(typeId);
            if (meta) {
                hints.push(nodeHint(typeId, meta));
            }
        }
    }
    return hints;
}

/**
 * One hint for the generic edge type. Every node may be an end of it, as may a connection point - the
 * port an edge is pinned to on a diamond, a bar or an action.
 */
export function edgeTypeHints(): EdgeTypeHint[] {
    // The centre dot of an edge is an end as well: that is how an edge is attached to another (see `edge-anchor.ts`).
    const endTypeIds = [...DIAGRAM_REGISTRY.flatMap(diagram => diagram.nodeTypeIds), CommonModelTypes.CONNECTION_POINT, EDGE_CENTER_TYPE];
    return [
        {
            elementTypeId: DefaultTypes.EDGE,
            repositionable: true,
            deletable: true,
            routable: true,
            sourceElementTypeIds: endTypeIds,
            targetElementTypeIds: endTypeIds
        }
    ];
}
