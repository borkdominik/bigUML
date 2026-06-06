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
import { type Visibility } from '../core/element.def.js';
import { Relation } from './relation-element.def.js';

// @ts-nocheck

@Glsp.toolPalette({
    section: 'Relations',
    label: 'Dependency',
    icon: 'uml-dependency-icon'
})
@Glsp.defaults
export class Dependency extends Relation {
    name?: string;
    visibility?: Visibility;
}
