/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
/** @jsx svg */
import { svg } from '@eclipse-glsp/client';
import { type VNode } from 'snabbdom';

/**
 * The invisible shapes that make a thin or hollow one clickable.
 *
 * What a shape is drawn as and what it can be aimed at are not the same thing. A fork bar is ten pixels
 * thick, a terminate is two crossed lines, and a frame is an outline around a fill of nothing - all of
 * them ask the pointer to land on a few pixels of ink, and a click a hair off lands on the canvas
 * instead and clears the selection. These add a band of slack around that ink, painted in `transparent`
 * rather than left unpainted: a transparent shape still takes pointer events, which `fill: none`,
 * `stroke: none` and `visibility: hidden` do not.
 *
 * They are drawn before the ink, so the shape itself still answers first where the two overlap, and
 * they carry no stroke or fill of their own beyond that - see `uml-hit-area` and `uml-hit-stroke`.
 */

/** How much slack a click is given around a shape's ink, in pixels on each side. */
export const HIT_SLACK = 8;

/**
 * A band of slack along the outline of a box, for a shape that is an outline around nothing.
 *
 * A frame is selected and resized by its border, and a border is one pixel wide. This widens what
 * counts as that border to `HIT_SLACK` either side of it, while leaving the inside of the frame as
 * click-through as it was - the nodes standing on a frame are drawn over it and must keep their clicks.
 */
export function hitStrokeBox(width: number, height: number, cornerRadius = 0): VNode | undefined {
    if (width <= 0 || height <= 0) {
        return undefined;
    }

    return (<rect class-uml-hit-stroke={true} x={0} y={0} rx={cornerRadius} ry={cornerRadius} width={width} height={height} />) as any;
}

/** The same band of slack along an outline given as a polygon - the sloped sides of a diamond. */
export function hitStrokePolygon(points: string): VNode {
    return (<polygon class-uml-hit-stroke={true} points={points} />) as any;
}

/**
 * A solid patch of slack over the whole of a shape, for one whose ink is too thin to aim at however
 * wide its outline is made - the bar of a fork, the two lines of a terminate.
 *
 * Grown by `HIT_SLACK` on every side, so a bar ten pixels thick answers to a click within twenty-six of
 * its middle rather than within five.
 */
export function hitAreaBox(width: number, height: number, cornerRadius = 0): VNode | undefined {
    if (width <= 0 || height <= 0) {
        return undefined;
    }

    return (
        <rect
            class-uml-hit-area={true}
            x={-HIT_SLACK}
            y={-HIT_SLACK}
            rx={cornerRadius}
            ry={cornerRadius}
            width={width + 2 * HIT_SLACK}
            height={height + 2 * HIT_SLACK}
        />
    ) as any;
}
