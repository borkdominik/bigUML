/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Glsp } from '@borkdominik-biguml/uml-glsp-server/generator';
import { ArrayMaxSize, Matches, MinLength, ValidateIf } from 'class-validator';
import 'reflect-metadata';
import { Node, type Visibility } from '../core/element.def.js';
import type { Operation } from './operation-element.def.js';
import type { Property } from './property-element.def.js';

// @ts-nocheck

@Glsp.toolPalette({
    section: 'Container',
    label: 'Class',
    icon: 'uml-class-icon'
})
@Glsp.defaults
export class Class extends Node {
    @Matches(/^[A-Z]/, {
        message: 'First letter of class name must be uppercase.'
    })
    @MinLength(5, { message: 'Class name must be at least 5 characters long' })
    name: string;
    isAbstract: boolean = false;
    @ValidateIf(o => o.isActive === true)
    @ArrayMaxSize(3, {
        message: 'Active classes must declare at most 3 properties.'
    })
    properties?: Array<Property>;
    operations?: Array<Operation>;
    isActive?: boolean;
    visibility?: Visibility;
}
