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
import type { Lifeline } from './lifeline-element.def.js';

// @ts-nocheck

@Glsp.toolPalette({
    section: 'Edges',
    label: 'Message',
    icon: 'uml-message-icon'
})
@Glsp.defaults
export class Message extends Edge {
    name?: string;
    visibility?: Visibility;
    @Language.reference source: Lifeline;
    @Language.reference target: Lifeline;
}
