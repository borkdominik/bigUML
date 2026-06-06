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
import type { Region } from './region-element.def.js';

// @ts-nocheck

@Glsp.toolPalette({
    section: 'Container',
    label: 'State',
    icon: 'uml-state-icon'
})
@Glsp.defaults
export class State extends Node {
    name: string;
    visibility?: Visibility;
    regions?: Array<Region>;
}
