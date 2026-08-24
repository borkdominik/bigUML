/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import {
    isActivityPartition,
    isChoice,
    isDecisionNode,
    isFork,
    isForkNode,
    isJoin,
    isJoinNode,
    isMergeNode
} from '@borkdominik-biguml/uml-model-server/grammar';

/**
 * Property id of the orientation the property palette offers for the shapes below.
 *
 * It is not a property of the element: which way one of these runs is the shape of its bounds, and
 * storing that separately would let the two disagree the moment the shape is dragged. The palette
 * reads the value back off the bounds and setting it swaps them, so it behaves as a turn rather than
 * as state - see `RequestPropertyPaletteActionHandler` and `GenericUpdateOperationHandler`.
 */
export const ORIENTATION_PROPERTY_ID = 'orientation';

/** Kept in step with `GForkJoinNodeElement` and `GDiamondNodeElement`, which open shapes at these sizes. */
const DEFAULT_BAR_SIZE = { width: 120, height: 10 };
const DEFAULT_DIAMOND_SIZE = { width: 40, height: 40 };

/**
 * The size a turnable shape opens at, or `undefined` for everything else - which is also what marks
 * an element as turnable at all. The fork/join bars and the branch diamonds qualify: both are drawn
 * to their bounds with no inherent way up, so swapping those bounds is all turning one amounts to.
 */
export function turnableDefaultSize(element: unknown): { width: number; height: number } | undefined {
    if (isFork(element) || isJoin(element) || isForkNode(element) || isJoinNode(element)) {
        return DEFAULT_BAR_SIZE;
    }
    if (isChoice(element) || isDecisionNode(element) || isMergeNode(element)) {
        return DEFAULT_DIAMOND_SIZE;
    }
    return undefined;
}

/** Kept in step with `GActivityPartitionNodeElement`, which opens a swimlane at this size. */
const DEFAULT_PARTITION_SIZE = { width: 600, height: 300 };

/**
 * The size an element that *stores* its orientation opens at, or `undefined` for everything else.
 *
 * A partition keeps which way its lanes run as a property of its own, because that cannot be read back
 * off its bounds the way a bar's can: a block of any proportions holds lanes running either way. But
 * turning one should still stand the block on its other side rather than leaving lanes running the short
 * way across a shape still lying the long way - so the bounds are swapped as well as the property written.
 */
export function storedOrientationDefaultSize(element: unknown): { width: number; height: number } | undefined {
    return isActivityPartition(element) ? DEFAULT_PARTITION_SIZE : undefined;
}
