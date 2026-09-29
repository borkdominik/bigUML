/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { isPackageMerge, type Relation } from '@borkdominik-biguml/uml-model-server/grammar';
import { siblingsOf } from './siblings.js';

/**
 * The merges into the same package as this one, this one included, in the order the model lists them.
 * The client draws them as branches off a single connector (see `UmlPolylineEdgeRouter`), and the
 * property palette lists them as one set.
 */
export function mergesIntoSamePackage(merge: Relation): Relation[] {
    const merged = merge.target?.ref?.__id;
    const group = siblingsOf(merge).filter((relation): relation is Relation => isPackageMerge(relation) && relation.target?.ref?.__id === merged);
    // A merge its own container does not list would otherwise come back as a set with no merges in it,
    // which no caller can label or count against.
    return group.length > 0 ? group : [merge];
}

/** Whether this merge is the one of its set that carries the shared `<<merge>>` label - the one listed first. */
export function leadsMergeGroup(merge: Relation): boolean {
    return mergesIntoSamePackage(merge)[0] === merge;
}
