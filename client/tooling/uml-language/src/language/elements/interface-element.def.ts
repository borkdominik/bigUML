/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Glsp } from '@borkdominik-biguml/uml-glsp-server/generator';
import { LengthBetween } from '@borkdominik-biguml/uml-model-server/validation';
import 'reflect-metadata';
import { Node } from '../core/element.def.js';
import type { Operation } from './operation-element.def.js';
import type { Property } from './property-element.def.js';

// @ts-nocheck

@Glsp.toolPalette({
    section: 'Container',
    label: 'Interface',
    icon: 'uml-interface-icon'
})
@Glsp.defaults
export class Interface extends Node {
    @LengthBetween(3, 10, { message: 'Interface.name must be 3–10 characters' })
    name: string;
    properties?: Array<Property>;
    operations?: Array<Operation>;
}
