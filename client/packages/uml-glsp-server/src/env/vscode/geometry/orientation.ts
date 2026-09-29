/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { getDefaultSize } from '@borkdominik-biguml/uml-glsp-server/gen/vscode';
import { isActivityPartition } from '@borkdominik-biguml/uml-model-server/grammar';
import type { Dimension } from '@eclipse-glsp/protocol';
import { connectionPointLayoutOf } from './connection-point-layout.js';

/**
 * The property id the property palette offers for turning a shape. Not a property of any element: a
 * bar or a diamond stores no orientation, and turning one is a swap of its bounds (see
 * `OrientationTurnExtension`).
 */
export const ORIENTATION_PROPERTY_ID = 'orientation';

/**
 * The size a shape that is turned by swapping its bounds opens at, for the shapes that can be turned
 * that way - the bars and the diamonds - or `undefined` for everything else. A turn on a shape that has
 * never been given a size swaps this one.
 */
export function turnableDefaultSize(element: unknown): Dimension | undefined {
    const layout = connectionPointLayoutOf(element);
    if (layout !== 'bar' && layout !== 'diamond') {
        return undefined;
    }
    return getDefaultSize((element as { $type: string }).$type);
}

/**
 * The size a shape that *stores* its orientation opens at - a swimlane, whose lanes run the way its
 * `orientation` says. Turning one writes the property and swaps the bounds both.
 */
export function storedOrientationDefaultSize(element: unknown): Dimension | undefined {
    return isActivityPartition(element) ? getDefaultSize(element.$type) : undefined;
}
