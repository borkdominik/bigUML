/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { Terminate } from '@borkdominik-biguml/uml-model-server/grammar';
import type { GModelElement } from '@eclipse-glsp/server';
import type { ElementContext } from './core/element-context.js';
import { GPseudostateMarkNodeElement } from './core/pseudostate-mark-node.js';

/**
 * Where a state machine stops altogether: a bare cross, with no ring around it.
 *
 * Reaching one ends the machine's execution there and then, which is why nothing leaves it and why it
 * is drawn without the circle an exit point has - a transition arrives at the cross and the diagram
 * stops. Built on the same square the other marks are so the name is written beside it rather than
 * measured into the node's own bounds.
 */
export function createTerminateElement(ctx: ElementContext<Terminate>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);
    return <GPseudostateMarkNodeElement id={ctx.node.__id} name={ctx.node.name} position={position} size={size} type={ctx.elementType} />;
}
