/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Glsp } from '@borkdominik-biguml/uml-glsp-server/generator';
import 'reflect-metadata';
import { Unbounded, type Visibility } from '../core/element.def.js';

// @ts-nocheck

@Glsp.toolPalette({
    section: 'Object Nodes',
    label: 'Input Pin',
    icon: 'uml-input-pin-icon'
})
@Glsp.defaults
// A pin is placed by the action that owns it - on the boundary, at the middle of its input side - so it
// has no bounds of its own to store. Writing them was worse than pointless: a pin lives inside the
// action's `inputPins`, and a `Size` or `Position` at the diagram root cannot reach a nested element to
// name it, so the reference went out as the word `undefined` and the file no longer parsed.
@Glsp.noBounds
export class InputPin extends Unbounded {
    name: string;
    visibility?: Visibility;
}
