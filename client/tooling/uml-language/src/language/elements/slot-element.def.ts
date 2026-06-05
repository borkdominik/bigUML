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
import { Unbounded } from '../core/element.def.js';
import type { Class } from './class-element.def.js';
import type { Interface } from './interface-element.def.js';
import type { LiteralSpecification } from './literal-specification-element.def.js';
import type { Property } from './property-element.def.js';

// @ts-nocheck

type SlotDefiningFeature = Property | Class | Interface;

@Glsp.toolPalette({ section: 'Feature', label: 'Slot', icon: 'uml-slot-icon' })
@Glsp.noBounds
export class Slot extends Unbounded {
    name: string;
    @PropertyPalette.dynamic('DefiningFeature')
    @Language.reference
    definingFeature?: SlotDefiningFeature;
    values?: Array<LiteralSpecification> = [];
}
