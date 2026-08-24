/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { GNodeElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { GModelElement } from '@eclipse-glsp/server';
import type { BaseElementProps } from './element-context.js';

/**
 * The small circles UML draws for the ends of a flow - where an activity begins, where it finishes, and
 * where one of its flows finishes. Built in one place so the three cannot drift apart, the way the
 * client views drawn for them had.
 */

/**
 * A flow end is small by convention: it marks a point in the flow rather than holding anything.
 *
 * Every one of them is this size, and the stored bounds are not consulted. None of these types is
 * given a `resizable` hint, so there is no size a user could have chosen deliberately - anything held
 * for them is a measurement that was written back, and reading those measurements back in is what let
 * the three drift to different sizes in the first place.
 */
const CIRCLE_SIZE = { width: 30, height: 30 };

export interface GCircleNodeElementProps extends BaseElementProps {
    id: string;
}

export function GCircleNodeElement(props: GCircleNodeElementProps): GModelElement {
    const size = CIRCLE_SIZE;

    return (
        <GNodeElement
            id={props.id}
            type={props.type}
            position={props.position}
            size={size}
            cssClasses={['uml-node']}
            // These circles carry no name: they mark a point in the flow, and one written beside a shape
            // this small says more about the tool than about the model. The `layout` still matters:
            // `HiddenBoundsUpdater` sizes every node from the bounding box of what its view renders, and
            // only a layout container gets that measurement overridden - the pref and min below are what
            // hold the circle at its size rather than letting a measurement decide it.
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
