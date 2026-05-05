/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { compact, flatMap, keys, pickBy } from 'lodash';

/**
 * A utility function that takes a variable number of arguments and returns a string
 * containing all the truthy class names.
 *
 * @param classes - A variable number of arguments that can be strings or objects.
 * @returns A string containing all the truthy class names.
 *
 * @example
 * classNames('class1', { 'class2': true, 'class3': false }, null, undefined);
 * // Returns: 'class1 class2'
 */
export function classNames(...classes: (string | Record<string, boolean> | undefined | null)[]): string {
    return compact(flatMap(classes, c => (typeof c === 'string' ? c : keys(pickBy(c))))).join(' ');
}
