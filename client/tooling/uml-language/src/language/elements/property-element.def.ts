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
import { Unbounded, type Visibility } from '../core/element.def.js';

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
    @Language.text multiplicity?: string;
    // Written out rather than picked from the types the document happens to declare. The dropdown this
    // replaces was filled from `getAllDataTypes()`, which walks the open document only - so a property on
    // an activity had nothing to choose from at all, there being no `DataType` on an activity diagram.
    // Free text costs the link to a `DataType` element: a type is now the name someone typed, and
    // renaming the element it happens to match no longer follows through to the properties using it.
    @Language.text propertyType?: string;
    aggregation?: AggregationType;
}
