/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { CommonModelTypes } from '@borkdominik-biguml/uml-glsp-server';
import { GLabelElement, GNodeElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { AcceptEventAction } from '@borkdominik-biguml/uml-model-server/grammar';
import type { GModelElement } from '@eclipse-glsp/server';
import { ACTION_PADDING, eventActionSize, notchDepth } from './core/event-action.js';
import type { BaseElementProps, ElementContext } from './core/element-context.js';

export interface GAcceptEventActionNodeElementProps extends BaseElementProps {
    node: AcceptEventAction;
}

export function GAcceptEventActionNodeElement(props: GAcceptEventActionNodeElementProps): GModelElement {
    const size = eventActionSize(props.size);

    return (
        <GNodeElement
            id={props.node.__id}
            type={props.type}
            position={props.position}
            size={size}
            cssClasses={['uml-node']}
            // Centred like the other actions, so the name stays in the middle of a box this tall rather
            // than sitting under its top border.
            layout='uml-centered-vbox'
            // The notch is cut into the left edge, so the name is inset past it - laid out from the
            // border it would be written across the bite taken out of the shape. `prefWidth`/`prefHeight`
            // hold the box at its size, which the client would otherwise shrink onto the label.
            layoutOptions={{
                paddingTop: ACTION_PADDING,
                paddingBottom: ACTION_PADDING,
                paddingLeft: notchDepth(size) + ACTION_PADDING,
                paddingRight: ACTION_PADDING,
                prefWidth: size.width,
                prefHeight: size.height
            }}
        >
            <GLabelElement type={CommonModelTypes.LABEL_TEXT} text={props.node.name} />
        </GNodeElement>
    );
}

export function createAcceptEventActionElement(ctx: ElementContext<AcceptEventAction>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);
    return <GAcceptEventActionNodeElement node={ctx.node} position={position} size={size} type={ctx.elementType} />;
}
