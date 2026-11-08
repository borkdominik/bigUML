/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
/** @jsxImportSource @borkdominik-biguml/uml-glsp-client/jsx */
import {
    GChildElement,
    type GModelElement,
    type GParentElement,
    type IView,
    isBoundsAware,
    type RenderingContext
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { type VNode } from 'snabbdom';

/** The side of a shape an arrow stands at. */
export type RelationHandleSide = 'top' | 'right' | 'bottom' | 'left';

const SIDES: readonly RelationHandleSide[] = ['top', 'right', 'bottom', 'left'];

/** Which way an arrow points, as a rotation of one pointing up. */
const ROTATION: Record<RelationHandleSide, number> = { top: 0, right: 90, bottom: 180, left: 270 };

/** How far outside the shape an arrow stands, clear of the resize handles on its outline. */
const HANDLE_DISTANCE = 18;

/**
 * One of the arrows a selected shape shows on each of its sides. Pressing it starts drawing a relation
 * from the shape - see `RelationHandleTool`.
 *
 * Added as a child of the shape, as GLSP adds its resize handles, so it is drawn in the shape's own
 * coordinates and follows it through zooming, scrolling and moving. It has no bounds of its own, so no
 * layout takes it for one of the shape's contents.
 */
export class GRelationHandle extends GChildElement {
    static readonly TYPE = 'relation-handle';

    declare readonly parent: GParentElement;

    constructor(
        ownerId: string,
        readonly side: RelationHandleSide,
        override readonly type: string = GRelationHandle.TYPE
    ) {
        super();
        // Unique in the model index, which registers every child by its id.
        this.id = `${ownerId}_relation-handle-${side}`;
    }
}

export function isRelationHandle(element: GModelElement | undefined): element is GRelationHandle {
    return element instanceof GRelationHandle;
}

export function addRelationHandles(element: GParentElement): void {
    for (const side of SIDES) {
        if (!element.children.some(child => isRelationHandle(child) && child.side === side)) {
            element.add(new GRelationHandle(element.id, side));
        }
    }
}

export function removeRelationHandles(element: GParentElement): void {
    element.removeAll(child => isRelationHandle(child));
}

/** An arrow pointing away from the side it stands at, with a round patch around it that takes the click. */
@injectable()
export class GRelationHandleView implements IView {
    render(handle: GRelationHandle, context: RenderingContext): VNode | undefined {
        const parent = handle.parent;
        if (context.targetKind === 'hidden' || !isBoundsAware(parent)) {
            return undefined;
        }
        const { width, height } = parent.bounds;
        const position = {
            top: { x: width / 2, y: -HANDLE_DISTANCE },
            right: { x: width + HANDLE_DISTANCE, y: height / 2 },
            bottom: { x: width / 2, y: height + HANDLE_DISTANCE },
            left: { x: -HANDLE_DISTANCE, y: height / 2 }
        }[handle.side];

        return (
            <g
                class-uml-relation-handle={true}
                transform={`translate(${position.x}, ${position.y}) rotate(${ROTATION[handle.side]})`}
                data-side={handle.side}
            >
                <title>Create relation</title>
                <circle class-uml-relation-handle-hit={true} r={11} />
                <path class-uml-relation-handle-arrow={true} d='M 0 -9 L 7 -1 L 2.5 -1 L 2.5 8 L -2.5 8 L -2.5 -1 L -7 -1 Z' />
            </g>
        ) as any;
    }
}
