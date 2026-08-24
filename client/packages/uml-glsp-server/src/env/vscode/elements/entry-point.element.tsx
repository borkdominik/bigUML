/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { EntryPoint } from '@borkdominik-biguml/uml-model-server/grammar';
import type { GModelElement } from '@eclipse-glsp/server';
import type { ElementContext } from './core/element-context.js';
import { GPseudostateMarkNodeElement } from './core/pseudostate-mark-node.js';

/**
 * The point a composite state or a state machine is entered through: a small circle left hollow, which
 * is what tells it apart from the filled disc of an initial state.
 *
 * Built as the same circle the exit point and the histories are, and for the same reason - the name of
 * an entry point is what the transition arriving at it is read by, and a circle 30 across has nowhere to
 * put one, so the view writes it beside the shape instead of the layouter measuring it into the bounds.
 */
export function createEntryPointElement(ctx: ElementContext<EntryPoint>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);
    return <GPseudostateMarkNodeElement id={ctx.node.__id} name={ctx.node.name} position={position} size={size} type={ctx.elementType} />;
}
