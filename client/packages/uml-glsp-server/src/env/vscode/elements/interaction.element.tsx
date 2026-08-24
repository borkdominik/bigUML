/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { GNodeElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { Interaction } from '@borkdominik-biguml/uml-model-server/grammar';
import { type Dimension } from '@eclipse-glsp/protocol';
import type { GModelElement } from '@eclipse-glsp/server';
import { FrameNameTag } from './core/index.js';
import type { BaseElementProps, ElementContext } from './core/element-context.js';

export interface GInteractionNodeElementProps extends BaseElementProps {
    node: Interaction;
}

/**
 * What a frame that carries no bounds of its own opens at. An interaction is the boundary the whole
 * diagram is drawn inside, so it opens large enough to hold the lifelines that go in it.
 */
const DEFAULT_INTERACTION_SIZE = { width: 1400, height: 900 };

/**
 * The smallest a frame is ever drawn or dragged to. It is the boundary around the lifelines it holds, so
 * it must not shrink onto its own name - which is what a model written before the interaction was laid
 * out as a frame asks for, since it still carries the label-sized bounds of an ordinary node.
 */
const MIN_INTERACTION_SIZE = { width: 400, height: 300 };

/** Inset of the frame's name tag from the frame border. */
const FRAME_PADDING = 8;

/**
 * A `Size` metaInfo can exist while carrying no usable dimensions (see `GenericChangeBoundsOperationHandler`),
 * which a plain `?? default` would happily accept - and the client layouter then collapses the frame onto its
 * name label because its preferred size resolves to 0. So only positive dimensions count as a persisted size.
 */
function frameSize(size: BaseElementProps['size']): Dimension {
    if (!size?.width || !size?.height || size.width <= 0 || size.height <= 0) {
        return DEFAULT_INTERACTION_SIZE;
    }
    return {
        width: Math.max(size.width, MIN_INTERACTION_SIZE.width),
        height: Math.max(size.height, MIN_INTERACTION_SIZE.height)
    };
}

export function GInteractionNodeElement(props: GInteractionNodeElementProps): GModelElement {
    const size = frameSize(props.size);

    return (
        <GNodeElement
            id={props.node.__id}
            type={props.type}
            position={props.position}
            size={size}
            cssClasses={['uml-node', 'uml-interaction-node']}
            layout='vbox'
            // The client lays this node out (`needsClientLayout`) and would otherwise shrink the frame down to
            // its name tag. `prefWidth`/`prefHeight` are GLSP's way of holding a layouted node at a given
            // size; `minWidth`/`minHeight` are the floor a resize may not be dragged past. Both have to be
            // here: the preferred size alone lets the user drag the frame down to its name, and the floor
            // alone is ignored for layout as soon as a preferred size is set.
            layoutOptions={{
                hAlign: 'left',
                paddingTop: FRAME_PADDING,
                paddingBottom: FRAME_PADDING,
                paddingLeft: FRAME_PADDING,
                paddingRight: FRAME_PADDING,
                minWidth: MIN_INTERACTION_SIZE.width,
                minHeight: MIN_INTERACTION_SIZE.height,
                prefWidth: size.width,
                prefHeight: size.height
            }}
        >
            <FrameNameTag id={props.node.__id} keyword='interaction' name={props.node.name} />
        </GNodeElement>
    );
}

export function createInteractionElement(ctx: ElementContext<Interaction>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);
    return <GInteractionNodeElement node={ctx.node} position={position} size={size} type={ctx.elementType} />;
}
