/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import type { GeneratorContext, GeneratorResult } from '@borkdominik-biguml/uml-language-tooling';
import { renderDiagramRegistry } from './render/diagram-registry.renderer.js';
import { renderElementMetadata } from './render/element-metadata.renderer.js';
import { renderModelTypes } from './render/model-types.renderer.js';
import { renderToolPaletteItemProvider } from './render/tool-palette.renderer.js';

export function generate({ outputPath, declarations }: GeneratorContext): GeneratorResult {
    const results: { path: string; content: string }[] = [];

    results.push(...renderElementMetadata(outputPath, declarations));
    results.push(...renderDiagramRegistry(outputPath, declarations));
    results.push(...renderModelTypes(outputPath, declarations));
    results.push(...renderToolPaletteItemProvider(outputPath, declarations));

    return { files: results };
}
