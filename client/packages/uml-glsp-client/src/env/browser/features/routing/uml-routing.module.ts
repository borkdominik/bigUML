/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { bindAsService, bindOrRebind, FeatureModule, PolylineEdgeRouter, routingModule, TYPES } from '@eclipse-glsp/client';
import { UmlPolylineEdgeRouter } from './package-merge-router.js';
import { UmlManhattanBarAnchor, UmlPolylineBarAnchor } from './uml-bar-anchor.js';
import { UmlManhattanCenterAnchor, UmlPolylineCenterAnchor } from './uml-center-anchor.js';
import { UmlManhattanDiamondTipAnchor, UmlPolylineDiamondTipAnchor } from './uml-diamond-tip-anchor.js';

/**
 * The anchors UML needs on top of the stock ones. GLSP registers a rectangular, an elliptic and a
 * diamond anchor per router; those put an edge anywhere on a shape's outline, which is not how UML
 * draws the two shapes that have named connection points - the branch diamond and the fork/join bar.
 *
 * And the stock polyline router stands aside for one that draws the packages merged into a package as
 * branches off a single connector rather than as a line each, and spreads the transitions between one
 * pair of states out instead of laying them one on top of the other - see `UmlPolylineEdgeRouter`. Taken in
 * place of the router rather than added beside it under a kind of its own: a router kind is written on
 * the edge by the server, and a client that did not know the kind would not route the edge, it would
 * throw on it.
 */
export const umlRoutingModule = new FeatureModule(
    (bind, unbind, isBound, rebind) => {
        const context = { bind, unbind, isBound, rebind };
        bindOrRebind(context, PolylineEdgeRouter).to(UmlPolylineEdgeRouter).inSingletonScope();
        bindAsService(context, TYPES.IAnchorComputer, UmlPolylineBarAnchor);
        bindAsService(context, TYPES.IAnchorComputer, UmlManhattanBarAnchor);
        bindAsService(context, TYPES.IAnchorComputer, UmlPolylineDiamondTipAnchor);
        bindAsService(context, TYPES.IAnchorComputer, UmlManhattanDiamondTipAnchor);
        bindAsService(context, TYPES.IAnchorComputer, UmlPolylineCenterAnchor);
        bindAsService(context, TYPES.IAnchorComputer, UmlManhattanCenterAnchor);
    },
    { requires: routingModule }
);
