/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { type Declaration, getDiagramDeclarations, toKebab } from '@borkdominik-biguml/uml-language-tooling';
import { Eta } from 'eta';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const eta = new Eta({ views: path.join(__dirname, '..', 'templates') });

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

export function renderDiagramLanguageMetadata(extensionPath: string, declarations: Declaration[]): { path: string; content: string }[] {
    const results: { path: string; content: string }[] = [];

    const diagramDecls = getDiagramDeclarations(declarations);

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
