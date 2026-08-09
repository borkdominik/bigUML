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
import type { ActivityParameterNode } from '@borkdominik-biguml/uml-model-server/grammar';
import type { Dimension } from '@eclipse-glsp/protocol';
import type { GModelElement } from '@eclipse-glsp/server';
import type { BaseElementProps, ElementContext } from './core/element-context.js';

export interface GActivityParameterNodeNodeElementProps extends BaseElementProps {
    node: ActivityParameterNode;
}

/**
 * What a parameter node opens at, matching the size `GenericCreateNodeOperationHandler` writes for one.
 *
 * Wider than tall, because it holds a parameter's name on a single line - and because it is drawn
 * straddling the border of the activity it belongs to, where a deep box would cover more of the flow
 * inside the frame than it needs to.
 */
const DEFAULT_PARAMETER_NODE_SIZE: Dimension = { width: 120, height: 50 };

/** Inset of the name from the border. */
const PARAMETER_NODE_PADDING = 8;

/**
 * A `Size` metaInfo can exist while carrying no usable dimensions (see `GenericChangeBoundsOperationHandler`),
 * which a plain `?? default` would accept - and the box would then be laid out down onto its own name.
 * Only positive dimensions count as a size someone chose.
 */
function parameterNodeSize(size: BaseElementProps['size']): Dimension {
    if (!size?.width || !size?.height || size.width <= 0 || size.height <= 0) {
        return DEFAULT_PARAMETER_NODE_SIZE;
    }
    return { width: size.width, height: size.height };
}

export function GActivityParameterNodeNodeElement(props: GActivityParameterNodeNodeElementProps): GModelElement {
    const size = parameterNodeSize(props.size);

    return (
        <GNodeElement
            id={props.node.__id}
            type={props.type}
            position={props.position}
            size={size}
            cssClasses={['uml-node']}
            // The name sits in the middle of the box at whatever size it is dragged to, the way an
            // action's does - a plain `vbox` leaves it tucked under the top border with the box shrunk
            // around it, which is a label with a line round it rather than the plain rectangle UML draws.
            layout='uml-centered-vbox'
            // `prefWidth`/`prefHeight` hold the node at the size stored for it, which the client would
            // otherwise re-layout down onto the name label.
            layoutOptions={{
                paddingTop: PARAMETER_NODE_PADDING,
                paddingBottom: PARAMETER_NODE_PADDING,
                paddingLeft: PARAMETER_NODE_PADDING,
                paddingRight: PARAMETER_NODE_PADDING,
                prefWidth: size.width,
                prefHeight: size.height
            }}
        >
            <GLabelElement type={CommonModelTypes.LABEL_TEXT} text={props.node.name} />
        </GNodeElement>
    );
}

export function createActivityParameterNodeElement(ctx: ElementContext<ActivityParameterNode>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);
    return <GActivityParameterNodeNodeElement node={ctx.node} position={position} size={size} type={ctx.elementType} />;
}
