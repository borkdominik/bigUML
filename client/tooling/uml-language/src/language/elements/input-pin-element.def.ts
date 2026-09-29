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
// has no bounds of its own to store.
@Glsp.noBounds
export class InputPin extends Unbounded {
    name: string;
    visibility?: Visibility;
}
