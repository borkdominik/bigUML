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
import type { CentralBufferNode } from '@borkdominik-biguml/uml-model-server/grammar';
import type { Dimension } from '@eclipse-glsp/protocol';
import type { GModelElement } from '@eclipse-glsp/server';
import type { BaseElementProps, ElementContext } from './core/element-context.js';

export interface GCentralBufferNodeNodeElementProps extends BaseElementProps {
    node: CentralBufferNode;
}

/**
 * The same box an action opens at - a buffer node is the same kind of shape, holding a name and nothing
 * else. Kept in step with the entry `GenericCreateNodeOperationHandler` writes for one.
 */
const DEFAULT_BUFFER_SIZE: Dimension = { width: 80, height: 60 };

/** Inset of the name from the border. */
const BUFFER_PADDING = 8;

/**
 * A `Size` metaInfo can exist while carrying no usable dimensions (see `GenericChangeBoundsOperationHandler`),
 * which a plain `?? default` would accept - and the client layouter then collapses the box onto its name.
 * Only positive dimensions count as a size someone chose.
 */
function bufferSize(size: BaseElementProps['size']): Dimension {
    return {
        width: size?.width && size.width > 0 ? size.width : DEFAULT_BUFFER_SIZE.width,
        height: size?.height && size.height > 0 ? size.height : DEFAULT_BUFFER_SIZE.height
    };
}

export function GCentralBufferNodeNodeElement(props: GCentralBufferNodeNodeElementProps): GModelElement {
    const size = bufferSize(props.size);

    return (
        <GNodeElement
            id={props.node.__id}
            type={props.type}
            position={props.position}
            size={size}
            cssClasses={['uml-node']}
            // Laid out exactly as an action is - the name in the middle of the box at whatever size it is
            // dragged to, rather than under the top border. The corners are the only difference between
            // the two, and those are the view's to draw: this one keeps them square.
            layout='uml-centered-vbox'
            // `prefWidth`/`prefHeight` hold the box at the size stored for it, which the client would
            // otherwise re-layout down onto the name label.
            layoutOptions={{
                paddingTop: BUFFER_PADDING,
                paddingBottom: BUFFER_PADDING,
                paddingLeft: BUFFER_PADDING,
                paddingRight: BUFFER_PADDING,
                prefWidth: size.width,
                prefHeight: size.height
            }}
        >
            <GLabelElement type={CommonModelTypes.LABEL_TEXT} text={props.node.name} />
        </GNodeElement>
    );
}

export function createCentralBufferNodeElement(ctx: ElementContext<CentralBufferNode>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);
    return <GCentralBufferNodeNodeElement node={ctx.node} position={position} size={size} type={ctx.elementType} />;
}
