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
import type { GModelElement } from '@eclipse-glsp/server';
import { DEFAULT_REGION_BAND_HEIGHT, regionBandHeight, STATE_PADDING, stateSize } from '../geometry/composite-state.js';
import { type BaseElementProps, type ElementContext, renderContents } from './core/element-context.js';
import { SectionCompartment } from './core/index.js';
import { GStatePartNodeElement } from './state-part.element.js';
import { GStateRegionCompartment } from './state-region.element.js';

export interface GStateNodeElementProps extends BaseElementProps {
    node: State;
    /**
     * How deep this state holds each of its regions, which is what the box has to be tall enough to hold
     * as many of as it has. Worked out by `createStateElement` from the state's stored `regionHeight`;
     * left out, a region at its default depth is assumed.
     */
    bandHeight?: number;
    /** The compartments under the name - the parts, and the region bands (see `createStateElement`). */
    children?: GlspNode;
}

export function GStateNodeElement(props: GStateNodeElementProps): GModelElement {
    const regions = props.node.regions ?? [];
    const composite = regions.length > 0;
    const size = stateSize(props.size, props.node, props.bandHeight ?? DEFAULT_REGION_BAND_HEIGHT);

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
    // state. Their width is the room inside the state's borders, which is what they open at; their
    // depth is not given to them at all, but taken as an equal share of the state they divide.
    const regions = ctx.node.regions ?? [];
    // One depth for all of them, held by the state rather than by each region - see `regionBandHeight`.
    const bandHeight = regionBandHeight(ctx.node.regionHeight);
    const bandWidth = stateSize(size, ctx.node, bandHeight).width - 2 * STATE_PADDING;
    const regionBands = regions.map((region, index) => (
        <GStateRegionCompartment
            node={region}
            divided={index > 0}
            width={bandWidth}
            substates={renderContents(ctx, region.subvertices)}
        />
    ));

    return (
        <GStateNodeElement node={ctx.node} position={position} size={size} bandHeight={bandHeight} type={ctx.elementType}>
            {partsSection}
            {regionBands}
        </GStateNodeElement>
    );
}
