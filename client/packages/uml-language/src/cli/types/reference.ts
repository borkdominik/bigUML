/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
export interface CrossReference<T> {
  /** the type of the referenced element */
  type: T;
  /** the document uri of the referenced element */
  __documentUri?: string;
  /** the path to the referenced element in the given document uri */
  __path?: string;
  /** the id of the referenced element */
  [ref: string]: string | T | undefined;
}
