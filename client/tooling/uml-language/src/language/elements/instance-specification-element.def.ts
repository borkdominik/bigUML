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
import { Node, type Visibility } from '../core/element.def.js';
import type { Class } from './class-element.def.js';
import type { DataType } from './data-type-element.def.js';
import type { Interface } from './interface-element.def.js';
import type { Slot } from './slot-element.def.js';

// @ts-nocheck

/** The classifiers an instance can be an instance of. */
type InstanceClassifier = Class | Interface | DataType;

@Glsp.toolPalette({
    section: 'Container',
    label: 'Instance Specification',
    icon: 'uml-instance-specification-icon'
})
@Glsp.defaults
export class InstanceSpecification extends Node {
    name: string;
    visibility?: Visibility;
    @PropertyPalette.dynamic('Classifier')
    @Language.reference
    classifier?: InstanceClassifier;
    slots?: Array<Slot>;
}
