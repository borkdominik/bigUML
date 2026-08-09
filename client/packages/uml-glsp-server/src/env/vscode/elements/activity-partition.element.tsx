/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { GNodeElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { ActivityPartition } from '@borkdominik-biguml/uml-model-server/grammar';
import type { Dimension } from '@eclipse-glsp/protocol';
import type { GModelElement } from '@eclipse-glsp/server';
import type { BaseElementProps, ElementContext } from './core/element-context.js';

export interface GActivityPartitionNodeElementProps extends BaseElementProps {
    node: ActivityPartition;
}

/**
 * A partition is a swimlane - the band its actions are drawn along - so it opens wide and shallow rather
 * than at the size of its own name, with room for the two lanes it is created holding.
 */
const DEFAULT_PARTITION_SIZE: Dimension = { width: 600, height: 300 };

/** The smallest a swimlane is ever drawn or dragged to: still wide enough to write a name in each lane. */
const MIN_PARTITION_SIZE: Dimension = { width: 200, height: 60 };

/**
 * A `Size` metaInfo can exist while carrying no usable dimensions (see `GenericChangeBoundsOperationHandler`),
 * which a plain `?? default` would accept - and a lane written before it was laid out as one still carries
 * label-sized bounds. Only positive dimensions count as a size someone chose.
 */
function laneSize(size: BaseElementProps['size']): Dimension {
    if (!size?.width || !size?.height || size.width <= 0 || size.height <= 0) {
        return DEFAULT_PARTITION_SIZE;
    }
    return {
        width: Math.max(size.width, MIN_PARTITION_SIZE.width),
        height: Math.max(size.height, MIN_PARTITION_SIZE.height)
    };
}

export function GActivityPartitionNodeElement(props: GActivityPartitionNodeElementProps): GModelElement {
    // The lanes, handed to the view one argument each. A partition is one shape holding its bands rather
    // than a pile of shapes kept touching, so the bands are drawn by the view rather than being elements
    // of their own - which is also what stops them being dragged apart. A partition with no lanes of its
    // own is still drawn as one band, carrying its own name.
    const lanes = (props.node.subpartitions ?? []).map(lane => lane.name ?? '');
    const laneArgs: Record<string, string> = {};
    (lanes.length > 0 ? lanes : [props.node.name ?? '']).forEach((name, index) => {
        laneArgs[`lane${index}`] = name;
    });

    return (
        <GNodeElement
            id={props.node.__id}
            type={props.type}
            position={props.position}
            size={laneSize(props.size)}
            cssClasses={['uml-node', 'uml-activity-partition-node']}
            // No layout and no label child. UML writes a lane's name turned on its side in the band down
            // its leading edge, and a label placed by a layouter cannot be turned - so the view draws the
            // names itself and reads them from here. Without a layout the node also keeps the size it is
            // given rather than being resized around its content.
            args={{
                laneCount: Math.max(1, lanes.length),
                // Which way the lanes run. Flipped from the property palette - see `PartitionOrientation`.
                vertical: props.node.orientation === 'VERTICAL',
                ...laneArgs
            }}
        />
    );
}

export function createActivityPartitionElement(ctx: ElementContext<ActivityPartition>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);
    return <GActivityPartitionNodeElement node={ctx.node} position={position} size={size} type={ctx.elementType} />;
}
