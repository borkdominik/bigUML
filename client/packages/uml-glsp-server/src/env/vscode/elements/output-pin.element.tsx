/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { OutputPin } from '@borkdominik-biguml/uml-model-server/grammar';
import type { GModelElement } from '@eclipse-glsp/server';
import type { ElementContext } from './core/element-context.js';
import { GPinNodeElement } from './core/pin-node.js';

export function createOutputPinElement(ctx: ElementContext<OutputPin>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    return <GPinNodeElement id={ctx.node.__id} name={ctx.node.name} position={position} type={ctx.elementType} />;
}
