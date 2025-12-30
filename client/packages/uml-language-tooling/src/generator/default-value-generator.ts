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

interface DefaultMappingEntry {
    property: string;
    propertyType: string;
    defaultValue?: any;
}

type DefaultMapping = Record<string, DefaultMappingEntry[]>;

export function buildDefaultValueMapping(langiumDeclarations: LangiumDeclaration[]): {
    defaultMapping: DefaultMapping;
    noBoundsClasses: string[];
    astTypeMap: Record<string, string>;
} {
    const mapping: DefaultMapping = {};
    const noBoundsClasses: string[] = [];
    // maps lower-cased class name → astType value
    const astTypeMap: Record<string, string> = {};

    for (const decl of langiumDeclarations) {
        // collect any @noBounds
        if (decl.decorators?.includes('noBounds')) {
            noBoundsClasses.push(decl.name!);
        }

        // collect any @astType("...") decorator on the class
        for (const deco of decl.decorators ?? []) {
            const [key, ...rest] = deco.split(':');
            if (key === 'astType' && rest.length > 0) {
                const value = rest.join(':');
                astTypeMap[decl.name!.toLowerCase()] = value;
            }
        }

        if (decl.type !== 'class' || !decl.name || !decl.properties) {
            continue;
        }

        const withDefaultAll = decl.decorators?.includes('withDefaults');
        const seen = new Set<string>();
        const entries: DefaultMappingEntry[] = [];

        for (const prop of decl.properties) {
            if (seen.has(prop.name)) {
                continue;
            }
            seen.add(prop.name);

            // if class isn't @withDefaults, skip optional props without an explicit default
            if (!withDefaultAll && prop.isOptional && prop.defaultValue === undefined) {
                continue;
            }

            const firstType = prop.types[0];
            if (!firstType) {
                continue;
            }

            const entry: DefaultMappingEntry = {
                property: prop.name,
                propertyType: firstType.typeName
            };
            if (prop.defaultValue !== undefined) {
                entry.defaultValue = prop.defaultValue;
            }

            entries.push(entry);
        }

        mapping[decl.name] = entries;
    }

    return {
        defaultMapping: mapping,
        noBoundsClasses,
        astTypeMap
    };
}

export async function writeDefaultValueFile(
    extensionPath: string,
    payload: {
        defaultMapping: DefaultMapping;
        noBoundsClasses: string[];
        astTypeMap: Record<string, string>;
    }
): Promise<void> {
    const rawContent = `// THIS FILE IS GENERATED — DO NOT EDIT

interface DefaultMappingEntry {
  property: string;
  propertyType: string;
  defaultValue?: any;
}

const defaultMapping: Record<string, DefaultMappingEntry[]> = ${JSON.stringify(payload.defaultMapping, null, 2)};

export const noBoundsClasses = new Set<string>(
  ${JSON.stringify(payload.noBoundsClasses, null, 2)}
);

export const astTypeMapping: Record<string, string> = ${JSON.stringify(payload.astTypeMap, null, 2)};

export function isNoBounds(typeId: string): boolean {
  return noBoundsClasses.has(stripPrefix(typeId));
}

export function getProperties(elementTypeId: string): DefaultMappingEntry[] {
    const parentType = elementTypeId.startsWith('edge')
        ? (() => {
              const s = getRelationTypeFromElementId(elementTypeId, true).toLowerCase();
              return s.charAt(0).toUpperCase() + s.slice(1);
          })()
        : stripPrefix(elementTypeId);
    const entries = defaultMapping[parentType] || [];
    return entries.reduce((acc, e) => {
        if (e.defaultValue !== undefined) {
            if (e.defaultValue === '[]') {
                acc.push({ ...e, defaultValue: [] });
            } else {
                acc.push(e);
            }
            return acc;
        }

    switch (e.propertyType) {
      case 'string':
        return acc;
      case 'boolean':
        acc.push({ ...e, defaultValue: false });
        return acc;
      case 'number':
        acc.push({ ...e, defaultValue: 0 });
        return acc;
      case 'Visibility':
        acc.push({ ...e, defaultValue: 'PUBLIC' });
        return acc;
      case 'Concurrency':
        acc.push({ ...e, defaultValue: 'SEQUENTIAL' });
        return acc;
      default:
        acc.push({ ...e, defaultValue: [] });
        return acc;
    }
  }, [] as DefaultMappingEntry[]);
}

function stripPrefix(name: string): string {
  return name.replace(/^.*?__/, '');
}

/**
 * Returns the UPPER_CASE relation type identifier when upperCase is true,
 * otherwise returns the AST edge type name for use in the model.
 */
export function getRelationTypeFromElementId(
  elementTypeId: string,
  upperCase: boolean
): string {
  const withoutPrefix = elementTypeId.replace(/^.*?__/, '');
  const head = withoutPrefix.split('__')[0];

  if (upperCase) {
    const withUnderscore = head.replace(/([a-z])([A-Z])/g, '$1_$2');
    return withUnderscore.toUpperCase();
  } else {
    const candidate = head.charAt(0).toUpperCase() + head.slice(1);
    const lookup = candidate.toLowerCase();
    if (astTypeMapping[lookup]) {
      return astTypeMapping[lookup];
    }
    return candidate;
  }
}
`;

    const content = await format(rawContent);

    const outputFolder = path.join(extensionPath);
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true });
    }
    const filePath = path.join(outputFolder, 'getDefaultValue.ts');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Generated getDefaultValue file: ${filePath}`);
}
