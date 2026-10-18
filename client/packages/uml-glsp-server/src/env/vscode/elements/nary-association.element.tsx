/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
/** @jsxImportSource @borkdominik-biguml/uml-glsp-server/jsx */
import type { NaryAssociation } from '@borkdominik-biguml/uml-model-server/grammar';
import type { GModelElement } from '@eclipse-glsp/server';
import { GDiamondNodeElement } from './core/diamond-node.js';
import type { ElementContext } from './core/element-context.js';

export function createNaryAssociationElement(ctx: ElementContext<NaryAssociation>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);
    return (
        <GDiamondNodeElement
            id={ctx.node.__id}
            name={ctx.node.name}
            position={position}
            size={size}
            type={ctx.elementType}
            // The same four tips a choice offers. An association records which one it runs to in
            // `sourcePoint`/`targetPoint`, just as it does on a choice.
            connectionPoints
        />
    );
}
