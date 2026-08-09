/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { GNodeElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { StateMachine } from '@borkdominik-biguml/uml-model-server/grammar';
import type { Dimension } from '@eclipse-glsp/protocol';
import type { GModelElement } from '@eclipse-glsp/server';
import { FrameNameTag } from './core/index.js';
import type { BaseElementProps, ElementContext } from './core/element-context.js';

export interface GStateMachineNodeElementProps extends BaseElementProps {
    node: StateMachine;
}

/**
 * What a frame that carries no bounds of its own opens at. Kept in sync with the entry
 * `GenericCreateNodeOperationHandler` writes for a newly drawn frame.
 */
const DEFAULT_STATE_MACHINE_SIZE = { width: 800, height: 600 };

/**
 * The smallest a frame is ever drawn or dragged to. It is the boundary around the states it owns, so it
 * must not shrink onto its own name - which is what a model written before the frame was laid out as a
 * frame asks for, since it still carries the label-sized bounds of an ordinary node. A floor tied to the
 * frame's *current* size would stop it from being shrunk at all (GLSP reads `minWidth`/`minHeight` as the
 * smallest size a resize may reach), so this one is a constant the frame can always be dragged back down to.
 */
const MIN_STATE_MACHINE_SIZE = { width: 400, height: 300 };

/** Inset of the frame name from the frame border. */
const FRAME_PADDING = 8;

/**
 * A `Size` metaInfo can exist while carrying no usable dimensions (see `GenericChangeBoundsOperationHandler`),
 * which a plain `?? default` would happily accept - and the client layouter then collapses the frame onto its
 * name label because its preferred size resolves to 0. So only positive dimensions count as a persisted size.
 */
function frameSize(size: BaseElementProps['size']): Dimension {
    if (!size?.width || !size?.height || size.width <= 0 || size.height <= 0) {
        return DEFAULT_STATE_MACHINE_SIZE;
    }
    return {
        width: Math.max(size.width, MIN_STATE_MACHINE_SIZE.width),
        height: Math.max(size.height, MIN_STATE_MACHINE_SIZE.height)
    };
}

export function GStateMachineNodeElement(props: GStateMachineNodeElementProps): GModelElement {
    const size = frameSize(props.size);

    return (
        <GNodeElement
            id={props.node.__id}
            type={props.type}
            position={props.position}
            size={size}
            cssClasses={['uml-node', 'uml-state-machine-node']}
            layout='vbox'
            // The client lays this node out (`needsClientLayout`) and would otherwise shrink the frame down to
            // its name label. `prefWidth`/`prefHeight` are GLSP's way of holding a layouted node at a given
            // size; `minWidth`/`minHeight` are the floor a resize may not be dragged past. Both have to be
            // here: the preferred size alone lets the user drag the frame down to its name, and the floor
            // alone is ignored for layout as soon as a preferred size is set.
            layoutOptions={{
                hAlign: 'left',
                paddingTop: FRAME_PADDING,
                paddingBottom: FRAME_PADDING,
                paddingLeft: FRAME_PADDING,
                paddingRight: FRAME_PADDING,
                minWidth: MIN_STATE_MACHINE_SIZE.width,
                minHeight: MIN_STATE_MACHINE_SIZE.height,
                prefWidth: size.width,
                prefHeight: size.height
            }}
        >
            <FrameNameTag id={props.node.__id} keyword='state machine' name={props.node.name} />
        </GNodeElement>
    );
}

export function createStateMachineElement(ctx: ElementContext<StateMachine>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);
    return <GStateMachineNodeElement node={ctx.node} position={position} size={size} type={ctx.elementType} />;
}
