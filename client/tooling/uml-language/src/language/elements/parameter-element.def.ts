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

export type ParameterDirection = 'IN' | 'OUT' | 'INOUT' | 'RETURN';
export type EffectType = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';

@Glsp.noBounds
@Glsp.defaults
export class Parameter extends Unbounded {
    name: string;
    isException?: boolean;
    isStream?: boolean;
    isOrdered?: boolean;
    isUnique?: boolean;
    direction?: ParameterDirection;
    effect?: EffectType;
    visibility?: Visibility;
    // Typed in rather than picked, the way a property's type is - see `Property.propertyType` for what
    // the dropdown could not offer and what the link to a `DataType` element cost to give up.
    @Language.text parameterType?: string;
    @Language.text multiplicity?: string;
}
