/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { ClassDiagram } from '../../../../../uml-model-server/build/gen/langium/language/ast.js';
import type { SearchResult } from '../../common/searchresult.js';
import type { SearchCriteria } from './search-ast.js';

export interface IMatcher {
    supports(type: string): boolean;
    supportsPartial(partialType: string): boolean;
    supportsList(): string[];

    match(diagram: unknown): SearchResult[];

    matchAdvanced?(diagram: ClassDiagram, criteria: SearchCriteria): SearchResult[];
}