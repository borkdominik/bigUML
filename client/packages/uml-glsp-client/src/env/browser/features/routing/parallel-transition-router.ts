/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { type Bounds, getAbsoluteBounds, GNode, type GRoutableElement, type Point, type RoutedPoint } from '@eclipse-glsp/client';
import { GTransitionEdge } from '../../uml/elements/transition/index.js';

/**
 * Draws the transitions between one pair of states side by side rather than one on top of the other.
 *
 * Two states are rarely joined by a single transition - one goes there and another comes back - and each
 * is its own relation, routed on its own between the same two shapes. Left to themselves they take the
 * same line: one hides the other, the pointer picks up whichever happens to be drawn last, and the two
 * labels are written over each other. UML draws them as what they are, two transitions, so they are
 * spread either side of the line they would otherwise share.
 *
 * The spread is worked out from the whole set rather than passed between them, which is what keeps every
 * member of a pair off every other: each transition sees the same set in the same order, so each takes a
 * different place in it, and the two of an opposite-facing pair do not both offset themselves the same
 * way. That is also why the offset is measured along a perpendicular of the pair's own axis rather than
 * of the way this transition happens to run - the axis is the same for both, the direction of travel is
 * not.
 */

/** How far apart two transitions between the same pair of shapes run, at most. */
const SPREAD = 24;

/**
 * How much of the shorter of the two sides the whole set may take up. A transition has to arrive on the
 * shape it ends at, so a set spread wider than the side it arrives on would take the outer ones off it -
 * past the corner for a state, off the shape altogether for a diamond or a bar.
 */
const MAX_SHARE_OF_SIDE = 0.7;

export function parallelTransitionRoute(edge: GRoutableElement): RoutedPoint[] | undefined {
    const spread = spreadRoute(edge);
    if (spread === undefined) {
        return undefined;
    }

    return [
        { ...spread.from, kind: 'source', pointIndex: -1 },
        { ...spread.to, kind: 'target', pointIndex: 0 }
    ];
}

/** Where this transition runs once the set it belongs to is spread out, or nothing where it is not one. */
function spreadRoute(edge: GRoutableElement): { from: Point; to: Point } | undefined {
    if (!(edge instanceof GTransitionEdge) || !isSpreadable(edge)) {
        return undefined;
    }

    const set = spreadSet(edge);
    const place = set.indexOf(edge);
    if (set.length < 2 || place < 0) {
        return undefined;
    }

    const from = getAbsoluteBounds(edge.source!);
    const to = getAbsoluteBounds(edge.target!);
    if (!isMeasured(from) || !isMeasured(to)) {
        return undefined;
    }

    // The pair's own axis, taken from the end named first to the end named second so that both
    // transitions of a facing pair measure their offset off the same perpendicular. Which way this one
    // travels is settled separately, below.
    const forwards = edge.sourceId < edge.targetId;
    const axis = direction(centre(forwards ? from : to), centre(forwards ? to : from));
    if (axis === undefined) {
        // The two shapes are drawn on top of one another and there is no line between their centres to
        // spread either side of.
        return undefined;
    }
    const across = { x: -axis.y, y: axis.x };

    const spacing = Math.min(SPREAD, (MAX_SHARE_OF_SIDE * Math.min(extent(from, across), extent(to, across))) / (set.length - 1));
    const offset = (place - (set.length - 1) / 2) * spacing;
    const shift = { x: across.x * offset, y: across.y * offset };

    const travel = forwards ? axis : { x: -axis.x, y: -axis.y };
    const start = leaves(from, add(centre(from), shift), travel);
    const end = leaves(to, add(centre(to), shift), { x: -travel.x, y: -travel.y });
    return start && end ? { from: start, to: end } : undefined;
}

/**
 * Whether this transition is one that may be moved off the line between its two shapes.
 *
 * A transition routed by hand is not: where someone has said where it should run, that is where it runs.
 * Neither is one that ends on a named connection point - a tip of a choice diamond - which is a place on
 * the shape and not a side of it: the line has to arrive on the point, so it cannot be offset from it.
 * And a transition from a state back to itself is drawn as a loop rather than as a line between two
 * shapes, so it has no line to be spread off.
 */
function isSpreadable(edge: GTransitionEdge): boolean {
    return (
        edge.routingPoints.length === 0 &&
        edge.source !== undefined &&
        edge.target !== undefined &&
        edge.source !== edge.target &&
        edge.source instanceof GNode &&
        edge.target instanceof GNode
    );
}

/**
 * The transitions drawn between the same two shapes as this one, in the order the diagram holds them -
 * so that they agree on which of them comes first however many times they are drawn. Which way round
 * each runs makes no difference: what they share is a line between two shapes, and both directions of
 * travel lie on it.
 */
function spreadSet(edge: GTransitionEdge): GTransitionEdge[] {
    return edge.parent.children.filter(
        (child): child is GTransitionEdge => child instanceof GTransitionEdge && isSpreadable(child) && joinsSamePair(child, edge)
    );
}

function joinsSamePair(one: GTransitionEdge, other: GTransitionEdge): boolean {
    return (
        (one.sourceId === other.sourceId && one.targetId === other.targetId) ||
        (one.sourceId === other.targetId && one.targetId === other.sourceId)
    );
}

/**
 * Where a line leaves a shape: from a point inside it, in the direction given, out to the border. The
 * point is the shape's centre moved across by the offset, so the line leaves the side it would have
 * left anyway, only further along it.
 */
function leaves(bounds: Bounds, origin: Point, towards: Point): Point | undefined {
    const toVertical =
        towards.x > 0 ? (right(bounds) - origin.x) / towards.x : towards.x < 0 ? (bounds.x - origin.x) / towards.x : undefined;
    const toHorizontal =
        towards.y > 0 ? (bottom(bounds) - origin.y) / towards.y : towards.y < 0 ? (bounds.y - origin.y) / towards.y : undefined;

    // Whichever border is reached first, and only where the offset point is still inside the shape -
    // outside it there is no side to leave from, and the line would start beyond the shape it comes out
    // of. `MAX_SHARE_OF_SIDE` is what keeps that from happening; this is what catches it if it does.
    const reach = Math.min(toVertical ?? Infinity, toHorizontal ?? Infinity);
    return Number.isFinite(reach) && reach > 0 ? add(origin, { x: towards.x * reach, y: towards.y * reach }) : undefined;
}

/** The unit vector from one point to another, or nothing where the two are the same point. */
function direction(from: Point, to: Point): Point | undefined {
    const span = { x: to.x - from.x, y: to.y - from.y };
    const length = Math.hypot(span.x, span.y);
    return length > 0 ? { x: span.x / length, y: span.y / length } : undefined;
}

/** How far a shape reaches along the given unit vector, from one border to the other. */
function extent(bounds: Bounds, along: Point): number {
    return Math.abs(along.x) * bounds.width + Math.abs(along.y) * bounds.height;
}

function centre(bounds: Bounds): Point {
    return { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
}

function add(point: Point, offset: Point): Point {
    return { x: point.x + offset.x, y: point.y + offset.y };
}

function isMeasured(bounds: Bounds): boolean {
    return bounds.width > 0 && bounds.height > 0;
}

function bottom(bounds: Bounds): number {
    return bounds.y + bounds.height;
}

function right(bounds: Bounds): number {
    return bounds.x + bounds.width;
}
