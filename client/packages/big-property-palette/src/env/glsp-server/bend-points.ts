/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type ElementReferenceProperty, UpdateElementPropertyAction } from '@borkdominik-biguml/big-property-palette';
import type { Point } from '@eclipse-glsp/protocol';

/**
 * The bend points of an edge, as the property palette lists and edits them.
 *
 * They are layout rather than an ordinary property - stored as the edge's `routingPoints`, see
 * `DiagramModelState.getRoutingPoints` - so they are listed under an id of their own and every edit comes
 * back as one of the ids below, which
 * `GenericUpdateElementPropertyActionHandler` turns into the `ChangeRoutingPointsOperation` a drag on the
 * canvas would have sent.
 */
export const BEND_POINTS_PROPERTY_ID = 'bendPoints';

const BEND_POINT_PREFIX = 'bendPoint:';
const DELETE_PROPERTY_ID = `${BEND_POINT_PREFIX}delete`;

export type BendPointEdit = { kind: 'move'; index: number; axis: 'x' | 'y'; value: number } | { kind: 'delete'; point: Point };

/** One row per bend point, its two coordinates edited in place. */
export function bendPointReferences(edgeId: string, points: Point[]): ElementReferenceProperty.Reference[] {
    return points.map((point, index) => ({
        elementId: edgeId,
        label: `Point ${index + 1}`,
        fields: [
            { propertyId: `${BEND_POINT_PREFIX}${index}:x`, label: 'X', value: formatCoordinate(point.x) },
            { propertyId: `${BEND_POINT_PREFIX}${index}:y`, label: 'Y', value: formatCoordinate(point.y) }
        ],
        // Removed by where it is rather than by its index, so that deleting all of them at once cannot
        // remove the wrong one after an earlier removal has shifted the rest along.
        deleteActions: [
            UpdateElementPropertyAction.create({ elementId: edgeId, propertyId: DELETE_PROPERTY_ID, value: JSON.stringify(point) })
        ]
    }));
}

/** The edit a bend point property id and value stand for, or `undefined` where the value is not one - a coordinate that is not a number, say. */
export function parseBendPointEdit(propertyId: string, value: string): BendPointEdit | undefined {
    if (propertyId === DELETE_PROPERTY_ID) {
        try {
            return { kind: 'delete', point: JSON.parse(value) as Point };
        } catch {
            return undefined;
        }
    }
    const match = /^bendPoint:(\d+):(x|y)$/.exec(propertyId);
    if (!match) {
        return undefined;
    }
    const parsed = Number(value.trim());
    if (value.trim() === '' || !Number.isFinite(parsed)) {
        return undefined;
    }
    return { kind: 'move', index: Number(match[1]), axis: match[2] as 'x' | 'y', value: parsed };
}

export function isBendPointProperty(propertyId: string): boolean {
    return propertyId.startsWith(BEND_POINT_PREFIX);
}

/** The bend points after an edit, or `undefined` where the edit changes nothing. */
export function applyBendPointEdit(points: Point[], edit: BendPointEdit): Point[] | undefined {
    if (edit.kind === 'delete') {
        const index = points.findIndex(point => point.x === edit.point.x && point.y === edit.point.y);
        return index < 0 ? undefined : points.filter((_, i) => i !== index);
    }
    if (edit.index >= points.length) {
        return undefined;
    }
    return points.map((point, i) => (i === edit.index ? { ...point, [edit.axis]: edit.value } : point));
}

/** Whole pixels are what anyone places a bend point at; the fraction a drag leaves behind is noise. */
function formatCoordinate(value: number): string {
    return String(Math.round(value * 10) / 10);
}
