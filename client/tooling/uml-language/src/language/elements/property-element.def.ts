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
import { PropertyPalette } from '@borkdominik-biguml/big-property-palette/generator';
import 'reflect-metadata';
import { Unbounded, type Visibility } from '../core/element.def.js';
import type { Class } from './class-element.def.js';
import type { DataType } from './data-type-element.def.js';
import type { Enumeration } from './enumeration-element.def.js';
import type { Interface } from './interface-element.def.js';
import type { PrimitiveType } from './primitive-type-element.def.js';

// @ts-nocheck

export type AggregationType = 'NONE' | 'SHARED' | 'COMPOSITE';

/** The elements of a model a property or a parameter can be typed with. */
export type Classifier = Class | Interface | DataType | PrimitiveType | Enumeration;

@Glsp.toolPalette({
    section: 'Feature',
    label: 'Property',
    icon: 'uml-property-icon'
})
@Glsp.noBounds
// Named and typed straight from the list its owner shows, without navigating to the property itself.
@PropertyPalette.inlineFields('name', 'propertyType', 'multiplicity')
export class Property extends Unbounded {
    name: string;
    isDerived?: boolean = false;
    isOrdered?: boolean = false;
    isStatic?: boolean = false;
    isDerivedUnion?: boolean = false;
    isReadOnly?: boolean = false;
    isNavigable?: boolean = false;
    isUnique?: boolean = false;
    visibility?: Visibility = 'NONE';
    @Language.multiplicity multiplicity?: string;
    // The type is one of two things, never both: a type of the model (`propertyTypeRef`), which follows
    // the element when it is renamed, or the name someone typed (`propertyType`) - `String`, `List<Foo>`,
    // anything the model does not declare, which is everything on a diagram that declares no types at
    // all. Both are written from the one "type" the palette and the canvas show: what is typed becomes
    // the reference when it names exactly one type of the model, and stays text otherwise (see
    // `TypedElementExtension`).
    @Language.text propertyType?: string;
    @Language.reference propertyTypeRef?: Classifier;
    aggregation?: AggregationType;
}
