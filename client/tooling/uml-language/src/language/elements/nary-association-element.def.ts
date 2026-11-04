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

/**
 * The diamond an association between more than two classes is drawn through. Each class it relates
 * runs an association to one of the diamond's tips, the way a transition runs to a choice.
 */
@Glsp.toolPalette({
    section: 'Relations',
    label: 'N-ary Association',
    icon: 'uml-decision-node-icon'
})
@Glsp.defaults
@Glsp.defaultSize({ width: 40, height: 40 })
export class NaryAssociation extends Node {
    name?: string;
    visibility?: Visibility;
}
