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
    section: 'Relation',
    label: 'Communication Path',
    icon: 'uml-communication-path-icon'
})
@Glsp.defaults
export class CommunicationPath extends Relation {
    name?: string;
    visibility?: Visibility;
}
