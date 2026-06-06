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
import { Node } from '../core/element.def.js';

// @ts-nocheck

@Glsp.toolPalette({
    section: 'Container',
    label: 'Primitive Type',
    icon: 'uml-primitive-type-icon'
})
@Glsp.defaults
export class PrimitiveType extends Node {
    name: string;
}
