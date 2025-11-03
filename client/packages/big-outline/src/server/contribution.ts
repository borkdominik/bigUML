/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { type ModelManagementContribution } from '@borkdominik-biguml/model-common';
import { writeRequestOutlineActionHandlers } from './generator.js';

export const OutlineContribution: ModelManagementContribution = {
    codeGeneration: ({ langiumDeclarations, glspRoot }) => {
        return writeRequestOutlineActionHandlers(glspRoot, langiumDeclarations);
    }
};
