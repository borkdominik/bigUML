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
import type { Parameter } from './parameter-element.def.js';

// @ts-nocheck

export type Concurrency = 'SEQUENTIAL' | 'GUARDED' | 'CONCURRENT';

@Glsp.toolPalette({
    section: 'Feature',
    label: 'Operation',
    icon: 'uml-operation-icon'
})
@Glsp.defaults
export class Operation extends Node {
    name: string;
    isAbstract?: boolean;
    isStatic?: boolean;
    isQuery?: boolean;
    visibility?: Visibility;
    concurrency?: Concurrency;
    parameters?: Array<Parameter>;
}
