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
import { Node, type Visibility } from '../core/element.def.js';

// @ts-nocheck

@Glsp.toolPalette({
    section: 'Container',
    label: 'Actor',
    icon: 'uml-actor-icon'
})
@Glsp.defaults
// A stick figure with no box around it: nothing for a resize handle to take hold of.
@Glsp.shape({ resizable: false })
export class Actor extends Node {
    name: string;
    visibility?: Visibility;
    /**
     * The property string of the actor - what UML writes in braces above its name, `{abstract}`. Stored
     * without the braces, as the property string of an association end is.
     */
    @Language.text modifiers?: string;
}
