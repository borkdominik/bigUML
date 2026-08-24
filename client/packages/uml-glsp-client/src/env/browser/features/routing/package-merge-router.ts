/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Bounds, getAbsoluteBounds, type GRoutableElement, Point, PolylineEdgeRouter, type RoutedPoint } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { GPackageMergeEdge } from '../../uml/elements/package-merge/index.js';
import { parallelTransitionRoute } from './parallel-transition-router.js';

/** Which side of the package being merged into the shared line runs along. */
type TrunkSide = 'above' | 'below' | 'left' | 'right';

/**
 * The router every edge is drawn with, which is GLSP's own but for the three departures below: the
 * packages merged into a package are drawn as branches off a single connector, the transitions between
 * one pair of states are spread out rather than laid on top of each other, and the line attaching a class
 * to an association is drawn to the middle of that association - the one line that ends on an edge, which
 * no stock router can anchor.
 *
 * A router of its own under a kind of its own would have been the tidier place for either, but it is
 * not the safer one: the kind is written on the edge by the server and looked up on the client, and a
 * kind that is not registered is not routed around - `EdgeRouterRegistry.get` throws on it, taking down
 * the render and every click with it. Nothing is written on the edge this way, so there is nothing for
 * the two sides to disagree about.
 */
@injectable()
export class UmlPolylineEdgeRouter extends PolylineEdgeRouter {
    override route(edge: GRoutableElement): RoutedPoint[] {
        return packageMergeRoute(edge) ?? parallelTransitionRoute(edge) ?? super.route(edge);
    }
}

/**
 * Routes the packages merged into a package as branches off a single connector, or nothing where this
 * edge is not a merge drawn that way.
 *
 * Every merge is its own relation, and left to itself each would be drawn as its own line straight
 * from one package to the other - four packages merged into a fifth as four lines converging on it.
 * UML draws that set as one connector, so each merge is instead taken out to a line the whole set
 * shares. The first of them runs along that line and into the package they are merged into, and the
 * rest end where they meet it: a connector arrives once, so one of them is what arrives and the others
 * join what it drew.
 *
 * The shared line is worked out from the whole set rather than passed between them, which is what
 * keeps it the same line for each: every merge into a package sees the same packages merged into it,
 * so every one of them puts the line in the same place - and a branch ending on it therefore ends on a
 * point the first of them runs through, rather than near one.
 */
export function packageMergeRoute(edge: GRoutableElement): RoutedPoint[] | undefined {
    const branch = mergeBranch(edge);
    if (branch === undefined) {
        return undefined;
    }

    return branch.route.map((point, index) => ({
        ...point,
        kind: index === 0 ? 'source' : index === branch.route.length - 1 ? 'target' : 'linear',
        pointIndex: index - 1
    }));
}

/**
 * Whether this merge is drawn with the arrow head at its end.
 *
 * A connector arrives once, so of the merges gathered into one it is drawn on the first alone and the
 * rest run into it. A merge that is not drawn as part of a connector - the set straddles the package
 * it merges into and there is no line to share, or this one has been routed by hand away from the
 * others - is a line in its own right, and ends in a head of its own.
 */
export function showsMergeArrow(edge: GRoutableElement): boolean {
    const branch = mergeBranch(edge);
    return branch === undefined || branch.leads;
}

/** How a merge takes its place on the connector its set shares. */
interface MergeBranch {
    /** The way it is drawn: out of the package it merges, and along the shared line as far as it goes. */
    route: Point[];
    /** Whether this is the first branch of the set, which is the one that arrives and carries the head. */
    leads: boolean;
}

/**
 * Where this merge joins the connector its set is drawn as, or nothing where it is drawn as a line of
 * its own instead.
 */
function mergeBranch(edge: GRoutableElement): MergeBranch | undefined {
    const source = edge.source;
    const target = edge.target;
    if (!(edge instanceof GPackageMergeEdge) || source === undefined || target === undefined) {
        return undefined;
    }

    const group = mergeGroup(edge);
    const merged = getAbsoluteBounds(target);
    const side = isMeasured(merged) ? trunkSide(mergingBounds(group), merged) : undefined;
    if (side === undefined) {
        // Either the packages have not been measured yet, or the one being merged into stands among
        // the ones merging into it rather than clear of them - and then there is no side of it a
        // shared line could run along that the set does not straddle. A line each.
        return undefined;
    }

    const branches = group.filter(isBranch);
    if (!isBranch(edge)) {
        return undefined;
    }

    const leads = branches[0] === edge;
    const route = trunkRoute(getAbsoluteBounds(source), merged, trunkAt(mergingBounds(group), merged, side), side, leads);

    // A branch that meets the shared line where it leaves its own package has nowhere to run, and is
    // left as a line of its own rather than as a route of one point that draws nothing and would still
    // be counted a branch by everything reading this back.
    return route.length < 2 ? undefined : { route, leads };
}

/**
 * Whether a merge of a set that has a line to share is drawn on it. One routed by hand is not: where
 * someone has said where a merge should run, that is where it runs.
 */
function isBranch(merge: GPackageMergeEdge): boolean {
    return merge.routingPoints.length === 0 && merge.source !== undefined && isMeasured(getAbsoluteBounds(merge.source));
}

/**
 * The merges into the same package as this one, in the order the diagram holds them - so that they
 * agree on which of them comes first however many times they are drawn.
 */
function mergeGroup(edge: GPackageMergeEdge): GPackageMergeEdge[] {
    return edge.parent.children.filter(
        (child): child is GPackageMergeEdge => child instanceof GPackageMergeEdge && child.targetId === edge.targetId
    );
}

/**
 * Where the line the set shares runs, in the axis it is measured on: halfway between the package
 * being merged into and the nearest of the packages merging into it. Halfway rather than a set
 * distance off either, which would put the line the wrong side of one of them as soon as the two were
 * closer together than that.
 */
function trunkAt(merging: Bounds, merged: Bounds, side: TrunkSide): number {
    switch (side) {
        case 'above':
            return (bottom(merging) + merged.y) / 2;
        case 'below':
            return (merging.y + bottom(merged)) / 2;
        case 'left':
            return (right(merging) + merged.x) / 2;
        case 'right':
            return (merging.x + right(merged)) / 2;
    }
}

/** What the packages merged into the same one take up between them. */
function mergingBounds(group: GPackageMergeEdge[]): Bounds {
    let merging: Bounds | undefined;
    for (const merge of group) {
        if (merge.source !== undefined) {
            const bounds = getAbsoluteBounds(merge.source);
            merging = merging === undefined ? bounds : Bounds.combine(merging, bounds);
        }
    }
    return merging ?? Bounds.EMPTY;
}

/**
 * The side of the package being merged into that the whole set is on, or nothing where the set is
 * spread around it and no one side would do.
 */
function trunkSide(merging: Bounds, merged: Bounds): TrunkSide | undefined {
    if (bottom(merging) <= merged.y) {
        return 'above';
    }
    if (merging.y >= bottom(merged)) {
        return 'below';
    }
    if (right(merging) <= merged.x) {
        return 'left';
    }
    return merging.x >= right(merged) ? 'right' : undefined;
}

/**
 * One merge's way onto the shared line and along it: out of the package it merges, straight to the
 * line, and along the line to where the set arrives.
 *
 * The merge that leads the set runs the last of it too, off the line and into the package they are
 * merged into. The others stop on the line, because that arrival is one line and not one apiece: drawn
 * by each of them it would be laid down as many times as there are merges, a stroke that lights up
 * under the pointer as one merge while another is on top of it, and that a click lands on whichever of
 * them happens to be drawn last.
 */
function trunkRoute(merging: Bounds, merged: Bounds, trunk: number, side: TrunkSide, leads: boolean): Point[] {
    if (side === 'above' || side === 'below') {
        const from = { x: merging.x + merging.width / 2, y: side === 'above' ? bottom(merging) : merging.y };
        const to = { x: merged.x + merged.width / 2, y: side === 'above' ? merged.y : bottom(merged) };
        return withoutRepeats([from, { x: from.x, y: trunk }, { x: to.x, y: trunk }, ...(leads ? [to] : [])]);
    }

    const from = { x: side === 'left' ? right(merging) : merging.x, y: merging.y + merging.height / 2 };
    const to = { x: side === 'left' ? merged.x : right(merged), y: merged.y + merged.height / 2 };
    return withoutRepeats([from, { x: trunk, y: from.y }, { x: trunk, y: to.y }, ...(leads ? [to] : [])]);
}

/**
 * Where a package sits straight across from the one it merges into, its way onto the shared line and
 * its way along it are the same point. Left in, that would be a segment of no length for anything
 * reading a position off the route to divide by.
 */
function withoutRepeats(points: Point[]): Point[] {
    return points.filter((point, index) => index === 0 || !Point.equals(point, points[index - 1]));
}

/** A package that has not been measured yet cannot be lined up against anything. */
function isMeasured(bounds: Bounds): boolean {
    return bounds.width >= 0 && bounds.height >= 0;
}

function bottom(bounds: Bounds): number {
    return bounds.y + bounds.height;
}

function right(bounds: Bounds): number {
    return bounds.x + bounds.width;
}
