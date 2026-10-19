/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { PropertyPalette } from '@borkdominik-biguml/big-property-palette/generator';
import { Glsp } from '@borkdominik-biguml/uml-glsp-server/generator';
import { Language } from '@borkdominik-biguml/uml-language-tooling';
import 'reflect-metadata';
import type { Association } from './association-element.def.js';
import { Relation } from './relation-element.def.js';

// @ts-nocheck

/** A link between two instances: an instance of an association, drawn as a plain line. */
@Glsp.toolPalette({
    section: 'Relations',
    label: 'Instance Link',
    icon: 'uml-association-icon'
})
@Glsp.defaults
export class InstanceLink extends Relation {
    name?: string;
    @PropertyPalette.dynamic('Association')
    @Language.reference
    association?: Association;
}
