/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import fs from 'fs';
import path from 'path';
import { type LangiumDeclaration } from '../types/index.js';
import { format } from '../util.js';

export function buildCreationPathMapping(
    langiumDeclarations: Array<LangiumDeclaration>
): Record<string, Array<{ property: string; allowedChildTypes?: string[] }>> {
    const mapping: Record<string, Array<{ property: string; allowedChildTypes?: string[] }>> = {};

    langiumDeclarations.forEach(parentDecl => {
        if (!parentDecl.properties) return;
        parentDecl.properties.forEach(prop => {
            if (prop.decorators && prop.decorators.includes('path')) {
                if (!mapping[parentDecl.name!]) {
                    mapping[parentDecl.name!] = [];
                }
                const allowedType = prop.types[0].typeName;
                let allowedChildTypes = langiumDeclarations
                    .filter(childDecl => childDecl.extends && childDecl.extends.includes(allowedType))
                    .map(childDecl => childDecl.name);
                if (allowedChildTypes.length === 0) {
                    allowedChildTypes = [allowedType];
                }
                mapping[parentDecl.name!].push({
                    property: prop.name,
                    allowedChildTypes: allowedChildTypes as any
                });
            }
        });
    });
    return mapping;
}

export async function writeCreationPathFile(
    extensionPath: string,
    mapping: Record<string, Array<{ property: string; allowedChildTypes?: string[] }>>
): Promise<void> {
    const rawContent = `
const mapping: Record<string, Array<{ property: string; allowedChildTypes?: string[] }>> = ${JSON.stringify(mapping, null, 2)};

function stripPrefix(name: string): string {
  return name.replace(/^.*?__/, '');
}

function pluralise(type: string): string {
  return type.endsWith('y') ? type.slice(0, -1) + 'ies' : type + 's';
}

export function getCreationPath(parentType: string, childType: string): string | undefined {
  const parentKey = stripPrefix(parentType);
  const childKey = stripPrefix(childType);

  if (mapping[parentKey]) {
    console.log('parentKey ', parentKey);
    for (const entry of mapping[parentKey]) {
      if (entry.allowedChildTypes && entry.allowedChildTypes.includes(childKey)) {
        return entry.property;
      }
    }
  }
  return undefined;
}
`;

    const content = await format(rawContent);

    const outputFolder = path.join(extensionPath);
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true });
    }
    const filePath = path.join(outputFolder, 'getCreationPath.ts');
    fs.writeFileSync(filePath, content, { encoding: 'utf8' });
    console.log(`Generated getCreationPath file: ${filePath}`);
}
