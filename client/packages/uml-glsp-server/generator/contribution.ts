/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import type { GeneratorContext, GeneratorResult } from '@borkdominik-biguml/uml-language-tooling';
import { renderCreationPath } from './render/creation-path.renderer.js';
import { renderDefaultValue } from './render/default-value.renderer.js';
import { renderDiagramLanguageMetadata } from './render/diagram-language-metadata.renderer.js';
import { renderEmptyDiagram } from './render/empty-diagram.renderer.js';
import { renderModelTypes } from './render/model-types.renderer.js';
import { renderToolPaletteItemProvider } from './render/tool-palette.renderer.js';

export function generate({ outputPath, declarations }: GeneratorContext): GeneratorResult {
    const results: { path: string; content: string }[] = [];

    results.push(...renderCreationPath(outputPath, declarations));
    results.push(...renderDefaultValue(outputPath, declarations));
    results.push(...renderEmptyDiagram(outputPath, declarations));
    results.push(...renderModelTypes(outputPath, declarations));
    results.push(...renderDiagramLanguageMetadata(outputPath, declarations));
    results.push(...renderToolPaletteItemProvider(outputPath, declarations));

    return { files: results };
}
