/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import {
    CommonModelTypes,
    type ConnectionPointLayout,
    connectionPointId,
    connectionPointPosition,
    offeredConnectionPoints
} from '@borkdominik-biguml/uml-glsp-server';
import { GPortElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { Dimension } from '@eclipse-glsp/protocol';
import type { GModelElement } from '@eclipse-glsp/server';

/**
 * Hit area of a connection point. Bigger than the dot the client draws, because the thing being aimed
 * at is a point and a point cannot be clicked - a target this size can be, without the four of them
 * meeting in the middle of a diamond at its smallest.
 */
const CONNECTION_POINT_EXTENT = 10;

/**
 * A port on each point the shape offers, centred on it, so an edge pinned to one meets the shape
 * exactly there. Shared by the two shapes that have named points - the choice diamond and the
 * fork/join bar - which differ only in how many points they offer, not in what a point is.
 */
export function connectionPorts(ownerId: string, size: Dimension, layout: ConnectionPointLayout): GModelElement[] {
    return offeredConnectionPoints(layout, size).map(point => {
        const { x, y } = connectionPointPosition(size, point);
        return (
            <GPortElement
                id={connectionPointId(ownerId, point)}
                type={CommonModelTypes.CONNECTION_POINT}
                position={{ x: x - CONNECTION_POINT_EXTENT / 2, y: y - CONNECTION_POINT_EXTENT / 2 }}
                size={{ width: CONNECTION_POINT_EXTENT, height: CONNECTION_POINT_EXTENT }}
                cssClasses={['uml-connection-point']}
            />
        );
    });
}
