/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

export interface LangiumDeclaration {
  type: "class" | "type";
  name?: string;
  isAbstract?: boolean;
  decorators?: string[];
  properties?: Array<Property>;
  extends?: string[];
  extra?: any;
  extendedBy?: string[];
}

interface Property {
  name: string;
  isOptional: boolean;
  decorators: string[];
  types: Type[];
  multiplicity: Multiplicity;
  defaultValue?: any;
}

interface Type {
  type: "constant" | "simple" | "complex";
  typeName: string;
}

enum Multiplicity {
  ZERO_TO_N = "*",
  ONE_TO_N = "+",
  ONE_TO_ONE = "1",
}
