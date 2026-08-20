/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
/** @jsx svg */
import { type BoundsAware, GCompartment, type GParentElement, hasArgs, svg } from '@eclipse-glsp/client';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import { type VNode } from 'snabbdom';

/**
 * The lines UML draws across a shape to divide it into compartments - between a class and its
 * attributes, between a state and the activities it runs.
 *
 * Drawn by the shape rather than by the compartment, because the line runs the whole width of the
 * shape and a compartment is only as wide as the room the layouter gave it. Which compartments get
 * one is the server's decision, marked with a `divider` arg (see `SectionCompartment`) - it is the
 * end that knows whether a compartment starts a new section or continues one.
 */

/** The compartments asking to be separated from whatever is drawn above them. */
function separatedCompartments(element: GParentElement): GCompartment[] {
    return element.children.filter(
        (child): child is GCompartment =>
            child instanceof GCompartment &&
            child.type !== DefaultTypes.COMPARTMENT_HEADER &&
            child.children.length > 0 &&
            hasArgs(child) &&
            child.args['divider'] === true
    );
}

/**
 * A line along the top edge of each such compartment. Meant to be drawn over the shape's background
 * and under its children, which is where the compartment's own top edge is.
 *
 * Dashed where the compartment asks for it with a `dashed` arg, which is how UML separates the regions
 * of an orthogonal state from one another - as against the solid rule that closes off a compartment of
 * a different kind, such as the first region from the name above it.
 *
 * `cornerRadius` is what the caller rounded the shape's corners by, and it has to be passed or a rule
 * near an edge runs straight out through the curve: the sides of a rounded box are not at 0 and at the
 * full width for the height of a corner. A square-cornered shape leaves it at 0 and every rule runs the
 * whole width, which is what all of them did before.
 */
export function renderCompartmentSeparators(element: GParentElement & BoundsAware, cornerRadius = 0): VNode[] {
    const width = Math.max(0, element.bounds.width);
    const height = Math.max(0, element.bounds.height);

    return separatedCompartments(element)
        .map(compartment => {
            const y = compartment.position.y;
            const inset = roundedCornerInset(cornerRadius, y, height);
            // A rule pulled in from both sides by more than half the shape has no shape left to cross.
            if (2 * inset >= width) {
                return undefined;
            }

            return (
                <path
                    class-uml-comp-separator
                    class-uml-comp-separator-dashed={hasArgs(compartment) && compartment.args['dashed'] === true}
                    d={`M ${inset},${y}  L ${width - inset},${y}`}
                ></path>
            ) as any;
        })
        .filter((node): node is VNode => node !== undefined);
}

/**
 * How far in from each side a rule at `y` has to stop to land on the outline of a box whose corners are
 * rounded by `radius`.
 *
 * Nothing at all below the corners, which is where most rules fall - a shape's sides run straight for
 * everything between them. Inside one, the outline is the corner's arc: its centre stands `radius` in
 * from the side and `radius` from the near edge, so at `d` from that edge the arc is
 * `sqrt(radius² - (radius - d)²)` from the centre, and what is left over is how far the side has moved in.
 */
function roundedCornerInset(radius: number, y: number, height: number): number {
    if (radius <= 0) {
        return 0;
    }

    // Measured against whichever edge is nearer: a rule can sit in the bottom corners as readily as in
    // the top ones - the last band of an orthogonal state is ruled off close to the foot of the box.
    const fromEdge = Math.min(y, height - y);
    if (fromEdge >= radius) {
        return 0;
    }
    if (fromEdge <= 0) {
        return radius;
    }

    const offset = radius - fromEdge;
    return radius - Math.sqrt(Math.max(0, radius * radius - offset * offset));
}
