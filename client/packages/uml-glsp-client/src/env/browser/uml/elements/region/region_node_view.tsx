/********************************************************************************
 * Copyright (c) 2021 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
/** @jsx svg */
import { RectangularNodeView, type RenderingContext, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { type VNode } from 'snabbdom';
import { hitStrokeBox } from '../../views/hit-area.js';
import { type NamedElement } from '../named-element/index.js';

/**
 * A region of a state machine or a composite state: the area its states are drawn on.
 *
 * Drawn the way UML draws the composite state a region divides - a rounded box with its name written
 * across the top, and nothing else inside it: the whole of the box below the name is the area the
 * states sit on, undivided. Not the corner tag the frames around it use: a tag names a boundary, and
 * what is wanted here is a titled box.
 *
 * The box stays unfilled. A region is something other nodes are drawn on rather than a shape of its
 * own, so a fill would swallow every click inside its bounds - the states standing on it are flat
 * siblings of the diagram, not children of this element.
 */

/**
 * How far the corners are taken off. A flat number rather than a proportion of the shape, the way the
 * activity frame takes its own: a proportion suits a box drawn to the size of its name, but a region is
 * hundreds of pixels across, and a fifth of that is a corner so round the shape stops reading as a box.
 */
const REGION_CORNER_RADIUS = 20;

@injectable()
export class RegionNodeView extends RectangularNodeView {
    override render(element: NamedElement, context: RenderingContext): VNode | undefined {
        if (!this.isVisible(element, context)) {
            return undefined;
        }

        const width = Math.max(0, element.bounds.width);
        const height = Math.max(0, element.bounds.height);
        const radius = Math.min(REGION_CORNER_RADIUS, Math.min(width, height) / 2);

        return (
            <g class-selected={element.selected} class-mouseover={element.hoverFeedback}>
                {/* The region is unfilled, so its border is the whole of what can be aimed at. */}
                {hitStrokeBox(width, height, radius)}
                <rect x={0} y={0} rx={radius} ry={radius} width={width} height={height} class-uml-node-background />
                {context.renderChildren(element)}
            </g>
        ) as any;
    }
}
