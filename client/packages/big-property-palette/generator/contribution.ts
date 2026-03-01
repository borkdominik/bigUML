/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { type LangiumDeclaration, type Property } from '@borkdominik-biguml/uml-language-tooling';
import { Eta } from 'eta';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prefixPath = ['glsp-server', 'handlers'];

const eta = new Eta({ views: path.join(__dirname, 'templates') });

// ============================================================================
// Property descriptor — structured data passed to Eta templates
// ============================================================================

interface PropertyDescriptor {
    type: 'text' | 'bool' | 'choice' | 'reference';
    id: string;
    label: string;
    /** Expression string for text/bool value */
    valueExpr?: string;
    /** Expression string for choices array (choice type) */
    choicesExpr?: string;
    /** Expression string for current choice value */
    choiceExpr?: string;
    /** Expression string for reference array */
    referencesExpr?: string;
    /** Expression string for create actions array */
    createsExpr?: string;
}

// ============================================================================
// Main entry point
// ============================================================================

export function umlToolingContribution(extensionPath: string, declarations: LangiumDeclaration[]): { path: string; content: string }[] {
    const results: { path: string; content: string }[] = [];

    const elemsOut = path.join(extensionPath, ...prefixPath, 'elements');
    if (!fs.existsSync(elemsOut)) fs.mkdirSync(elemsOut, { recursive: true });

    const nodes = getNodeDecls(declarations);
    for (const decl of nodes) {
        const fp = path.join(elemsOut, `${toKebab(decl.name!)}.property-palette-handler.tsx`);
        const content = renderHandler(decl);
        results.push({ path: fp, content });
    }

    const requestFiles = renderRequestHandlers(extensionPath, declarations);
    results.push(...requestFiles);

    return results;
}

// ============================================================================
// Filter node declarations
// ============================================================================

function getNodeDecls(decls: LangiumDeclaration[]): LangiumDeclaration[] {
    return decls.filter(
        d =>
            d.type === 'class' &&
            !d.isAbstract &&
            d.name !== 'Diagram' &&
            !d.name!.endsWith('Diagram') &&
            (d.extends ?? []).every(e => e !== 'Relation') &&
            d.name !== 'Relation' &&
            d.name !== 'Entity' &&
            d.name !== 'ElementWithSizeAndPosition' &&
            !(d.extends ?? []).includes('MetaInfo')
    );
}

// ============================================================================
// Render individual element handlers (JSX)
// ============================================================================

function renderHandler(decl: LangiumDeclaration): string {
    const name = decl.name!;

    const dynamicTypes = Array.from(
        new Set(
            decl.properties?.flatMap(p => p.decorators?.filter(d => d.startsWith('dynamicProperty:')).map(d => d.split(':')[1]) ?? []) ?? []
        )
    );

    const sigExtras = dynamicTypes.map(t => `, ${lcFirst(t)}Choices: any`).join('');

    const properties = (decl.properties ?? []).map(p => buildPropertyDescriptor(p)).filter((p): p is PropertyDescriptor => p !== undefined);

    const needsGlspImport = properties.some(p => p.type === 'reference');
    const needsModelTypes = properties.some(p => p.type === 'reference');
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
        needsModelTypes,
        componentImports: Array.from(componentImports).sort()
    });
}

// ============================================================================
// Build a property descriptor from a declaration property
// ============================================================================

function buildPropertyDescriptor(prop: Property): PropertyDescriptor | undefined {
    if (prop.decorators?.includes('skipPropertyPP')) return;

    const dyn = prop.decorators?.find((d: string) => d.startsWith('dynamicProperty:'));
    if (dyn) {
        const typeName = dyn.split(':')[1];
        const choicesVar = `${lcFirst(typeName)}Choices`;
        return {
            type: 'choice',
            id: prop.name,
            label: human(prop.name),
            choicesExpr: choicesVar,
            choiceExpr: `(semanticElement.${prop.name} as any)?.ref?.__id ? (semanticElement.${prop.name} as any).ref.__id + '_refValue' : ''`
        };
    }

    if (prop.decorators?.includes('crossReference')) return;
    if (prop.types?.[0]?.type === 'constant') return;
    if (prop.name === 'entities') return;

    const id = prop.name;
    const first = prop.types?.[0];
    const mult = prop.multiplicity;

    if (mult === '*') {
        const typeName = first?.typeName ?? 'Element';
        const modelConst = toConst(typeName);
        const label = human(typeName);
        return {
            type: 'reference',
            id,
            label: human(id),
            referencesExpr: [
                `(semanticElement.${id} ?? [])`,
                `.filter((e: any) => !!e && !!e.__id)`,
                `.map((e: any) => ({`,
                `    elementId: e.__id,`,
                `    label: e.name ?? '(unnamed ${toConst(typeName).toLowerCase()})',`,
                `    name: e.name ?? '',`,
                `    deleteActions: [DeleteElementOperation.create([e.__id])]`,
                `}))`
            ].join('\n                            '),
            createsExpr: `[{ label: 'Create ${label}', action: CreateNodeOperation.create(ClassDiagramNodeTypes.${modelConst}, { containerId: semanticElement.__id }) }]`
        };
    }

    if (first?.typeName === 'boolean') {
        return { type: 'bool', id, label: id, valueExpr: `!!semanticElement.${id}` };
    }

    if (first?.typeName === 'string' || first?.typeName === 'number') {
        const val = first.typeName === 'number' ? `String(semanticElement.${id})` : `semanticElement.${id}`;
        return { type: 'text', id, label: human(id), valueExpr: `${val}!` };
    }

    const constant = optionConstant(first?.typeName ?? '');
    if (constant) {
        return {
            type: 'choice',
            id,
            label: human(first!.typeName),
            choicesExpr: `PropertyPaletteChoices.${constant}`,
            choiceExpr: `semanticElement.${id}!`
        };
    }

    return;
}

// ============================================================================
// Render request handler dispatchers
// ============================================================================

export function renderRequestHandlers(extensionPath: string, declarations: LangiumDeclaration[]): { path: string; content: string }[] {
    const results: { path: string; content: string }[] = [];

    const outDir = path.join(extensionPath, ...prefixPath);
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    const diagramAliases = declarations.filter(d => d.type === 'type' && d.name?.endsWith('DiagramElements'));
    const allEntities = getNodeDecls(declarations);

    for (const alias of diagramAliases) {
        const fullKey = alias.name!.replace(/Elements$/, '');
        const shortKey = fullKey.replace(/Diagram$/, '');
        const fileName = `request-${lcFirst(shortKey)}-property-palette-action-handler.ts`;
        const className = `Request${shortKey}PropertyPaletteActionHandler`;
        const modelStateClass = `${shortKey}DiagramModelState`;
        const modelStateImportPath = `@borkdominik-biguml/uml-glsp-server/vscode`;

        const members = alias.properties?.[0]?.types.map(t => t.typeName).filter(Boolean) as string[];
        const nodes = allEntities.filter(e => members.includes(e.name!));

        const guardNames = nodes
            .map(d => `is${d.name}`)
            .sort()
            .join(', ');
        const astImport = `import { ${guardNames} } from '@borkdominik-biguml/model-server/grammar';`;

        const handlerImports = nodes
            .map(d => d.name!)
            .sort()
            .map(n => `import { ${n}PropertyPaletteHandler } from './elements/${toKebab(n)}.property-palette-handler.js';`)
            .join('\n');

        const allDyn = Array.from(
            new Set(
                nodes.flatMap(
                    d =>
                        d.properties?.flatMap(
                            p => p.decorators?.filter(d => d.startsWith('dynamicProperty:')).map(d => d.split(':')[1]) ?? []
                        ) ?? []
                )
            )
        );

        const dynamicBuilders = allDyn
            .map(typeName => {
                const varName = `${lcFirst(typeName)}Choices`;
                const indexCall = `getAll${typeName}s`;
                return [
                    `            const ${varName} = (this.modelState.index.${indexCall}?.() ?? [])`,
                    `                .filter((item: any) => !!item && !!item.__id && !!item.name)`,
                    `                .map((item: any) => ({`,
                    `                    label: item.name,`,
                    `                    value: item.__id + '_refValue',`,
                    `                    secondaryText: item.$type`,
                    `                }));`
                ].join('\n');
            })
            .join('\n');

        const dispatchEntries = nodes.map(d => {
            const dynForDecl = Array.from(
                new Set(
                    d.properties?.flatMap(
                        p => p.decorators?.filter(d => d.startsWith('dynamicProperty:')).map(d => d.split(':')[1]) ?? []
                    ) ?? []
                )
            );
            const args = ['semanticElement'].concat(dynForDecl.map(t => lcFirst(t) + 'Choices')).join(', ');
            return {
                guard: `is${d.name}`,
                handler: `${d.name}PropertyPaletteHandler`,
                args
            };
        });

        const content = eta.render('./request-property-palette-action-handler', {
            className,
            modelStateClass,
            modelStateImportPath,
            astImport,
            handlerImports,
            dynamicBuilders,
            dispatchEntries
        });

        results.push({ path: path.join(outDir, fileName), content });
        console.log(`Generated ${fileName}`);
    }
    return results;
}

// ============================================================================
// Helpers
// ============================================================================

function optionConstant(typeName: string): string | undefined {
    const map: Record<string, string> = {
        Visibility: 'VISIBILITY',
        AggregationType: 'AGGREGATION',
        Concurrency: 'CONCURRENCY',
        ParameterDirection: 'PARAMETER_DIRECTION',
        EffectType: 'EFFECT'
    };
    return map[typeName];
}

const WORD_BREAK = /([a-z0-9])([A-Z])/g;
const toConst = (s: string) => s.replace(WORD_BREAK, '$1_$2').toUpperCase();
const toKebab = (s: string) => s.replace(WORD_BREAK, '$1-$2').toLowerCase();
const human = (s: string) => s.replace(WORD_BREAK, '$1 $2').replace(/^\w/, c => c.toUpperCase());
const lcFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
