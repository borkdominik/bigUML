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
import { Node, type Visibility } from '../core/element.def.js';
import type { EnumerationLiteral } from './enumeration-literal-element.def.js';

// @ts-nocheck

@Glsp.toolPalette({
    section: 'Container',
    label: 'Enumeration',
    icon: 'uml-enumeration-icon'
})
@Glsp.defaults
export class Enumeration extends Node {
    @LengthBetween(3, 10, { message: 'Enumeration.name must be 3–10 characters' })
    name: string;
    isAbstract?: boolean = false;
    visibility?: Visibility;
    values?: Array<EnumerationLiteral>;
}
