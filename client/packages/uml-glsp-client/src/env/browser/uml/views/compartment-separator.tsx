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
 */
export function renderCompartmentSeparators(element: GParentElement & BoundsAware): VNode[] {
    const width = Math.max(0, element.bounds.width);
    return separatedCompartments(element).map(
        compartment =>
            (
                <path
                    class-uml-comp-separator
                    class-uml-comp-separator-dashed={hasArgs(compartment) && compartment.args['dashed'] === true}
                    d={`M 0,${compartment.position.y}  L ${width},${compartment.position.y}`}
                ></path>
            ) as any
    );
}
