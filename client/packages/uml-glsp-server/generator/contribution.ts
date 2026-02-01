/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { type LangiumDeclaration } from '@borkdominik-biguml/uml-language-tooling';
import path from 'path';
import { buildCreationPathMapping, writeCreationPathFile } from './creation-path-generator.js';
import { buildDefaultValueMapping, writeDefaultValueFile } from './default-value-generator.js';

export function umlToolingContribution(extensionPath: string, declarations: LangiumDeclaration[]): { path: string; content: string }[] {
    const results: { path: string; content: string }[] = [];

    const glspRoot = path.join(extensionPath, 'vscode');

    const creationPathMapping = buildCreationPathMapping(declarations);
    const creationPathContent = writeCreationPathFile(creationPathMapping);
    results.push({ path: path.join(glspRoot, 'getCreationPath.ts'), content: creationPathContent });

    const defaultMapping = buildDefaultValueMapping(declarations);
    const defaultValueContent = writeDefaultValueFile(defaultMapping);
    results.push({ path: path.join(glspRoot, 'getDefaultValue.ts'), content: defaultValueContent });

    return results;
}
