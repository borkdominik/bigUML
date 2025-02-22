/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { compact, flatMap, keys, pickBy } from 'lodash';

export function classNames(...classes: (string | Record<string, boolean> | undefined | null)[]): string {
    return compact(flatMap(classes, c => (typeof c === 'string' ? c : keys(pickBy(c))))).join(' ');
}
