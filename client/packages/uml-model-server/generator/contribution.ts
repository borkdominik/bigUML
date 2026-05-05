/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import type { UmlToolingContributionResult } from '@borkdominik-biguml/uml-language-tooling';
import { type LangiumDeclaration, transformLangiumDeclarationsToLangiumGrammar } from '@borkdominik-biguml/uml-language-tooling';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateLangiumText } from './langium-generator.js';
import { generateSerializer } from './serializer-generator.js';
import { buildValidationFiles } from './validation-generator.js';

export function umlToolingContribution(extensionPath: string, declarations: LangiumDeclaration[]): UmlToolingContributionResult {
    const results: { path: string; content: string }[] = [];

    const generatorConfig = { referenceProperty: '__id' };
    const languageId = 'uml-diagram';
    const languageName = 'UmlDiagram';

    const langiumGrammar = transformLangiumDeclarationsToLangiumGrammar(declarations, generatorConfig);

    const grammarText = generateLangiumText(langiumGrammar, languageId, languageName);
    results.push({
        path: path.join(extensionPath, 'langium', `${languageId}.langium`),
        content: grammarText
    });

    const serializerText = generateSerializer(langiumGrammar, languageId, languageName, generatorConfig);
    results.push({
        path: path.join(extensionPath, 'langium', `${languageId}-serializer.ts`),
        content: serializerText
    });

    const defPath = fileURLToPath(import.meta.resolve('@borkdominik-biguml/uml-language/definition'));
    const validationFiles = buildValidationFiles(extensionPath, defPath);
    results.push(...validationFiles);

    // Langium CLI generates additional files (ast.ts, grammar.ts, module.ts) after this generator runs.
    // Declare them so the tooling includes them in per-env index.ts barrel files.
    const additionalIndexPaths = ['ast.ts', 'grammar.ts', 'module.ts'].map(f => path.join(extensionPath, 'langium', 'language', f));

    return { files: results, additionalIndexPaths };
}
