/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type Multiplicity } from "./multiplicity.js";
import { type Type } from "./types.js";

export interface Property {
  name: string;
  isOptional: boolean;
  decorators: string[];
  types: Type[];
  multiplicity: Multiplicity;
  defaultValue?: any;
}
