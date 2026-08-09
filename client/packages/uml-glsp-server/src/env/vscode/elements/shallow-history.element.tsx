/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { ShallowHistory } from '@borkdominik-biguml/uml-model-server/grammar';
import type { GModelElement } from '@eclipse-glsp/server';
import type { ElementContext } from './core/element-context.js';
import { GHistoryNodeElement } from './core/history-node.js';

export function createShallowHistoryElement(ctx: ElementContext<ShallowHistory>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);
    return <GHistoryNodeElement id={ctx.node.__id} name={ctx.node.name} position={position} size={size} type={ctx.elementType} />;
}
