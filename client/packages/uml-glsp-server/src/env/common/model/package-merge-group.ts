/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { isPackageMerge, type Relation } from '@borkdominik-biguml/uml-model-server/grammar';

/**
 * Every merge into the same package as this one, in model order and including it.
 *
 * The merges into a package are drawn as branches off a single connector rather than as a line each
 * (see `packageMergeRoute`), and what is drawn once is labelled once: the set carries a single
 * `<<merge>>` between them rather than one apiece repeating on every branch what the connector
 * already says.
 *
 * In model order so that the label keeps to the same merge as others are added, rather than moving to
 * whichever one happens to be nearest the package they run into.
 */
export function mergesIntoSamePackage(merge: Relation): Relation[] {
    // Read through `$containerProperty` rather than naming the array, for the same reason
    // `messagesOnLink` does: a relation is owned by whichever property holds it, and naming one would
    // report a set of one for every merge stored in another.
    const container = merge.$container as unknown as Record<string, unknown> | undefined;
    const siblings = merge.$containerProperty ? container?.[merge.$containerProperty] : undefined;
    if (!Array.isArray(siblings)) {
        return [merge];
    }

    const merged = merge.target?.ref?.__id;
    const group = siblings.filter((relation): relation is Relation => isPackageMerge(relation) && relation.target?.ref?.__id === merged);
    // A merge its own container does not list would otherwise come back as a set with no merges in it,
    // which no caller can label or count against.
    return group.length > 0 ? group : [merge];
}

/**
 * Whether this is the merge of its set that carries the `<<merge>>` the set is labelled by once.
 *
 * The arrow head the connector ends in is settled the same way but on the client, which is the only
 * side that knows which merge ended up drawn as the end of it - see `showsMergeArrow`.
 */
export function leadsMergeGroup(merge: Relation): boolean {
    return mergesIntoSamePackage(merge)[0] === merge;
}
