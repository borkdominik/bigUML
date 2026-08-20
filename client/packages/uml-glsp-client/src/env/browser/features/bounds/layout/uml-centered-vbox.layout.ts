/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { connectionPointPosition, parseConnectionPointId, PIN_SIZE, type PinSide, pinPosition } from '@borkdominik-biguml/uml-glsp-server';
import { type GChildElement, type GParentElement, isBoundsAware, type LayoutContainer, type StatefulLayouter } from '@eclipse-glsp/client';
import { VBoxLayouterExt, type VBoxLayoutOptionsExt } from '@eclipse-glsp/client/lib/features/bounds/vbox-layout.js';
import { Dimension, type Point } from '@eclipse-glsp/protocol';
import { injectable } from 'inversify';
import { isEqual } from 'lodash';
import { GInputPinNode, GOutputPinNode } from '../../../uml/elements/pin/index.js';

/**
 * A `vbox` that centers its stacked children vertically instead of pinning them to the top edge.
 *
 * Nodes whose size is driven by the user rather than by their content (a State the user dragged
 * larger) need this: plain `vbox` leaves the name label sitting under the top border as soon as the
 * node is taller than the label. Sprotty's `stack` layouter is the only built-in one that aligns
 * vertically, but it knows nothing about the `prefWidth`/`prefHeight` options that hold a node at
 * its persisted size - and about `LayoutAware`, which reports the content size as the smallest size
 * the node may be resized to. Extending the GLSP vbox keeps all of that and only moves the children.
 */
@injectable()
export class UmlCenteredVBoxLayouter extends VBoxLayouterExt {
    static override KIND = 'uml-centered-vbox';

    protected override layoutChildren(
        container: GParentElement & LayoutContainer,
        layouter: StatefulLayouter,
        containerOptions: VBoxLayoutOptionsExt,
        maxWidth: number,
        maxHeight: number,
        grabHeight?: number,
        grabbingChildren?: number
    ): Point {
        // A child grabbing the free vertical space already fills the container, so there is nothing
        // left to center - shifting on top of that would push it out through the bottom border.
        const childrenHeight = this.getChildrenSize(container, containerOptions, layouter).height;
        const freeHeight = grabbingChildren ? 0 : Math.max(0, maxHeight - childrenHeight);

        // The children are stacked from `paddingTop` downwards, so half of the space they leave over
        // is exactly the offset that centers the whole stack.
        return super.layoutChildren(
            container,
            layouter,
            { ...containerOptions, paddingTop: containerOptions.paddingTop + freeHeight / 2 },
            maxWidth,
            maxHeight,
            grabHeight,
            grabbingChildren
        );
    }

    /**
     * Once the box has a size, everything belonging on its boundary is put back onto it: the pins of an
     * action, and the connection point dots marking where a pin goes.
     *
     * The server places those when it builds the model, but it can only place them against the size
     * stored for the shape - and a shape sized to fit its name is not drawn at that size. A newly drawn
     * action stored as 80 wide is rendered at whatever its name needs, so anything placed against 80
     * ends up inside the shape rather than on its edge, which is what put a dot in the middle of a new
     * action. Nothing here touches a shape that has no such children, which is every other user of this
     * layout.
     *
     * Positions are set rather than drawn, so a dot is where it looks like it is: a pin dropped on it,
     * and a flow anchored to it, both find it by its bounds.
     */
    override layout(container: GParentElement & LayoutContainer, layouter: StatefulLayouter): void {
        super.layout(container, layouter);

        const bounds = layouter.getBoundsData(container).bounds;
        if (!bounds || !Dimension.isValid(bounds)) {
            return;
        }

        this.layoutConnectionPoints(container, layouter, bounds);
        this.layoutPins(container, layouter, bounds, GInputPinNode, 'input');
        this.layoutPins(container, layouter, bounds, GOutputPinNode, 'output');
    }

    /** Each dot back onto the point of the boundary its id names. */
    protected layoutConnectionPoints(container: GParentElement, layouter: StatefulLayouter, ownerSize: Dimension): void {
        for (const child of container.children) {
            const point = parseConnectionPointId(child.id)?.point;
            if (!point) {
                continue;
            }
            const position = connectionPointPosition(ownerSize, point);
            const size = this.sizeOf(child, layouter);
            this.place(child, layouter, { x: position.x - size.width / 2, y: position.y - size.height / 2 }, size);
        }
    }

    /**
     * The pins of one side, spread down it the way the server spread them - `pinPosition` is the one
     * piece of arithmetic both ends run, so a pin does not move when the diagram is laid out.
     *
     * Their order is the order the action's element built them in, which is the order they are stored
     * in, so the pin that was second from the top stays second from the top.
     */
    protected layoutPins(
        container: GParentElement,
        layouter: StatefulLayouter,
        ownerSize: Dimension,
        pinType: new (...args: any[]) => GChildElement,
        side: PinSide
    ): void {
        const pins = container.children.filter(child => child instanceof pinType);
        pins.forEach((pin, index) => this.place(pin, layouter, pinPosition(ownerSize, side, index, pins.length), PIN_SIZE));
    }

    /**
     * What the child measured, or the size it carries when the layout pass has not measured it - a dot
     * is drawn at a fixed size and may never have been. `Dimension.EMPTY` is the honest last resort: a
     * child with no size of any kind is placed at the point itself rather than offset by half of nothing.
     */
    protected sizeOf(child: GChildElement, layouter: StatefulLayouter): Dimension {
        const measured = layouter.getBoundsData(child).bounds;
        if (measured && Dimension.isValid(measured)) {
            return measured;
        }
        return isBoundsAware(child) ? child.bounds : Dimension.EMPTY;
    }

    /**
     * Written only when it actually moves the child. `UmlStatefulLayouterExt` runs the whole layout again
     * whenever a pass reports a change, and every reported change is also sent back to the server as
     * computed bounds - so a placement that reported itself changed each time it was recomputed would
     * keep both of those going round.
     */
    protected place(child: GChildElement, layouter: StatefulLayouter, position: Point, size: Dimension): void {
        const boundsData = layouter.getBoundsData(child);
        const next = { x: position.x, y: position.y, width: size.width, height: size.height };
        if (isEqual(boundsData.bounds, next)) {
            return;
        }
        boundsData.bounds = next;
        boundsData.boundsChanged = true;
    }
}
