/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { CommonModelTypes } from '@borkdominik-biguml/uml-glsp-server';
import { GCompartmentElement, GLabelElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import type { GModelElement } from '@eclipse-glsp/server';

export interface FrameNameTagProps {
    id: string;
    name: string;
    /**
     * What kind of frame it is, written in bold before the name - the `interaction` of
     * `interaction Online Bookshop`. Left out where the notation has no keyword for the shape.
     */
    keyword?: string;
    /**
     * Extra classes for the name itself, for a frame that writes its name larger than the rest - an
     * activity titles everything drawn inside it and sets its own size and weight. Left off, the name is
     * styled like any other element's.
     */
    nameCssClasses?: string[];
}

/** Room left around the name inside its tag. */
const TAG_PADDING = 4;

/**
 * The name of a frame - a shape drawn as the boundary a part of the diagram sits inside, rather than as
 * a shape the size of its own name. It is written in the frame's top left corner, in a tag the frame's
 * view draws around it (see `FrameNodeView`), which is how UML names a frame.
 *
 * The keyword and the name are one compartment so that the shape drawn around them covers both: the view
 * measures this compartment and needs a single thing to measure.
 */
export function FrameNameTag(props: FrameNameTagProps): GModelElement {
    return (
        <GCompartmentElement
            id={`${props.id}_frame_tag`}
            type={DefaultTypes.COMPARTMENT_HEADER}
            layout='hbox'
            layoutOptions={{
                hGap: 5,
                paddingTop: TAG_PADDING,
                paddingBottom: TAG_PADDING,
                paddingLeft: TAG_PADDING,
                paddingRight: TAG_PADDING,
                // The tag is only ever as big as the name in it. Written out because a child inherits the
                // container's layout options except for the few GLSP resets (`hGrab`, `vGrab`, `prefWidth`,
                // `prefHeight`) - the floor a frame sets for itself is not among them, so without this the
                // tag takes the frame's minimum as its own size and the name ends up adrift in the middle
                // of a tag hundreds of pixels across.
                minWidth: 0,
                minHeight: 0
            }}
        >
            {props.keyword && (
                <GLabelElement
                    id={`${props.id}_frame_keyword_label`}
                    type={CommonModelTypes.LABEL_TEXT}
                    text={props.keyword}
                    cssClasses={['uml-font-bold']}
                />
            )}
            {/*
             * Named like every other element's name label, both because it is one and because that is the
             * id `GenericLabelEditOperationHandler` writes the edited text back through - so a frame is
             * renamed by typing on it, as the shapes inside it are.
             */}
            <GLabelElement
                id={`${props.id}_name_label`}
                type={CommonModelTypes.LABEL_NAME}
                text={props.name}
                cssClasses={props.nameCssClasses}
            />
        </GCompartmentElement>
    );
}
