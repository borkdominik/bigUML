/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
/** @jsx svg */
import { GCompartment, type RenderingContext, svg } from '@eclipse-glsp/client';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import { injectable } from 'inversify';
import { type VNode } from 'snabbdom';
import { NamedElement, NamedElementView } from '../named-element/index.js';

export class GClassNode extends NamedElement {
    isAbstract: boolean = false;
}

/** The room the layouter keeps between a node's content and its border (see `VBoxLayouterExt`). */
const CONTENT_PADDING = 5;

/**
 * As much bigger as the name is ever drawn, however much room the box has to spare. Filling the box
 * outright reads as a heading rather than as the name of a class, and leaves a class whose name has
 * been scaled up next to one that has not looking like two different kinds of shape.
 */
const MAX_NAME_SCALE = 1.5;

@injectable()
export class GClassNodeView extends NamedElementView {
    /**
     * Draws the name as large as the box has room for, so that it grows along with a class the user
     * drags bigger rather than sitting in the middle of it at one fixed size.
     *
     * The size comes from a transform on the name's group rather than from a larger font, and it is
     * applied only to what is on screen - the hidden pass that measures the diagram keeps the plain
     * size. That is what stops this from feeding back on itself: the bounds the scale is computed
     * from are always the unscaled ones, so a bigger box grows the name without the bigger name then
     * growing the box.
     */
    protected override renderContent(element: NamedElement, context: RenderingContext): (VNode | undefined)[] {
        const header = element.children.find(
            (child): child is GCompartment => child instanceof GCompartment && child.type === DefaultTypes.COMPARTMENT_HEADER
        );

        if (!header || context.targetKind === 'hidden') {
            return context.renderChildren(element);
        }

        const transform = this.nameTransform(element, header);
        if (transform === undefined) {
            return context.renderChildren(element);
        }

        return element.children
            .map(child =>
                child === header ? <g transform={transform}>{context.renderElement(child)}</g> : context.renderElement(child)
            )
            .filter(vnode => vnode !== undefined);
    }

    /**
     * How the name is scaled up into the space the box has to spare, or `undefined` when the box is
     * no bigger than its content and the name is drawn as it is.
     *
     * The name takes the room it already occupies plus the empty space above the content. The space
     * below counts too when the name is the only thing in the box - where a class carries attributes
     * or operations, growing downwards would run the name into the separator line drawn above them.
     */
    protected nameTransform(element: NamedElement, header: GCompartment): string | undefined {
        const box = element.bounds;
        if (box.width <= 0 || box.height <= 0 || header.bounds.width <= 0 || header.bounds.height <= 0) {
            return undefined;
        }

        const compartments = element.children.filter(child => child !== header && child instanceof GCompartment) as GCompartment[];
        const contentBottom = compartments.reduce(
            (bottom, compartment) => Math.max(bottom, compartment.bounds.y + compartment.bounds.height),
            header.bounds.y + header.bounds.height
        );

        const roomAbove = Math.max(0, header.bounds.y - CONTENT_PADDING);
        const roomBelow = compartments.length > 0 ? 0 : Math.max(0, box.height - CONTENT_PADDING - contentBottom);
        const availableHeight = header.bounds.height + roomAbove + roomBelow;
        const availableWidth = Math.max(0, box.width - 2 * CONTENT_PADDING);

        const scale = Math.min(availableWidth / header.bounds.width, availableHeight / header.bounds.height, MAX_NAME_SCALE);
        if (scale <= 1) {
            return undefined;
        }

        // Grown about its own bottom edge where something is drawn underneath, so it takes up the
        // space above it and no more; about its middle when the box holds nothing else, so it stays
        // centered in it.
        const anchorX = header.bounds.x + header.bounds.width / 2;
        const anchorY = header.bounds.y + (compartments.length > 0 ? header.bounds.height : header.bounds.height / 2);

        return `translate(${anchorX - scale * anchorX}, ${anchorY - scale * anchorY}) scale(${scale})`;
    }
}
