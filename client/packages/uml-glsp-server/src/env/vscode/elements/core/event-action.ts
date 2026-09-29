/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { getDefaultSize } from '@borkdominik-biguml/uml-glsp-server/gen/vscode';
import type { Dimension } from '@eclipse-glsp/protocol';
import type { BaseElementProps } from './element-context.js';

/**
 * What the two signal actions have in common: the same box with a notch half its height deep, cut into
 * the left edge of an accept event action and pushed out of the right edge of a send signal action.
 * Kept in one place so the two cannot drift apart, since only the side differs.
 */

/** Inset of the name from the borders that are not notched. */
export const ACTION_PADDING = 8;

/**
 * How far the notch reaches in from the notched side, which is what the name has to clear.
 *
 * Half the height, which is what both views draw - `AcceptEventActionView` cuts to that depth and
 * `SendSignalActionView` points out from it - so the two are read from the same number.
 */
export function notchDepth(size: Dimension): number {
    return size.height / 2;
}

/**
 * Stored `bounds` can carry no usable dimensions - a zero width or height, say -
 * which a plain `?? default` would accept - and the client layouter then collapses the shape onto its
 * name. Only positive dimensions count as a size someone chose.
 */
export function eventActionSize(type: string, size: BaseElementProps['size']): Dimension {
    const defaultSize = getDefaultSize(type);
    return {
        width: size?.width && size.width > 0 ? size.width : defaultSize.width,
        height: size?.height && size.height > 0 ? size.height : defaultSize.height
    };
}
