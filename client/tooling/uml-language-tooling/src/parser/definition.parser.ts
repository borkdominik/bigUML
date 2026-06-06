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
import {
    type ClassDeclaration,
    type InterfaceDeclaration,
    Project,
    type PropertyDeclaration,
    type PropertySignature,
    type SourceFile,
    SyntaxKind,
    type TypeAliasDeclaration
} from 'ts-morph';
import { type Declaration, type Decorator, Multiplicity, type Property, type Type } from '../types/index.js';

export type { SourceFile } from 'ts-morph';

// ============================================================================
// Public API
// ============================================================================

export async function parseDefinitionFile(entryPath: string): Promise<Array<Declaration>> {
    const { sources } = getDefinitionSourceFiles(entryPath);

    const declarations: Declaration[] = [];
    for (const source of sources) {
        parseSourceFile(source, declarations);
    }

    return declarations;
}

/**
 * Creates a ts-morph Project and resolves all local imports from the given def file entry point.
 * Useful for consumers that need raw SourceFile access (e.g., validation-generator).
 */
export function getDefinitionSourceFiles(entryPath: string): { project: Project; sources: SourceFile[] } {
    const entryDir = path.dirname(path.resolve(entryPath));

    const project = new Project({ skipAddingFilesFromTsConfig: true });
    const entrySource = project.addSourceFileAtPath(path.resolve(entryPath));

    const sources = resolveLocalImports(entrySource, entryDir, project);
    return { project, sources };
}

/**
 * Starting from the entry source file, recursively follow local relative imports
 * (e.g., `./class-diagram.def.js`) to discover all definition files.
 * Non-local imports (packages like `@borkdominik-biguml/...`) are ignored.
 */
function resolveLocalImports(entry: SourceFile, entryDir: string, project: Project): SourceFile[] {
    const visited = new Set<string>();
    const result: SourceFile[] = [];
    const queue: SourceFile[] = [entry];

    while (queue.length > 0) {
        const source = queue.pop()!;
        const filePath = source.getFilePath();

        if (visited.has(filePath)) {
            continue;
        }
        visited.add(filePath);
        result.push(source);

        // Follow relative imports within the same directory tree
        for (const imp of source.getImportDeclarations()) {
            const specifier = imp.getModuleSpecifierValue();
            if (!specifier.startsWith('.')) {
                continue;
            }

            // Resolve the import to an absolute file path
            const resolved = path.resolve(path.dirname(filePath), specifier).replace(/\.js$/, '.ts');

            if (!resolved.startsWith(entryDir)) {
                continue;
            }

            if (!visited.has(resolved) && fs.existsSync(resolved)) {
                const imported = project.addSourceFileAtPath(resolved);
                queue.push(imported);
            }
        }
    }

    return result;
}

export function parseLangiumConfigFile(configPath: string) {
    const file = JSON.parse(fs.readFileSync(configPath).toString());
    const languageName = file.projectName;
    const languageId = file.languages[0].id;
    return { languageName, languageId };
}

// ============================================================================
// Source file visitor
// ============================================================================

function parseSourceFile(source: SourceFile, declarations: Declaration[]): void {
    for (const cls of source.getClasses()) {
        declarations.push(parseClassDeclaration(cls));
    }
    for (const iface of source.getInterfaces()) {
        declarations.push(parseInterfaceDeclaration(iface));
    }
    for (const alias of source.getTypeAliases()) {
        declarations.push(parseTypeAliasDeclaration(alias));
    }
}

// ============================================================================
// Class declarations
// ============================================================================

function parseClassDeclaration(cls: ClassDeclaration): Declaration {
    const decorators = parseDecorators(cls);
    const properties: Property[] = cls.getProperties().map(prop => parsePropertyDeclaration(prop));
    const extendsClause = cls.getExtends()?.getExpression()?.getText();
    const extendsArr = extendsClause ? [extendsClause] : [];

    return {
        type: 'class',
        name: cls.getName(),
        isAbstract: cls.isAbstract(),
        decorators,
        properties,
        extends: extendsArr.filter(e => e !== 'ABSTRACT_ELEMENT' && e !== 'ROOT_ELEMENT')
    };
}

// ============================================================================
// Interface declarations
// ============================================================================

function parseInterfaceDeclaration(iface: InterfaceDeclaration): Declaration {
    const properties: Property[] = iface.getProperties().map(prop => parsePropertySignature(prop));
    const extendsArr = iface.getExtends().map(e => e.getExpression().getText());

    const isAbstract = extendsArr.includes('ABSTRACT_ELEMENT');
    const decorators: Decorator[] = [];
    if (extendsArr.includes('ROOT_ELEMENT')) {
        decorators.push({ name: 'root', args: [] });
    }

    return {
        type: 'class',
        name: iface.getName(),
        isAbstract,
        decorators,
        properties,
        extends: extendsArr.filter(e => e !== 'ABSTRACT_ELEMENT' && e !== 'ROOT_ELEMENT')
    };
}

// ============================================================================
// Type alias declarations
// ============================================================================

function parseTypeAliasDeclaration(alias: TypeAliasDeclaration): Declaration {
    const typeNode = alias.getTypeNode();
    const types: Type[] = [];

    if (typeNode) {
        if (typeNode.isKind(SyntaxKind.UnionType)) {
            for (const member of typeNode.getTypeNodes()) {
                types.push(...resolveTypeNode(member));
            }
        } else {
            types.push(...resolveTypeNode(typeNode));
        }
    }

    // Type aliases are represented as a declaration with a single synthetic property
    const syntheticProperty: Property = {
        name: '',
        isOptional: true,
        decorators: [],
        types,
        multiplicity: Multiplicity.ONE_TO_ONE
    };

    return {
        type: 'type',
        name: alias.getName(),
        isAbstract: true,
        decorators: [],
        properties: [syntheticProperty],
        extends: []
    };
}

// ============================================================================
// Property parsing
// ============================================================================

function parsePropertyDeclaration(prop: PropertyDeclaration): Property {
    const decorators = parseDecorators(prop);
    const isOptional = prop.hasQuestionToken();
    const typeNode = prop.getTypeNode();
    let types: Type[] = [];
    let multiplicity = Multiplicity.ONE_TO_ONE;

    if (typeNode) {
        const result = resolvePropertyType(typeNode, isOptional);
        types = result.types;
        multiplicity = result.multiplicity;
    }

    // Handle Reference type as decorator
    if (types.some(t => t.typeName === 'CrossReference' || t.typeName === 'Reference')) {
        decorators.push({ name: 'reference', args: [] });
        types = types.filter(t => t.typeName !== 'CrossReference' && t.typeName !== 'Reference');
    }

    let defaultValue: Property['defaultValue'];
    const initializer = prop.getInitializer();
    if (initializer) {
        defaultValue = parseInitializer(initializer);
    }

    return {
        name: prop.getName(),
        isOptional,
        decorators,
        types,
        multiplicity,
        defaultValue
    };
}

function parsePropertySignature(prop: PropertySignature): Property {
    const isOptional = prop.hasQuestionToken();
    const typeNode = prop.getTypeNode();
    let types: Type[] = [];
    let multiplicity = Multiplicity.ONE_TO_ONE;

    if (typeNode) {
        const result = resolvePropertyType(typeNode, isOptional);
        types = result.types;
        multiplicity = result.multiplicity;
    }

    return {
        name: prop.getName(),
        isOptional,
        decorators: [],
        types,
        multiplicity
    };
}

// ============================================================================
// Type resolution
// ============================================================================

function resolvePropertyType(
    typeNode: ReturnType<PropertyDeclaration['getTypeNode']>,
    isOptional: boolean
): { types: Type[]; multiplicity: Multiplicity } {
    if (!typeNode) {
        return { types: [], multiplicity: Multiplicity.ONE_TO_ONE };
    }

    // Array<T> or T[]
    if (typeNode.isKind(SyntaxKind.ArrayType)) {
        const elementType = typeNode.getElementTypeNode();
        const types = elementType ? resolveTypeNode(elementType) : [];
        return {
            types,
            multiplicity: isOptional ? Multiplicity.ZERO_TO_N : Multiplicity.ONE_TO_N
        };
    }

    if (typeNode.isKind(SyntaxKind.TypeReference)) {
        const typeName = typeNode.getTypeName().getText();
        if (typeName === 'Array') {
            const typeArgs = typeNode.getTypeArguments();
            const types = typeArgs.length > 0 ? resolveTypeNode(typeArgs[0]) : [];
            return {
                types,
                multiplicity: isOptional ? Multiplicity.ZERO_TO_N : Multiplicity.ONE_TO_N
            };
        }
    }

    // Union types
    if (typeNode.isKind(SyntaxKind.UnionType)) {
        const types: Type[] = [];
        for (const member of typeNode.getTypeNodes()) {
            types.push(...resolveTypeNode(member));
        }
        return { types, multiplicity: Multiplicity.ONE_TO_ONE };
    }

    return { types: resolveTypeNode(typeNode), multiplicity: Multiplicity.ONE_TO_ONE };
}

function resolveTypeNode(node: any): Type[] {
    if (node.isKind(SyntaxKind.StringKeyword)) {
        return [{ type: 'simple', typeName: 'string' }];
    }
    if (node.isKind(SyntaxKind.NumberKeyword)) {
        return [{ type: 'simple', typeName: 'number' }];
    }
    if (node.isKind(SyntaxKind.BooleanKeyword)) {
        return [{ type: 'simple', typeName: 'boolean' }];
    }
    if (node.isKind(SyntaxKind.LiteralType)) {
        const literal = node.getLiteral();
        if (literal.isKind(SyntaxKind.StringLiteral)) {
            return [{ type: 'constant', typeName: JSON.stringify(literal.getLiteralValue()) }];
        }
        if (literal.isKind(SyntaxKind.NumericLiteral)) {
            return [{ type: 'constant', typeName: JSON.stringify(literal.getLiteralValue()) }];
        }
        if (literal.isKind(SyntaxKind.TrueKeyword) || literal.isKind(SyntaxKind.FalseKeyword)) {
            return [{ type: 'constant', typeName: literal.getText() }];
        }
    }
    if (node.isKind(SyntaxKind.TypeReference)) {
        const typeName = node.getTypeName().getText();
        if (typeName === 'Array') {
            const typeArgs = node.getTypeArguments();
            return typeArgs.length > 0 ? resolveTypeNode(typeArgs[0]) : [];
        }
        if (typeName === 'CrossReference' || typeName === 'Reference') {
            // Keep as a type marker — caller converts to 'reference' decorator
            return [{ type: 'complex', typeName }];
        }
        return [{ type: 'complex', typeName }];
    }
    if (node.isKind(SyntaxKind.UnionType)) {
        const types: Type[] = [];
        for (const member of node.getTypeNodes()) {
            types.push(...resolveTypeNode(member));
        }
        return types;
    }
    return [];
}

// ============================================================================
// Decorator parsing
// ============================================================================

function parseDecorators(node: ClassDeclaration | PropertyDeclaration): Decorator[] {
    return node.getDecorators().map(dec => {
        const fullName = dec.getName();
        // For namespace decorators like @Language.root, extract just "root"
        const name = fullName.includes('.') ? fullName.split('.').pop()! : fullName;
        const args: Decorator['args'] = [];

        if (dec.isDecoratorFactory()) {
            for (const arg of dec.getArguments()) {
                args.push(parseDecoratorArgument(arg));
            }
        }

        return { name, args };
    });
}

function parseDecoratorArgument(arg: any): Decorator['args'][number] {
    if (arg.isKind(SyntaxKind.StringLiteral)) {
        return arg.getLiteralValue();
    }
    if (arg.isKind(SyntaxKind.NumericLiteral)) {
        return arg.getLiteralValue();
    }
    if (arg.isKind(SyntaxKind.TrueKeyword)) {
        return true;
    }
    if (arg.isKind(SyntaxKind.FalseKeyword)) {
        return false;
    }
    if (arg.isKind(SyntaxKind.ObjectLiteralExpression)) {
        const obj: Record<string, unknown> = {};
        for (const prop of arg.getProperties()) {
            if (prop.isKind(SyntaxKind.PropertyAssignment)) {
                const key = prop.getName();
                const init = prop.getInitializer();
                if (init) {
                    obj[key] = parseDecoratorArgument(init);
                }
            }
        }
        return obj;
    }
    // Fallback: return the text representation
    return arg.getText();
}

// ============================================================================
// Initializer parsing (default values)
// ============================================================================

function parseInitializer(init: any): Property['defaultValue'] {
    if (init.isKind(SyntaxKind.StringLiteral)) {
        return init.getLiteralValue();
    }
    if (init.isKind(SyntaxKind.NumericLiteral)) {
        return init.getLiteralValue();
    }
    if (init.isKind(SyntaxKind.TrueKeyword)) {
        return true;
    }
    if (init.isKind(SyntaxKind.FalseKeyword)) {
        return false;
    }
    if (init.isKind(SyntaxKind.ObjectLiteralExpression)) {
        const obj: Record<string, unknown> = {};
        for (const prop of init.getProperties()) {
            if (prop.isKind(SyntaxKind.PropertyAssignment)) {
                const key = prop.getName();
                const val = prop.getInitializer();
                if (val) {
                    obj[key] = parseInitializer(val);
                }
            }
        }
        return obj;
    }
    if (init.isKind(SyntaxKind.ArrayLiteralExpression)) {
        return '[]';
    }
    return init.getText();
}
