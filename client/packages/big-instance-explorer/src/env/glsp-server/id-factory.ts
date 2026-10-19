/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { randomUUID } from 'node:crypto';

/** Creates the id of a new element from its AST type, e.g. `Slot_<uuid>`. */
export type IdFactory = (type: string) => string;

/** The id format of the model server (`createRandomUUID`), without depending on it, so the cores stay pure. */
export const defaultIdFactory: IdFactory = type => `${type}_${randomUUID()}`;
