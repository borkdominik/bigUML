/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type LangiumDeclaration, type ModelManagementContribution } from '@borkdominik-biguml/model-common';
import fs from 'fs';
import path from 'path';
import { format } from '../util.js';

export class GeneratorRegistry {
    private contributions: ModelManagementContribution[] = [];

    register(contribution: ModelManagementContribution): void {
        this.contributions.push(contribution);
    }

    async execute(glspRoot: string, langiumDeclarations: LangiumDeclaration[]): Promise<void> {
        for (const contribution of this.contributions) {
            const results = contribution.codeGeneration({
                langiumDeclarations,
                glspRoot
            });
            for (const { path: filePath, content } of results) {
                const formatted = await format(content);
                fs.mkdirSync(path.dirname(filePath), { recursive: true });
                fs.writeFileSync(filePath, formatted, 'utf8');
                console.log(`Generated: ${filePath}`);
            }
        }
    }
}
