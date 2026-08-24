/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { InitialState } from '@borkdominik-biguml/uml-model-server/grammar';
import type { GModelElement } from '@eclipse-glsp/server';
import { GCircleNodeElement } from './core/circle-node.js';
import type { ElementContext } from './core/element-context.js';

/**
 * The disc a state machine starts at. It carries no name: an initial state is anonymous in UML - which
 * is why clearing its name deletes the property outright, see `GenericLabelEditOperationHandler` - and
 * a disc this size has nowhere to put one.
 *
 * Built as a circle node so that it is a disc of its own size rather than a node the size of a name
 * that is not drawn: the label child it carried before was measured into the node's bounds by the
 * layouter, leaving a small circle adrift in a box as wide as `InitialState` reads.
 */
export function createInitialStateElement(ctx: ElementContext<InitialState>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);
    return <GCircleNodeElement id={ctx.node.__id} position={position} size={size} type={ctx.elementType} />;
}
