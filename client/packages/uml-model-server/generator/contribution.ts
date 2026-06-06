/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import type { GeneratorContext, GeneratorResult } from '@borkdominik-biguml/uml-language-tooling';
import path from 'path';
import { transformDeclarationsToLangiumGrammar } from './builder/grammar-transformer.js';
import { renderDiagramSerializer } from './render/diagram-serializer.renderer.js';
import { renderLangiumText } from './render/langium.renderer.js';
import { renderValidation } from './render/validation.renderer.js';

export function generate({ outputPath, declarations, definitionPath }: GeneratorContext): GeneratorResult {
    const results: { path: string; content: string }[] = [];

    const generatorConfig = { referenceProperty: '__id' };
    const languageId = 'uml-diagram';
    const languageName = 'UmlDiagram';

    const langiumGrammar = transformDeclarationsToLangiumGrammar(declarations, generatorConfig);

    const grammarText = renderLangiumText(langiumGrammar, languageId, languageName);
    results.push({
        path: path.join(outputPath, 'langium', `${languageId}.langium`),
        content: grammarText
    });

    const serializerText = renderDiagramSerializer(langiumGrammar, languageId, languageName, generatorConfig);
    results.push({
        path: path.join(outputPath, 'langium', `${languageId}-serializer.ts`),
        content: serializerText
    });

    const validationFiles = renderValidation(outputPath, definitionPath);
    results.push(...validationFiles);

    // Langium CLI generates additional files (ast.ts, grammar.ts, module.ts) after this generator runs.
    // Declare them so the tooling includes them in per-env index.ts barrel files.
    const additionalIndexPaths = ['ast.ts', 'grammar.ts', 'module.ts'].map(f => path.join(outputPath, 'langium', 'language', f));

    return { files: results, additionalIndexPaths };
}
