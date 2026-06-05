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
import type { Lifeline } from './lifeline-element.def.js';
import type { Message } from './message-element.def.js';

// @ts-nocheck

@Glsp.toolPalette({
    section: 'Container',
    label: 'Interaction',
    icon: 'uml-interaction-icon'
})
@Glsp.defaults
export class Interaction extends Node {
    name: string;
    visibility?: Visibility;
    lifelines?: Array<Lifeline>;
    messages?: Array<Message>;
}
