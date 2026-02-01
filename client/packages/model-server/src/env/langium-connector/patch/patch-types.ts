/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import * as jsonPatch from 'fast-json-patch';
import type { Reference } from 'langium';
import type { IntermediatePatchReference } from './patch-manager.util.js';

export { jsonPatch };

// TODO: Move to common
type ReplaceType<T, From, To> = T extends unknown ? { [K in keyof T]: T[K] extends From ? To : T[K] } : never;

export type SerializedPatchValue<T> = T extends unknown
    ? Omit<ReplaceType<T, Reference<any>, IntermediatePatchReference>, '$container'>
    : never;
