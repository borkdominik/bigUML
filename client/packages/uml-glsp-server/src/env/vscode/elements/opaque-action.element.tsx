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
import type { OpaqueAction } from '@borkdominik-biguml/uml-model-server/grammar';
import type { Dimension } from '@eclipse-glsp/protocol';
import type { GModelElement } from '@eclipse-glsp/server';
import type { BaseElementProps, ElementContext } from './core/element-context.js';
import { connectionPorts } from './core/connection-ports.js';
import { attachedPins } from './core/pin-node.js';

export interface GOpaqueActionNodeElementProps extends BaseElementProps {
    node: OpaqueAction;
}

/**
 * What an action opens at, matching the size `GenericCreateNodeOperationHandler` writes for one - the
 * two have to agree, or the pins would be placed against a shape of one size and drawn on another.
 *
 * Tall enough to hold a name that runs to a second line, which an action's name usually does: `Add to
 * Shopping Cart` reads as two lines rather than one long strip.
 */
const DEFAULT_ACTION_SIZE = { width: 80, height: 60 };

/** Inset of the action name from the action border. */
const ACTION_PADDING = 8;

/**
 * The pins are placed against this, so it has to be the size the action is actually drawn at. Bounds
 * that were never stored, or stored as zero, fall back to the size a new action is given rather than to
 * nothing - a pin placed against a zero-height action would sit on its corner.
 */
function actionSize(size: BaseElementProps['size']): Dimension {
    if (!size?.width || !size?.height || size.width <= 0 || size.height <= 0) {
        return DEFAULT_ACTION_SIZE;
    }
    return { width: size.width, height: size.height };
}

export function GOpaqueActionNodeElement(props: GOpaqueActionNodeElementProps): GModelElement {
    const size = actionSize(props.size);

    return (
        <GNodeElement
            id={props.node.__id}
            type={props.type}
            position={props.position}
            size={size}
            cssClasses={['uml-node']}
            // The name sits in the middle of the box at whatever size the action is dragged to, the way a
            // state's does - plain `vbox` would leave it under the top border. This layout also puts the
            // pins and the dots back on the boundary once the box has been sized to fit that name, which
            // is a size only the client knows (see `UmlCenteredVBoxLayouter`).
            layout='uml-centered-vbox'
            // `prefWidth`/`prefHeight` hold the node at the size stored for it, which the client would
            // otherwise re-layout down onto the name label. That also keeps the shape the pins were placed
            // against the shape actually drawn: they are positioned from this size, so an action that
            // rendered smaller would leave them hanging off it.
            layoutOptions={{
                paddingTop: ACTION_PADDING,
                paddingBottom: ACTION_PADDING,
                paddingLeft: ACTION_PADDING,
                paddingRight: ACTION_PADDING,
                prefWidth: size.width,
                prefHeight: size.height
            }}
        >
            <GLabelElement type={CommonModelTypes.LABEL_TEXT} text={props.node.name} />
            {/* A dot on the middle of each side, marking where a pin goes: the left side takes what the
                action reads in, the right side what it hands on, and a lone pin on either is placed on
                exactly that midpoint by `attachedPins`. Like the pins, these are not laid out - a port
                has no layoutable-child feature, so the column above passes both over. */}
            {connectionPorts(props.node.__id, size, 'sides')}
            {attachedPins(props.node.inputPins, size, 'input')}
            {attachedPins(props.node.outputPins, size, 'output')}
        </GNodeElement>
    );
}

export function createOpaqueActionElement(ctx: ElementContext<OpaqueAction>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);
    return <GOpaqueActionNodeElement node={ctx.node} position={position} size={size} type={ctx.elementType} />;
}
