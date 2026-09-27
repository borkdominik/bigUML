/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { SearchCriteria } from './search-ast.js';

/**
 * Extracts the value of the first `name` filter on the ROOT criteria, e.g.
 * `Class[name~"User"]` → `User`. Results returned by `matchAdvanced` are the
 * elements matching the root criteria (hierarchical parts like `> Attribute`
 * only constrain them), so the root's name filter is the string the matched
 * results' names actually contain — which makes it the natural find pattern
 * for the replace UI.
 *
 * Returns undefined when the query has no string-valued `name` filter.
 */
export function extractNameFindPattern(criteria: SearchCriteria): string | undefined {
    for (const filter of criteria.filters) {
        if (filter.key === 'name' && filter.value.type === 'string') {
            return filter.value.value;
        }
    }
    return undefined;
}
