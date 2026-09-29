/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { connectableFeature, GEdge, GEdgeView, type GRoutableElement, type RenderingContext } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { type Classes } from 'snabbdom';
import { showsMergeArrow } from '../../../features/routing/package-merge-router.js';

/**
 * A package merge, and somewhere another merge can be dropped.
 *
 * The merges into one package are drawn as a single connector (see `packageMergeRoute`), so that
 * connector is what a further package is added to: a merge dropped on it joins the set rather than
 * being drawn as a line of its own. A connector is not an element the model knows about, so what the
 * end means is the package the connector runs into, which is what the server reads it back to - the
 * model only ever holds merges running between two packages.
 */
export class GPackageMergeEdge extends GEdge {
    static override readonly DEFAULT_FEATURES = [...GEdge.DEFAULT_FEATURES, connectableFeature];

    /**
     * Only to another merge, and at either end of it: a connector is where a package is added to the
     * set, and which of the two was clicked first says nothing about that - one is the package being
     * gathered and the other is the set gathering it, whichever order they were picked in. Nothing
     * else belongs on a connector at all.
     *
     * Asked of the type and not of the class, because the merge being drawn is not an edge of this
     * class yet: the creation tool asks on behalf of a bare `GEdge` it builds itself, carrying the type
     * it is about to create and nothing else. An instance check is false for every one of those, which
     * is a connector that cannot be aimed at at all - the click lands on nothing and is dropped.
     */
    canConnect(routable: GRoutableElement, _role: 'source' | 'target'): boolean {
        return routable.type === this.type;
    }
}

/**
 * Draws the arrow head on the merge that ends the connector, and leaves the branches running into it
 * bare.
 *
 * The head is decided here rather than written on the edge by the server, because whether a merge is a
 * branch of a connector or a line in its own right is a question of how it came to be drawn - which
 * only the router that drew it can answer.
 */
@injectable()
export class GPackageMergeEdgeView extends GEdgeView {
    protected override additionalClasses(edge: Readonly<GEdge>, _context: RenderingContext): Classes {
        // Named as the view spreads it, beside its own `class-sprotty-edge`: the prefix is what puts it
        // on the element as a class rather than as an attribute of that name.
        return { 'class-marker-tent-end': showsMergeArrow(edge) };
    }
}
