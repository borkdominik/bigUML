/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import type { LangiumDeclaration } from '@borkdominik-biguml/uml-language-tooling';
import { Eta } from 'eta';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const eta = new Eta({ views: path.join(__dirname, 'templates') });

// ============================================================================
// Types
// ============================================================================

interface DiagramLanguageMetadataTemplateData {
    diagramName: string;
    modelTypesFileName: string;
}

// ============================================================================
// Main entry point
// ============================================================================

export function buildDiagramLanguageMetadata(
    extensionPath: string,
    declarations: LangiumDeclaration[]
): { path: string; content: string }[] {
    const results: { path: string; content: string }[] = [];

    const diagramDecls = declarations.filter(d => d.type === 'class' && d.name !== 'Diagram' && d.name?.endsWith('Diagram'));

    for (const diagramDecl of diagramDecls) {
        const diagramName = diagramDecl.name!.replace(/Diagram$/, '');

        const data: DiagramLanguageMetadataTemplateData = {
            diagramName,
            modelTypesFileName: `${toKebab(diagramName)}-diagram-model-types`
        };

        const content = eta.render('./diagram-language-metadata', data);

        const outDir = path.join(extensionPath, 'vscode', 'diagram', toKebab(diagramName));
        const fileName = `${toKebab(diagramName)}-diagram-language-metadata.ts`;
        results.push({ path: path.join(outDir, fileName), content });
    }

    return results;
}

// ============================================================================
// Helpers
// ============================================================================

const WORD_BREAK = /([a-z0-9])([A-Z])/g;
const toKebab = (s: string) => s.replace(WORD_BREAK, '$1-$2').toLowerCase();
