/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type Declaration, Decorator, getDefinitionSourceFiles } from '@borkdominik-biguml/uml-language-tooling';
import { Eta } from 'eta';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const eta = new Eta({ views: path.join(__dirname, '..', 'templates') });

// ============================================================================
// Types
// ============================================================================

const BUILTIN_TYPE_NAMES = new Set(['Array', 'Readonly', 'Partial', 'Record', 'unknown', 'any', 'string', 'number', 'boolean']);

interface PropertyInfo {
    name: string;
    decoratorTexts: string[];
    typeText: string;
    isOptional: boolean;
}

interface EntityInfo {
    name: string;
    dtoClassName: string;
    props: PropertyInfo[];
}

interface ValidationInfo {
    entities: EntityInfo[];
    decoratorImports: Array<{ from: string; names: string[] }>;
}

// ============================================================================
// Main entry point
// ============================================================================

/** The check put on every property a definition marks `@Language.multiplicity` (see `IsMultiplicity`). */
const MULTIPLICITY_DECORATOR_TEXT = '@IsMultiplicity()';

export function renderValidation(extensionPath: string, defPath: string, declarations: Declaration[]): { path: string; content: string }[] {
    const results: { path: string; content: string }[] = [];

    const info = buildValidationInfo(defPath);

    const elementsContent = renderValidationElements(extensionPath, defPath, info);
    results.push({
        path: path.join(extensionPath, 'validation', 'validation-elements.ts'),
        content: elementsContent
    });

    const validatorContent = renderValidator(info);
    results.push({
        path: path.join(extensionPath, 'validation', 'validator.ts'),
        content: validatorContent
    });

    results.push({
        path: path.join(extensionPath, 'validation', 'multiplicity-properties.ts'),
        content: renderMultiplicityProperties(declarations)
    });

    return results;
}

// ============================================================================
// Template rendering
// ============================================================================

function renderValidationElements(extPath: string, defPath: string, info: ValidationInfo): string {
    const outDir = path.join(extPath, 'validation');

    const resolvedImports = info.decoratorImports.map(i => ({
        from: i.from.startsWith('.') ? path.relative(outDir, path.resolve(path.dirname(defPath), i.from)).replace(/\\/g, '/') : i.from,
        names: i.names
    }));
    // The checks the generator puts on properties by itself rather than copying them from a definition.
    if (info.entities.some(e => e.props.some(p => p.decoratorTexts.includes(MULTIPLICITY_DECORATOR_TEXT)))) {
        resolvedImports.push({
            from: path.relative(outDir, path.join(extPath, '..', 'env', 'validators', 'index.js')).replace(/\\/g, '/'),
            names: ['IsMultiplicity']
        });
    }

    const astTypeNames = collectAstTypeNames(info);
    const astImportPath = path.relative(outDir, path.join(extPath, 'langium', 'language', 'ast.js')).replace(/\\/g, '/');

    return eta.render('./validation-elements', {
        decoratorImports: resolvedImports,
        astTypeNames: [...astTypeNames].sort(),
        astImportPath,
        entities: info.entities
    });
}

function renderValidator(info: ValidationInfo): string {
    return eta.render('./validator', {
        astGuards: info.entities.map(e => `is${e.name}`),
        dtoNames: info.entities.map(e => e.dtoClassName),
        entities: info.entities
    });
}

// ============================================================================
// Validation info extraction (ts-morph)
// ============================================================================

function collectDecoratorImports(defPath: string): ValidationInfo['decoratorImports'] {
    const { sources } = getDefinitionSourceFiles(defPath);

    const res: ValidationInfo['decoratorImports'] = [];

    for (const src of sources) {
        src.getImportDeclarations().forEach(imp => {
            const mod = imp.getModuleSpecifierValue();
            if (mod === 'class-validator' || mod.includes('/validation/custom-validators')) {
                const names = imp.getNamedImports().map(n => n.getName());
                if (names.length) {
                    const existing = res.find(r => r.from === mod);
                    if (existing) {
                        for (const name of names) {
                            if (!existing.names.includes(name)) {
                                existing.names.push(name);
                            }
                        }
                    } else {
                        res.push({ from: mod, names });
                    }
                }
            }
        });
    }

    return res;
}

function buildValidationInfo(defPath: string): ValidationInfo {
    const decoratorImports = collectDecoratorImports(defPath);
    const decoratorNames = new Set<string>(decoratorImports.flatMap(i => i.names));

    const { sources } = getDefinitionSourceFiles(defPath);

    const entities: EntityInfo[] = [];

    for (const src of sources) {
        src.getClasses().forEach(cls => {
            const props: PropertyInfo[] = [];
            const validateIfRefs = new Set<string>();

            cls.getProperties().forEach(prop => {
                const decos = prop.getDecorators().filter(d => decoratorNames.has(d.getName()));
                const isMultiplicity = prop.getDecorators().some(d => isLanguageDecorator(d.getName(), 'multiplicity'));
                if (decos.length || isMultiplicity) {
                    const typeNode = prop.getTypeNode();
                    props.push({
                        name: prop.getName(),
                        decoratorTexts: [...decos.map(d => d.getText()), ...(isMultiplicity ? [MULTIPLICITY_DECORATOR_TEXT] : [])],
                        typeText: typeNode?.getText() ?? prop.getType().getText(),
                        isOptional: prop.hasQuestionToken()
                    });

                    decos
                        .filter(d => d.getName() === 'ValidateIf')
                        .forEach(d => {
                            const lamb = d.getArguments()[0]?.getText() ?? '';
                            Array.from(lamb.matchAll(/o\.(\w+)/g)).forEach(m => validateIfRefs.add(m[1]));
                        });
                }
            });

            validateIfRefs.forEach(n => {
                if (!props.find(p => p.name === n)) {
                    const decl = cls.getProperty(n)!;
                    const typeNode = decl.getTypeNode();
                    props.push({
                        name: n,
                        decoratorTexts: [],
                        typeText: typeNode?.getText() ?? decl.getType().getText(),
                        isOptional: decl.hasQuestionToken()
                    });
                }
            });

            if (props.length) {
                entities.push({
                    name: cls.getName()!,
                    dtoClassName: `${cls.getName()}ValidationElement`,
                    props
                });
            }
        });
    }

    return { entities, decoratorImports };
}

// ============================================================================
// Multiplicity properties
// ============================================================================

/**
 * Which properties of which element hold a multiplicity, as the definitions mark them - read by the
 * canvas and the property palette, which hold a multiplicity to the same rules the validation does.
 *
 * Keyed by the type an element is stored as, with what it inherits: an aliased class is stored as the
 * type it aliases, and has no entry of its own.
 */
function renderMultiplicityProperties(declarations: Declaration[]): string {
    const byName = new Map(declarations.filter(d => d.type === 'class' && d.name).map(d => [d.name!, d]));
    const multiplicitiesOf = (declaration: Declaration, seen = new Set<string>()): string[] => {
        if (seen.has(declaration.name!)) {
            return [];
        }
        seen.add(declaration.name!);
        const own = (declaration.properties ?? []).filter(p => Decorator.has(p.decorators, 'multiplicity')).map(p => p.name);
        const inherited = (declaration.extends ?? []).flatMap(parent => (byName.has(parent) ? multiplicitiesOf(byName.get(parent)!, seen) : []));
        return [...new Set([...inherited, ...own])];
    };

    const entries = [...byName.values()]
        .filter(d => !d.isAbstract && !Decorator.has(d.decorators, 'alias'))
        .map(d => ({ type: d.name!, properties: multiplicitiesOf(d) }))
        .filter(e => e.properties.length > 0)
        .sort((a, b) => a.type.localeCompare(b.type));

    return eta.render('./multiplicity-properties', { entries });
}

// ============================================================================
// Helpers
// ============================================================================

/** Whether a decorator, as written in a definition, is `@Language.<name>`. */
function isLanguageDecorator(written: string, name: string): boolean {
    return written === `Language.${name}` || written === name;
}

function collectAstTypeNames(info: ValidationInfo): Set<string> {
    const astTypeNames = new Set<string>();

    info.entities.forEach(e => astTypeNames.add(e.name));

    info.entities.forEach(e => {
        e.props.forEach(p => {
            const ids = p.typeText.match(/\b[A-Z][A-Za-z0-9_]*\b/g) ?? [];
            ids.forEach(id => {
                if (!BUILTIN_TYPE_NAMES.has(id)) {
                    astTypeNames.add(id);
                }
            });
        });
    });

    return astTypeNames;
}
