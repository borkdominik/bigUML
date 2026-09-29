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
import type { Classifier } from './property-element.def.js';

// @ts-nocheck

export type ParameterDirection = 'IN' | 'OUT' | 'INOUT' | 'RETURN';
export type EffectType = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';

@Glsp.noBounds
@Glsp.defaults
export class Parameter extends Unbounded {
    // UML lets a parameter go unnamed; the operation's signature then shows only its type.
    name?: string;
    isException?: boolean;
    isStream?: boolean;
    isOrdered?: boolean;
    isUnique?: boolean;
    direction?: ParameterDirection;
    effect?: EffectType;
    visibility?: Visibility;
    // A type of the model or a typed name, the way a property's type is - see `Property.propertyType`.
    @Language.text parameterType?: string;
    @Language.reference parameterTypeRef?: Classifier;
    @Language.multiplicity multiplicity?: string;
}
