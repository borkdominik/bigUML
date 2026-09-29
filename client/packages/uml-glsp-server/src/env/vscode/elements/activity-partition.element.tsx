/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { CommonModelTypes } from '@borkdominik-biguml/uml-glsp-server';
import { GCompartmentElement, GNodeElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { ActivityPartition } from '@borkdominik-biguml/uml-model-server/grammar';
import type { Dimension } from '@eclipse-glsp/protocol';
import type { GModelElement } from '@eclipse-glsp/server';
import { nodeSize } from '../geometry/node-size.js';
import { type BaseElementProps, type ElementContext, renderContents } from './core/element-context.js';
import { FreeformCompartment } from './core/index.js';

export interface GActivityPartitionNodeElementProps extends BaseElementProps {
    node: ActivityPartition;
    /** What stands in each lane, by the lane's id - or, for a partition without lanes, by its own. */
    laneContents?: Map<string, GModelElement[] | undefined>;
}

/** The smallest a swimlane is ever drawn or dragged to: still wide enough to write a name in each lane. */
const MIN_PARTITION_SIZE: Dimension = { width: 200, height: 60 };

/**
 * How deep the band holding a lane's name is, measured in from the lane's leading edge. The view draws
 * the name in it (see `GActivityPartitionNodeView`); the lane keeps what stands in it out of the band.
 */
const NAME_BAND_DEPTH = 32;

/** The least a lane is drawn at along the partition. What the partition has beyond that is shared equally. */
const MIN_LANE_EXTENT = 30;

/**
 * Stored `bounds` can carry no usable dimensions - a zero width or height, say -
 * which a plain `?? default` would accept - and a lane written before it was laid out as one still carries
 * label-sized bounds. Only positive dimensions count as a size someone chose.
 */
function laneSize(size: BaseElementProps['size']): Dimension {
    const drawn = nodeSize('ActivityPartition', size);
    return { width: Math.max(drawn.width, MIN_PARTITION_SIZE.width), height: Math.max(drawn.height, MIN_PARTITION_SIZE.height) };
}

/** The id of the one lane a partition without lanes of its own is drawn as. */
export function ownLaneId(partitionId: string): string {
    return partitionId + '_lane';
}

interface LaneProps {
    id: string;
    type: string;
    vertical: boolean;
    /** How far across the lanes the partition runs - what every lane is as wide (or as tall) as. */
    across: number;
    name: string;
    contents?: GModelElement[];
}

/**
 * One lane: the band a subpartition is drawn as, carrying its id - so a node dropped on it goes into that
 * lane, and it is what the nodes in the lane are drawn inside. The lanes share the partition between them
 * and each grows to hold what stands in it, which grows the partition with it.
 */
function Lane(props: LaneProps): GModelElement {
    return (
        <GCompartmentElement
            id={props.id}
            type={props.type}
            layout='vbox'
            // The name, read by the view, which writes it in the band it keeps free along the leading edge.
            args={{ name: props.name }}
            layoutOptions={{
                hAlign: 'left',
                paddingTop: props.vertical ? NAME_BAND_DEPTH : 0,
                paddingLeft: props.vertical ? 0 : NAME_BAND_DEPTH,
                paddingBottom: 0,
                paddingRight: 0,
                hGrab: true,
                vGrab: true,
                // Across the partition in full, and along it at a floor the lanes share out the rest over.
                // The full extent across is asked for rather than grabbed: GLSP lays out no box that asks for
                // no room of its own, and an empty lane has nothing in it to measure - a lane asking for
                // nothing across was never placed at all, and every lane was drawn at the partition's corner.
                prefWidth: props.vertical ? MIN_LANE_EXTENT : props.across,
                prefHeight: props.vertical ? props.across : MIN_LANE_EXTENT
            }}
        >
            {/* Even when empty, so that the first node dropped in the lane is placed where it is drawn. */}
            <FreeformCompartment ownerId={props.id}>{props.contents ?? []}</FreeformCompartment>
        </GCompartmentElement>
    );
}

export function GActivityPartitionNodeElement(props: GActivityPartitionNodeElementProps): GModelElement {
    const size = laneSize(props.size);
    const vertical = props.node.orientation === 'VERTICAL';
    const subpartitions = props.node.subpartitions ?? [];

    // A partition with no lanes of its own is drawn as one lane, carrying its own name and its own nodes.
    const lanes =
        subpartitions.length > 0
            ? subpartitions.map(lane => (
                  <Lane
                      id={lane.__id}
                      type={CommonModelTypes.COMP_PARTITION_LANE}
                      vertical={vertical}
                      across={vertical ? size.height : size.width}
                      name={lane.name ?? ''}
                      contents={props.laneContents?.get(lane.__id)}
                  />
              ))
            : [
                  <Lane
                      id={ownLaneId(props.node.__id)}
                      type={CommonModelTypes.COMP_PARTITION_LANE}
                      vertical={vertical}
                      across={vertical ? size.height : size.width}
                      name={props.node.name ?? ''}
                      contents={props.laneContents?.get(props.node.__id)}
                  />
              ];

    return (
        <GNodeElement
            id={props.node.__id}
            type={props.type}
            position={props.position}
            size={size}
            cssClasses={['uml-node', 'uml-activity-partition-node']}
            // The lanes stacked, or stood side by side, and held at the partition's size - which grows to
            // hold them. The view draws the rules between them and their names from where they end up.
            layout={vertical ? 'hbox' : 'vbox'}
            layoutOptions={{
                hAlign: 'left',
                vAlign: 'top',
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 0,
                paddingRight: 0,
                vGap: 0,
                hGap: 0,
                prefWidth: size.width,
                prefHeight: size.height
            }}
            // Which way the lanes run. Flipped from the property palette - see `PartitionOrientation`.
            args={{ vertical }}
        >
            {lanes}
        </GNodeElement>
    );
}

export function createActivityPartitionElement(ctx: ElementContext<ActivityPartition>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);
    const laneContents = new Map<string, GModelElement[] | undefined>();
    const subpartitions = ctx.node.subpartitions ?? [];
    if (subpartitions.length > 0) {
        subpartitions.forEach(lane => laneContents.set(lane.__id, renderContents(ctx, lane.nodes)));
    } else {
        laneContents.set(ctx.node.__id, renderContents(ctx, ctx.node.nodes));
    }
    return (
        <GActivityPartitionNodeElement node={ctx.node} position={position} size={size} type={ctx.elementType} laneContents={laneContents} />
    );
}
