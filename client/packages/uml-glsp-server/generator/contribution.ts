/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import type { UmlToolingContributionResult } from '@borkdominik-biguml/uml-language-tooling';
import { type LangiumDeclaration } from '@borkdominik-biguml/uml-language-tooling';
import { buildCreationPath } from './creation-path-generator.js';
import { buildDefaultValue } from './default-value-generator.js';
import { buildDiagramLanguageMetadata } from './diagram-language-metadata-generator.js';
import { buildModelTypes } from './model-types-generator.js';
import { buildToolPaletteItemProvider } from './tool-palette-generator.js';

export function umlToolingContribution(extensionPath: string, declarations: LangiumDeclaration[]): UmlToolingContributionResult {
    const results: { path: string; content: string }[] = [];

    results.push(...buildCreationPath(extensionPath, declarations));
    results.push(...buildDefaultValue(extensionPath, declarations));
    results.push(...buildModelTypes(extensionPath, declarations));
    results.push(...buildDiagramLanguageMetadata(extensionPath, declarations));
    results.push(...buildToolPaletteItemProvider(extensionPath, declarations));

    return { files: results };
}
