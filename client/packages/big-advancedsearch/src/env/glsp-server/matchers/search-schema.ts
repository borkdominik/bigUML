/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { SearchFilterSpec } from '../../common/search-filter-spec.js';
import { FILTER_SPECS } from '../../common/search-filter-spec.js';
import type { SearchElementType } from './search-ast.js';

export { FILTER_SPECS };
export type { SearchFilterSpec };

export function findFilterSpec(scope: SearchElementType, key: string): SearchFilterSpec | undefined {
    const normalizedKey = key.toLowerCase();

    return FILTER_SPECS.find(spec => {
        const names = [spec.key, ...(spec.aliases ?? [])].map(value => value.toLowerCase());
        return spec.scopes.includes(scope) && names.includes(normalizedKey);
    });
}
