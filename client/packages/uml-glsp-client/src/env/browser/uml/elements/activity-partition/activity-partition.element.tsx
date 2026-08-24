/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
/** @jsx svg */
import { type GNode, RectangularNodeView, type RenderingContext, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { type VNode } from 'snabbdom';
import { NamedElement } from '../named-element/named-element.view.js';

export class GActivityPartitionNode extends NamedElement {}

/** How deep the band holding a lane's name is, measured in from the lane's leading edge. */
const NAME_BAND_DEPTH = 32;

/**
 * A partition drawn as UML draws it: a swimlane. One shape holding its lanes, squared off rather than
 * rounded, each lane carrying a band with its name in it and a rule separating that band from the part
 * the actions are drawn on.
 *
 * The lanes are drawn here rather than added as children, because a lane is part of what the shape is:
 * drawn, they cannot be dragged apart, selected away from the partition, or left behind when it moves.
 * Their names and which way they run are read off `args`, which the server fills from the partition.
 *
 * Flipped, the same lanes stand beside one another as columns instead of stacking as rows, and their
 * names are written straight along the top rather than turned on their side - the notation writes a
 * vertical lane's name the way it writes any other.
 */
@injectable()
export class GActivityPartitionNodeView extends RectangularNodeView {
    override render(element: Readonly<GNode>, context: RenderingContext): VNode | undefined {
        if (!this.isVisible(element, context)) {
            return undefined;
        }

        const width = Math.max(0, element.bounds.width);
        const height = Math.max(0, element.bounds.height);
        const args = (element as unknown as { args?: Record<string, unknown> }).args ?? {};
        const vertical = args['vertical'] === true;
        const laneCount = Math.max(1, Number(args['laneCount'] ?? 1));

        // Along the lanes: down the block when they stack, across it when they stand side by side.
        const laneExtent = (vertical ? width : height) / laneCount;
        // Never deeper than the lane it is measured into, so a block dragged small keeps a band that
        // still fits: across the lanes when they stack, down them when they stand side by side.
        const bandDepth = Math.min(NAME_BAND_DEPTH, vertical ? height : width);

        const lanes = [];
        for (let lane = 0; lane < laneCount; lane++) {
            const offset = lane * laneExtent;
            const name = String(args[`lane${lane}`] ?? '');

            if (lane > 0) {
                // The rule between one lane and the next. The outer rectangle draws the two ends.
                lanes.push(
                    <path
                        class-uml-comp-separator={true}
                        d={vertical ? `M ${offset},0 L ${offset},${height}` : `M 0,${offset} L ${width},${offset}`}
                    />
                );
            }

            // The rule closing the name band off from the part the actions are drawn on.
            lanes.push(
                <path
                    class-uml-comp-separator={true}
                    d={
                        vertical
                            ? `M ${offset},${bandDepth} L ${offset + laneExtent},${bandDepth}`
                            : `M ${bandDepth},${offset} L ${bandDepth},${offset + laneExtent}`
                    }
                />
            );

            /*
             * Centred on the middle of its band, which `text-anchor` and `dominant-baseline` (see the
             * stylesheet) put the middle of the text on - so it lands centred whatever the name is and
             * however the block is dragged. A stacked lane's name is turned a quarter anticlockwise, read
             * from the bottom up, which is how UML writes one.
             */
            const centre = vertical
                ? { x: offset + laneExtent / 2, y: bandDepth / 2 }
                : { x: bandDepth / 2, y: offset + laneExtent / 2 };
            lanes.push(
                <text
                    class-uml-partition-name={true}
                    transform={`translate(${centre.x}, ${centre.y})${vertical ? '' : ' rotate(-90)'}`}
                >
                    {name}
                </text>
            );
        }

        return (
            <g class-selected={element.selected} class-mouseover={element.hoverFeedback}>
                {/*
                 * Drawn for the area alone, not for the outline: it is what answers a click anywhere in
                 * the block, while the border is the path below. A rectangle cannot be left open at one
                 * end, and that is the difference between the two.
                 */}
                <rect x={0} y={0} width={width} height={height} class-uml-node-background />
                {/*
                 * Closed on the three sides the lanes are bounded by, and open at the end they run out
                 * of - which is whichever way they run. Stacked, they are written from the left and run
                 * off to the right; stood beside one another, they are written from the top and run off
                 * the bottom. The open end is always the one the flow inside the lanes travels towards.
                 */}
                <path
                    class-uml-partition-outline={true}
                    d={
                        vertical
                            ? `M 0,${height} L 0,0 L ${width},0 L ${width},${height}`
                            : `M ${width},0 L 0,0 L 0,${height} L ${width},${height}`
                    }
                />
                {lanes}
                {context.renderChildren(element)}
            </g>
        ) as any;
    }
}
