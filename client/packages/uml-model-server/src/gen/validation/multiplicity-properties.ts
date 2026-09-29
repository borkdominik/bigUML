// AUTO-GENERATED – DO NOT EDIT
/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

/** The properties of each element type the definitions mark `@Language.multiplicity`. */
export const MULTIPLICITY_PROPERTIES: Readonly<Record<string, readonly string[]>> = {
    Association: ['sourceMultiplicity', 'targetMultiplicity'],
    GenericEdge: ['sourceMultiplicity', 'targetMultiplicity'],
    Parameter: ['multiplicity'],
    Property: ['multiplicity']
};

/** Whether `property` of an element of `astType` holds a multiplicity. */
export function isMultiplicityProperty(astType: string | undefined, property: string): boolean {
    return astType !== undefined && (MULTIPLICITY_PROPERTIES[astType]?.includes(property) ?? false);
}
