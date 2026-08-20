/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { CommonModelTypes } from '@borkdominik-biguml/uml-glsp-server';
import { GLabelElement, GNodeElement, type GlspNode } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { State } from '@borkdominik-biguml/uml-model-server/grammar';
import type { Dimension } from '@eclipse-glsp/protocol';
import type { GModelElement } from '@eclipse-glsp/server';
import type { BaseElementProps, ElementContext } from './core/element-context.js';
import { SectionCompartment } from './core/index.js';
import { GStatePartNodeElement } from './state-part.element.js';
import { GStateRegionCompartment } from './state-region.element.js';

export interface GStateNodeElementProps extends BaseElementProps {
    node: State;
    /** The compartments under the name - the parts, and the region bands (see `createStateElement`). */
    children?: GlspNode;
}

/**
 * A state is drawn as a box holding its name, not as a chip cut to the name, so one that carries no
 * bounds of its own starts out at this size instead of collapsing onto the label. Kept in sync with
 * the entry `GenericCreateNodeOperationHandler` writes for a newly drawn state.
 */
const DEFAULT_STATE_SIZE = { width: 160, height: 70 };

/**
 * What a state opens at once it has a region: a frame its substates are drawn inside rather than a box
 * holding a name, so it opens at the size of something that has to contain them. Wide enough for two
 * substates side by side with a transition between them.
 *
 * A state that already carries a size keeps it - the bands push it open from the inside instead, since
 * each opens at a height of its own and the layouter grows the state around its content.
 */
const DEFAULT_COMPOSITE_STATE_SIZE = { width: 420, height: 300 };

/** Inset of the state name from the state border. */
const STATE_PADDING = 8;

/**
 * A `Size` metaInfo can exist while carrying no usable dimensions (see `GenericChangeBoundsOperationHandler`),
 * which a plain `?? default` would happily accept - and the client layouter then collapses the state onto its
 * name label because its preferred size resolves to 0. So only positive dimensions count as a persisted size.
 */
function stateSize(size: BaseElementProps['size'], composite: boolean): Dimension {
    const fallback = composite ? DEFAULT_COMPOSITE_STATE_SIZE : DEFAULT_STATE_SIZE;
    return {
        width: size?.width && size.width > 0 ? size.width : fallback.width,
        height: size?.height && size.height > 0 ? size.height : fallback.height
    };
}

export function GStateNodeElement(props: GStateNodeElementProps): GModelElement {
    const composite = (props.node.regions?.length ?? 0) > 0;
    const size = stateSize(props.size, composite);

    return (
        <GNodeElement
            id={props.node.__id}
            type={props.type}
            position={props.position}
            size={size}
            // A composite state is a frame its substates stand on rather than a filled box, so it is
            // marked as one for the stylesheet to take its fill back - see `uml-composite-state-node`.
            // Filled, a state drawn around substates that were already there would hide them, and
            // swallow every click inside its own bounds.
            cssClasses={composite ? ['uml-node', 'uml-composite-state-node'] : ['uml-node']}
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
            <GLabelElement
                id={props.node.__id + '_name_label'}
                type={CommonModelTypes.LABEL_TEXT}
                text={props.node.name}
                cssClasses={['uml-font-bold']}
            />
            {props.children}
        </GNodeElement>
    );
}

export function createStateElement(ctx: ElementContext<State>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);

    // The second compartment exists only where the state has a part: UML draws the divider to separate
    // the name from the lines under it, and a state with none is a plain named box.
    const parts = ctx.node.parts ?? [];
    const partsSection =
        parts.length > 0 ? (
            <SectionCompartment
                id={ctx.node.__id + '_parts'}
                type={CommonModelTypes.COMP_STATE_PARTS}
                height={ctx.node.partsHeight}
                divider
            >
                {parts.map(part => (
                    <GStatePartNodeElement node={part} />
                ))}
            </SectionCompartment>
        ) : null;

    // One band per region, stacked under the parts. The first is ruled off from what is above it and
    // the rest from one another - dashed, which is how UML separates the regions of an orthogonal
    // state. Their width is the room inside the state's borders, which is what they open at.
    const regions = ctx.node.regions ?? [];
    const bandWidth = stateSize(size, regions.length > 0).width - 2 * STATE_PADDING;
    const regionBands = regions.map((region, index) => (
        <GStateRegionCompartment
            node={region}
            divided={index > 0}
            width={bandWidth}
            // A region carries its own height, dragged on the band and stored the way every other
            // dimension in a diagram is (see `GenericChangeBoundsOperationHandler`).
            height={ctx.modelIndex.findSize(region.__id)?.height}
        />
    ));

    return (
        <GStateNodeElement node={ctx.node} position={position} size={size} type={ctx.elementType}>
            {partsSection}
            {regionBands}
        </GStateNodeElement>
    );
}
