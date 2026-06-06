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
import type { AggregationType } from './property-element.def.js';
import { Association } from './association-element.def.js';

// @ts-nocheck

@Glsp.toolPalette({
    section: 'Relations',
    label: 'Aggregation',
    icon: 'uml-association-shared-icon'
})
@Glsp.defaults
@Glsp.alias('Association')
export class Aggregation extends Association {
    override sourceAggregation?: AggregationType = 'SHARED';
}
