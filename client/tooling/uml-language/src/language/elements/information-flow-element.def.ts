/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Glsp } from '@borkdominik-biguml/uml-glsp-server/generator';
import { Language } from '@borkdominik-biguml/uml-language-tooling';
import 'reflect-metadata';
import { Edge, type Visibility } from '../core/element.def.js';
import type { Actor } from './actor-element.def.js';
import type { Class } from './class-element.def.js';

// @ts-nocheck

@Glsp.toolPalette({
    section: 'Edges',
    label: 'Information Flow',
    icon: 'uml-dependency-icon'
})
@Glsp.defaults
export class InformationFlow extends Edge {
    name?: string;
    visibility?: Visibility;
    @Language.reference source: Actor | Class;
    @Language.reference target: Actor | Class;
}
