/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type Property } from "./property.js";

export interface Declaration {
  type: "class" | "type";
  name?: string;
  isAbstract?: boolean;
  decorators?: string[];
  properties?: Array<Property>;
  extends?: string[];
}

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
