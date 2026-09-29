/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Glsp } from '@borkdominik-biguml/uml-glsp-server/generator';
import { Language } from '@borkdominik-biguml/uml-language-tooling';
import 'reflect-metadata';
import { type Edge, Node } from '../core/element.def.js';

// @ts-nocheck

/**
 * The point on an edge that another edge is attached to - an association drawn to the middle of another
 * association, say.
 *
 * A relation can only end on a node, so an edge ending on an edge ends on this: a node standing for a point
 * on the edge it names. It is never drawn itself. A relation ending on it is routed to the dot every edge
 * offers at its centre instead, which is where the anchor is for now; where along the edge it sits could
 * become a property of its own later.
 *
 * Created with the relation that ends on it and deleted with the edge it is on, so nobody places one.
 */
@Glsp.floating
@Glsp.defaultSize({ width: 1, height: 1 })
export class EdgeAnchor extends Node {
    @Language.reference edge: Edge;
}
