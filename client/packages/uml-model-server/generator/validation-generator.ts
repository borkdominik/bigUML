/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { Eta } from 'eta';
import path from 'path';
import { Project } from 'ts-morph';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const eta = new Eta({ views: path.join(__dirname, 'templates') });

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

export function buildValidationFiles(extensionPath: string, defPath: string): { path: string; content: string }[] {
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
    const proj = new Project({
        tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json')
    });
    const src = proj.addSourceFileAtPath(defPath);

    const res: ValidationInfo['decoratorImports'] = [];

    src.getImportDeclarations().forEach(imp => {
        const mod = imp.getModuleSpecifierValue();
        if (mod === 'class-validator' || mod.includes('/validation/custom-validators')) {
            const names = imp.getNamedImports().map(n => n.getName());
            if (names.length) {
                res.push({ from: mod, names });
            }
        }
    });

    return res;
}

function buildValidationInfo(defPath: string): ValidationInfo {
    const decoratorImports = collectDecoratorImports(defPath);
    const decoratorNames = new Set<string>(decoratorImports.flatMap(i => i.names));

    const proj = new Project({
        tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json')
    });
    const src = proj.addSourceFileAtPath(defPath);

    const entities: EntityInfo[] = [];

    src.getClasses().forEach(cls => {
        const props: PropertyInfo[] = [];
        const validateIfRefs = new Set<string>();

        cls.getProperties().forEach(prop => {
            const decos = prop.getDecorators().filter(d => decoratorNames.has(d.getName()));
            if (decos.length) {
                const typeNode = prop.getTypeNode();
                props.push({
                    name: prop.getName(),
                    decoratorTexts: decos.map(d => d.getText()),
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

    return { entities, decoratorImports };
}

// ============================================================================
// Helpers
// ============================================================================

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
