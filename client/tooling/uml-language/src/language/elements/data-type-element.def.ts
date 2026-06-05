/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Glsp } from '@borkdominik-biguml/uml-glsp-server/generator';
import { MinLength } from 'class-validator';
import 'reflect-metadata';
import { Node, type Visibility } from '../core/element.def.js';
import type { Class } from './class-element.def.js';
import type { Enumeration } from './enumeration-element.def.js';
import type { Interface } from './interface-element.def.js';
import type { Operation } from './operation-element.def.js';
import type { PrimitiveType } from './primitive-type-element.def.js';
import type { Property } from './property-element.def.js';

// @ts-nocheck
export type DataTypeReference = DataType | Enumeration | Class | Interface | PrimitiveType;

@Glsp.toolPalette({
    section: 'Container',
    label: 'DataType',
    icon: 'uml-data-type-icon'
})
@Glsp.defaults
export class DataType extends Node {
    @MinLength(5)
    name: string;
    properties?: Array<Property>;
    operations?: Array<Operation>;
    isAbstract?: boolean;
    visibility?: Visibility;
}
