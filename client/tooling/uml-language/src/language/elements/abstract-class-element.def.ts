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
import { Class } from './class-element.def.js';

// @ts-nocheck

@Glsp.toolPalette({
    section: 'Container',
    label: 'Abstract Class',
    icon: 'uml-class-icon'
})
@Glsp.defaults
export class AbstractClass extends Class {
    override isAbstract: boolean = true;
    declare label: string;
}
