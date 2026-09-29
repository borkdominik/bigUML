/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

// What a multiplicity is, as the language tooling defines it. Which properties hold one is declared in
// the definitions with `@Language.multiplicity`, and generated into `isMultiplicityProperty` of
// `@borkdominik-biguml/uml-model-server/validation`.
export {
    isStorableMultiplicity,
    isValidMultiplicity,
    MULTIPLICITY_FORMAT_MESSAGE,
    sanitizeMultiplicity
} from '@borkdominik-biguml/uml-language-tooling/values';
