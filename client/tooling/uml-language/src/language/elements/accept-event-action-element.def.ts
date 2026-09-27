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

// @ts-nocheck

@Glsp.toolPalette({
    section: 'Actions',
    label: 'Accept Event Action',
    icon: 'uml-accept-event-action-icon'
})
@Glsp.defaults
// Wider than a plain action: half its height is given over to the notch.
@Glsp.defaultSize({ width: 140, height: 60 })
export class AcceptEventAction extends Node {
    name: string;
    visibility?: Visibility;
}
