/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { type Declaration, lcFirst } from '@borkdominik-biguml/uml-language-tooling';
import { Eta } from 'eta';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildPropertyDescriptor, type PropertyDescriptor } from '../builder/property-descriptor.builder.js';
import { getDiagramForElement, getDynamicPropertyTypes } from '../utils/declaration.utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const eta = new Eta({ views: path.join(__dirname, '..', 'templates') });

export function renderElementHandler(decl: Declaration, declarations: Declaration[]): string {
    const name = decl.name!;
    const diagramName = getDiagramForElement(name, declarations);

    const dynamicTypes = getDynamicPropertyTypes(decl);

    const sigExtras = dynamicTypes.map(t => `, ${lcFirst(t)}Choices: any`).join('');

    const properties = (decl.properties ?? [])
        .map(p => buildPropertyDescriptor(p, declarations, diagramName))
        .filter((p): p is PropertyDescriptor => p !== undefined);

    const needsGlspImport = properties.some(p => p.type === 'reference');
    const hasCreateOperations = properties.some(p => p.type === 'reference' && p.createsExpr && p.createsExpr !== '[]');
    const needsPropertyPaletteChoices = properties.some(p => p.type === 'choice' && p.choicesExpr?.startsWith('PropertyPaletteChoices.'));

    const componentImports = new Set<string>(['PropertyPalette']);
    for (const prop of properties) {
        if (prop.type === 'text') componentImports.add('TextProperty');
        else if (prop.type === 'bool') componentImports.add('BoolProperty');
        else if (prop.type === 'choice') componentImports.add('ChoiceProperty');
        else if (prop.type === 'reference') componentImports.add('ReferenceProperty');
    }
    if (needsPropertyPaletteChoices) componentImports.add('PropertyPaletteChoices');

    return eta.render('./element-property-palette-handler', {
        name,
        sigExtras,
        properties,
        needsGlspImport,
        hasCreateOperations,
        componentImports: Array.from(componentImports).sort()
    });
}
