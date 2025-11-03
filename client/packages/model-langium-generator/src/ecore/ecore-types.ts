/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
export interface EcoreDefinition {
  classes: EcoreClass[];
  dataTypes: string[];
  types: EcoreType[];
}
export interface EcoreClass {
  attributes: EcoreAttribute[];
  extends: string[];
  instanceClassName?: string;
  instanceTypeName?: string;
  isAbstract: boolean;
  isInterface: boolean;
  isRoot: boolean;
  name: string;
}
export interface EcoreAttribute {
  changeable?: boolean;
  containment?: boolean;
  defaultValueLiteral?: string;
  derived: boolean;
  ID?: string;
  lowerBound: string;
  multiplicity: string;
  name: string;
  ordered?: boolean;
  reference: boolean;
  transient: boolean;
  type: string;
  unique?: boolean;
  unsettable: boolean;
  upperBound: string;
  volatile: boolean;
}
export interface EcoreType {
  name: string;
  types: string[];
}
