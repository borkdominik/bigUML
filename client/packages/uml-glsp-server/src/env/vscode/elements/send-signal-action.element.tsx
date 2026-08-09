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
import type { SendSignalAction } from '@borkdominik-biguml/uml-model-server/grammar';
import type { GModelElement } from '@eclipse-glsp/server';
import type { BaseElementProps, ElementContext } from './core/element-context.js';
import { ACTION_PADDING, eventActionSize, notchDepth } from './core/event-action.js';

export interface GSendSignalActionNodeElementProps extends BaseElementProps {
    node: SendSignalAction;
}

export function GSendSignalActionNodeElement(props: GSendSignalActionNodeElementProps): GModelElement {
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
            // The point is pushed out of the right edge, so the name is inset from that side - laid out
            // to the border it would run into the tapering tip. `prefWidth`/`prefHeight` hold the box at
            // its size, which the client would otherwise shrink onto the label.
            layoutOptions={{
                paddingTop: ACTION_PADDING,
                paddingBottom: ACTION_PADDING,
                paddingLeft: ACTION_PADDING,
                paddingRight: notchDepth(size) + ACTION_PADDING,
                prefWidth: size.width,
                prefHeight: size.height
            }}
        >
            <GLabelElement type={CommonModelTypes.LABEL_TEXT} text={props.node.name} />
        </GNodeElement>
    );
}

export function createSendSignalActionElement(ctx: ElementContext<SendSignalAction>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);
    return <GSendSignalActionNodeElement node={ctx.node} position={position} size={size} type={ctx.elementType} />;
}
