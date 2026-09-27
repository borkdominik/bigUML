/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { Language } from '@borkdominik-biguml/uml-language-tooling';

export abstract class Element {}

/** Where a node is drawn and how large, in diagram coordinates. */
@Language.value
export class Bounds {
    x: number;
    y: number;
    width: number;
    height: number;
}

/** One bend point of an edge. */
@Language.value
export class Point {
    x: number;
    y: number;
}

export abstract class ElementWithSizeAndPosition extends Element {
    bounds?: Bounds;
}

export abstract class Node extends ElementWithSizeAndPosition {}

export abstract class Edge extends Element {
    /** The bend points of the edge, from the source end on. */
    routingPoints?: Array<Point>;
}

export abstract class Unbounded extends Element {}

/** `NONE` leaves the visibility unspecified — no symbol is rendered for the element. */
export type Visibility = 'PUBLIC' | 'PRIVATE' | 'PROTECTED' | 'PACKAGE' | 'NONE';
