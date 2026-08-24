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
    label: 'Output Pin',
    icon: 'uml-output-pin-icon'
})
@Glsp.defaults
// Same as the input pin: placed by the action that owns it, so it stores no bounds - see `InputPin`.
@Glsp.noBounds
export class OutputPin extends Unbounded {
    name: string;
    visibility?: Visibility;
}
