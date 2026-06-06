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
import { Edge, type Node, type Unbounded, type Visibility } from '../core/element.def.js';

// @ts-nocheck

@Glsp.toolPalette({
    section: 'Edges',
    label: 'Control Flow',
    icon: 'uml-control-flow-icon'
})
@Glsp.defaults
export class ControlFlow extends Edge {
    name?: string;
    visibility?: Visibility;
    guard?: string;
    weight?: number;
    @Language.reference source: Node | Unbounded;
    @Language.reference target: Node | Unbounded;
}
