/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { ActivityDiagramNodeTypes, OUTSIDE_LABEL_ARG, PIN_SIZE, type PinSide, pinPosition } from '@borkdominik-biguml/uml-glsp-server';
import { GNodeElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { InputPin, OutputPin } from '@borkdominik-biguml/uml-model-server/grammar';
import type { Dimension } from '@eclipse-glsp/protocol';
import type { GModelElement } from '@eclipse-glsp/server';
import type { BaseElementProps } from './element-context.js';

/**
 * The small square UML draws for a pin - the value an action takes in, or the one it hands on. An input
 * pin and an output pin are the same square, differing only in which side of the action they sit on and
 * which way the flow runs through them, so both are built here.
 */

/*
 * Every pin is `PIN_SIZE`, and the stored bounds are not consulted: neither pin type is given a
 * `resizable` hint, so there is no size a user could have chosen, and anything held for one is a
 * measurement that was written back.
 */

export interface GPinNodeElementProps extends BaseElementProps {
    id: string;
    name?: string;
}

/**
 * The pins of an action, drawn as squares hung on the side of it they belong to.
 *
 * They are children of the action rather than nodes beside it, so that dragging the action carries its
 * pins with it - a pin placed by its own absolute position would be left behind. Their positions are
 * therefore relative to the action's own origin, and worked out by `pinPosition`.
 *
 * `ownerSize` is the size stored for the action, which is only where it starts: the client sizes an
 * action to fit its name and then places these pins again against the size it arrived at. That is why
 * the arithmetic is shared rather than written out here - see `pinPosition` and `UmlActionVBoxLayouter`.
 */
export function attachedPins(pins: ReadonlyArray<InputPin | OutputPin> | undefined, ownerSize: Dimension, side: PinSide): GModelElement[] {
    if (!pins || pins.length === 0) {
        return [];
    }

    const type = side === 'input' ? ActivityDiagramNodeTypes.INPUT_PIN : ActivityDiagramNodeTypes.OUTPUT_PIN;

    return pins.map((pin, index) => (
        <GPinNodeElement id={pin.__id} name={pin.name} type={type} position={pinPosition(ownerSize, side, index, pins.length)} />
    ));
}

export function GPinNodeElement(props: GPinNodeElementProps): GModelElement {
    const size = PIN_SIZE;

    return (
        <GNodeElement
            id={props.id}
            type={props.type}
            position={props.position}
            size={size}
            cssClasses={['uml-node']}
            args={{ [OUTSIDE_LABEL_ARG]: props.name ?? '' }}
            // The name is written beside the square by the view rather than laid out inside it - a name
            // does not fit in 16 pixels, and one laid out within the bounds would stretch the square to
            // the width of the text. The `layout` still matters: `HiddenBoundsUpdater` sizes every node
            // from the bounding box of what its view renders, and only a layout container gets that
            // measurement overridden - without one, the name drawn outside would be measured back in and
            // the square would grow on every render.
            layout='vbox'
            layoutOptions={{
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 0,
                paddingRight: 0,
                minWidth: size.width,
                minHeight: size.height,
                prefWidth: size.width,
                prefHeight: size.height
            }}
        />
    );
}
