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
import { Edge, Node, Unbounded, type Visibility } from '../core/element.def.js';

// @ts-nocheck

export type TransitionKind = 'INTERNAL' | 'EXTERNAL' | 'LOCAL';

@Glsp.toolPalette({
    section: 'Transition',
    label: 'Transition',
    icon: 'uml-transition-icon'
})
@Glsp.defaults
export class Transition extends Edge {
    name?: string;
    visibility?: Visibility;
    kind?: TransitionKind = 'EXTERNAL';
    @Language.reference source: Node | Unbounded;
    @Language.reference target: Node | Unbounded;
}
