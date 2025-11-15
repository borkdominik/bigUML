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

export interface LangiumGrammar {
  entryRule: EntryRule;
  typeRules: Array<TypeRule>;
  parserRules: Array<ParserRule>;
}
export interface EntryRule {
  name: string;
  definitions: Array<Definition>;
}
export interface TypeRule {
  name: string;
  definitions: Array<Type>;
  extra?: { path?: string };
}
export interface ParserRule {
  name: string;
  isAbstract: boolean;
  extendedBy: string[];
  definitions: Array<Definition>;
}
export interface Definition {
  name: string;
  types?: Type[];
  type?: Type;
  multiplicity: Multiplicity;
  crossReference: boolean;
  optional: boolean;
}
