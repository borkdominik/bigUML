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
import { Node, type Visibility } from '../core/element.def.js';
import type { InputPin } from './input-pin-element.def.js';
import type { OutputPin } from './output-pin-element.def.js';

// @ts-nocheck

@Glsp.toolPalette({
    section: 'Actions',
    label: 'Opaque Action',
    icon: 'uml-opaque-action-icon'
})
@Glsp.defaults
// A box holding its name, where a name that runs to a second line is the normal case.
@Glsp.defaultSize({ width: 80, height: 60 })
export class OpaqueAction extends Node {
    name: string;
    visibility?: Visibility;
    inputPins?: Array<InputPin>;
    outputPins?: Array<OutputPin>;
}
