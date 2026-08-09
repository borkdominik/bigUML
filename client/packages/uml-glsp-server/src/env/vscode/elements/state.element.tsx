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
import type { State } from '@borkdominik-biguml/uml-model-server/grammar';
import type { Dimension } from '@eclipse-glsp/protocol';
import type { GModelElement } from '@eclipse-glsp/server';
import type { BaseElementProps, ElementContext } from './core/element-context.js';

export interface GStateNodeElementProps extends BaseElementProps {
    node: State;
}

/**
 * A state is drawn as a box holding its name, not as a chip cut to the name, so one that carries no
 * bounds of its own starts out at this size instead of collapsing onto the label. Kept in sync with
 * the entry `GenericCreateNodeOperationHandler` writes for a newly drawn state.
 */
const DEFAULT_STATE_SIZE = { width: 160, height: 70 };

/** Inset of the state name from the state border. */
const STATE_PADDING = 8;

/**
 * A `Size` metaInfo can exist while carrying no usable dimensions (see `GenericChangeBoundsOperationHandler`),
 * which a plain `?? default` would happily accept - and the client layouter then collapses the state onto its
 * name label because its preferred size resolves to 0. So only positive dimensions count as a persisted size.
 */
function stateSize(size: BaseElementProps['size']): Dimension {
    return {
        width: size?.width && size.width > 0 ? size.width : DEFAULT_STATE_SIZE.width,
        height: size?.height && size.height > 0 ? size.height : DEFAULT_STATE_SIZE.height
    };
}

export function GStateNodeElement(props: GStateNodeElementProps): GModelElement {
    const size = stateSize(props.size);

    return (
        <GNodeElement
            id={props.node.__id}
            type={props.type}
            position={props.position}
            size={size}
            cssClasses={['uml-node']}
            // A state is resized freely, so its name has to stay in the middle of the box at whatever
            // size it is dragged to - which plain `vbox` does not do (see `UmlCenteredVBoxLayouter`).
            layout='uml-centered-vbox'
            // The client re-layouts this node (`needsClientLayout`) and would otherwise shrink it back
            // onto its name label after every resize. `prefWidth`/`prefHeight` are GLSP's way of holding
            // a layouted node at a given size, and unlike `minWidth`/`minHeight` they are not read as a
            // resize limit - so the state can still be dragged smaller again, down to its own name.
            layoutOptions={{
                paddingTop: STATE_PADDING,
                paddingBottom: STATE_PADDING,
                paddingLeft: STATE_PADDING,
                paddingRight: STATE_PADDING,
                prefWidth: size.width,
                prefHeight: size.height
            }}
        >
            <GLabelElement type={CommonModelTypes.LABEL_TEXT} text={props.node.name} cssClasses={['uml-font-bold']} />
        </GNodeElement>
    );
}

export function createStateElement(ctx: ElementContext<State>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);
    return <GStateNodeElement node={ctx.node} position={position} size={size} type={ctx.elementType} />;
}
