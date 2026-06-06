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
import { Unbounded, type Visibility } from '../core/element.def.js';
import type { DataTypeReference } from './data-type-element.def.js';

// @ts-nocheck

export type AggregationType = 'NONE' | 'SHARED' | 'COMPOSITE';

@Glsp.toolPalette({
    section: 'Feature',
    label: 'Property',
    icon: 'uml-property-icon'
})
@Glsp.noBounds
export class Property extends Unbounded {
    name: string;
    isDerived?: boolean = false;
    isOrdered?: boolean = false;
    isStatic?: boolean = false;
    isDerivedUnion?: boolean = false;
    isReadOnly?: boolean = false;
    isNavigable?: boolean = false;
    isUnique?: boolean = false;
    visibility?: Visibility = 'PUBLIC';
    multiplicity?: string;
    @PropertyPalette.dynamic('DataType') @Language.reference propertyType?: DataTypeReference;
    aggregation?: AggregationType;
}
