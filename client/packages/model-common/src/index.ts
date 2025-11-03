/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { type LangiumDeclaration } from "./types.js";
export * from "./types.js";

export interface ModelManagementContribution {
  codeGeneration: (options: {
    langiumDeclarations: LangiumDeclaration[];
    glspRoot: string;
  }) => { path: string; content: string }[];
}
