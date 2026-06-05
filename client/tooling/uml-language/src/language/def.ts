/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Language } from '@borkdominik-biguml/uml-language-tooling';
import 'reflect-metadata';
import type { ClassDiagram } from './class-diagram.def.js';
import type { MetaInfo } from './element.def.js';

// @ts-nocheck

@Language.root
export class Diagram {
    diagram: ClassDiagram;
    metaInfos?: Array<MetaInfo>;
}
