/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { SearchResult } from '../../common/searchresult.js';
import type { IMatcher } from './IMatcher.js';

// Use case diagram does not yet have a Langium grammar.
export class UseCaseDiagramMatcher implements IMatcher {
    supports(_type: string): boolean {
        return false;
    }

    match(_diagram: any): SearchResult[] {
        return [];
    }
}
