/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import type { GeneratorContext, GeneratorResult } from '@borkdominik-biguml/uml-language-tooling';
import { toKebab } from '@borkdominik-biguml/uml-language-tooling';
import fs from 'fs';
import path from 'path';
import { renderElementHandler } from './render/element-handler.renderer.js';
import { renderRequestHandler } from './render/request-handler.renderer.js';
import { getNodeDecls } from './utils/declaration.utils.js';

const prefixPath = ['glsp-server', 'handlers'];

export function generate({ outputPath, declarations }: GeneratorContext): GeneratorResult {
    const results: { path: string; content: string }[] = [];

    const elemsOut = path.join(outputPath, ...prefixPath, 'elements');
    if (!fs.existsSync(elemsOut)) fs.mkdirSync(elemsOut, { recursive: true });

    const nodes = getNodeDecls(declarations);
    for (const decl of nodes) {
        const fp = path.join(elemsOut, `${toKebab(decl.name!)}.property-palette-handler.tsx`);
        const content = renderElementHandler(decl, declarations);
        results.push({ path: fp, content });
    }

    const requestFiles = renderRequestHandler(outputPath, declarations);
    results.push(...requestFiles);

    return { files: results };
}
