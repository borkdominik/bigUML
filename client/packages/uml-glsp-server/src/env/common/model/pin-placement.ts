/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { Dimension, Point } from '@eclipse-glsp/protocol';

/**
 * Where the pins of an action sit on it.
 *
 * Lives here rather than beside the element that builds them because both ends place them: the server
 * puts each pin at its position when it builds the model, and the client puts it there again once the
 * action has been laid out and its real size is known. An action is sized by the client to fit its name,
 * so the size the server placed against is only a first guess - and if the two ends worked it out
 * differently, a pin would jump the moment the diagram was laid out.
 */

/** Which side of the action a pin sits on: what it takes in on the left, what it hands on to the right. */
export type PinSide = 'input' | 'output';

/** A pin is drawn small enough to sit on the boundary of the action it belongs to. */
export const PIN_SIZE: Dimension = { width: 16, height: 16 };

/**
 * Where the `index`th of `count` pins sits on that side of an action of `ownerSize`, relative to the
 * action's own origin.
 *
 * The square sits outside the action with one side flush against its border, rather than straddling it:
 * the action's outline stays unbroken, and the pin reads as something hung on that side of it. A flow
 * therefore meets the pin before the action, which is the order it happens in.
 *
 * Several pins on one side are spread evenly down that edge rather than stacked from the top, so a lone
 * pin sits at the middle of the face - level with the connection point drawn there, and where a flow
 * running straight into the action would meet it.
 */
export function pinPosition(ownerSize: Dimension, side: PinSide, index: number, count: number): Point {
    return {
        x: side === 'input' ? -PIN_SIZE.width : ownerSize.width,
        y: (ownerSize.height * (index + 1)) / (count + 1) - PIN_SIZE.height / 2
    };
}
