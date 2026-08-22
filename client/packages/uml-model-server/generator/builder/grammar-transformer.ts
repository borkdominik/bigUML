/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type Declaration, Decorator, Multiplicity, type Property, type Type } from '@borkdominik-biguml/uml-language-tooling';

// ============================================================================
// Langium grammar types — specific to the model-server's grammar generation
// ============================================================================

export interface LangiumGrammar {
    entryRule: EntryRule;
    typeRules: Array<TypeRule>;
    parserRules: Array<ParserRule>;
}

export interface EntryRule {
    name: string;
    definitions: Array<Definition>;
}

export interface TypeRule {
    name: string;
    definitions: Array<Type>;
    extra?: { path?: string };
}

export interface ParserRule {
    name: string;
    isAbstract: boolean;
    extendedBy: string[];
    definitions: Array<Definition>;
}

export interface Definition {
    name: string;
    types?: Type[];
    type?: Type;
    multiplicity: Multiplicity;
    crossReference: boolean;
    optional: boolean;
    /** `true` for string properties marked with `@Language.text` (free-form value). */
    freeText: boolean;
    /**
     * `true` for the property an element is identified by - `generatorConfig.referenceProperty`, the one
     * a cross-reference holds. It is the one string property that is machine-written rather than typed,
     * and so the one that stays an identifier while the rest are read as names.
     */
    identifier: boolean;
}

// ============================================================================
// Grammar utilities
// ============================================================================

export function getReturnTypeFromDefinitions(definitions: Array<Type>): string | undefined {
    if (definitions.every(definition => definition.type === 'simple')) {
        if (definitions.every(definition => definition.typeName === 'number')) {
            return 'number';
        } else if (definitions.every(definition => definition.typeName === 'boolean')) {
            return 'boolean';
        }
    } else if (definitions.every(definition => definition.type === 'constant')) {
        let type = 'string';
        if (definitions.every(definition => typeof JSON.parse(definition.typeName) === 'number')) {
            type = 'number';
        } else if (definitions.every(definition => typeof JSON.parse(definition.typeName) === 'boolean')) {
            type = 'boolean';
        }
        return type;
    }
    return undefined;
}

export function isString(langiumGrammar: LangiumGrammar, _type: Type): boolean {
    if (_type.typeName === 'string') return true;
    const typeRule = langiumGrammar.typeRules.find(ruleElement => ruleElement.name === _type.typeName);
    if (typeRule) {
        return getReturnTypeFromDefinitions(typeRule.definitions) === 'string';
    }
    return false;
}

// ============================================================================
// Declaration → LangiumGrammar transformation
// ============================================================================

function declarationToEntryRule(declaration: Declaration): EntryRule {
    return {
        name: declaration.name!,
        definitions: declaration.properties!.map((property: Property) => ({
            name: property.name,
            types: property.types,
            multiplicity: property.multiplicity,
            crossReference: Decorator.has(property.decorators, 'reference'),
            optional: property.isOptional,
            freeText: Decorator.has(property.decorators, 'text'),
            // The root carries no id: nothing refers to the diagram itself, so it is never given one.
            identifier: false
        }))
    };
}

function declarationsToTypeRules(declarations: Array<Declaration>): Array<TypeRule> {
    const typeRules = declarations
        .filter(declaration => declaration.type === 'type')
        .map(declaration => ({
            name: declaration.name,
            definitions: declaration.properties!.map(property => property.types)?.flat() ?? []
        }))
        .concat(
            declarations
                .filter(declaration => declaration.isAbstract && declaration.type === 'class')
                .map(declaration => ({
                    name: declaration.name,
                    definitions: declaration.extendedBy!.map(extendedBy => ({
                        typeName: extendedBy,
                        type: 'simple' as const
                    }))
                }))
        );

    const inlineUnionRules: TypeRule[] = [];
    let unionId = 0;

    declarations
        .filter(declaration => declaration.type === 'class' && !declaration.isAbstract)
        .forEach(declaration => {
            declaration.properties!.forEach(property => {
                if (property.types.length <= 1) {
                    return;
                }

                /*
                 * A property written as a union of types is parsed against one rule naming the whole
                 * union, and the property is pointed at that rule. Where a rule over the same types is
                 * already there - one declared in the language, or one made for a property written the
                 * same way - the property points at that one instead of a second rule being made for it.
                 *
                 * Pointing it at the rule is the part that matters: a parser rule takes a single type
                 * per property (see `transformDeclarationsToLangiumGrammar`), so a property left holding
                 * its union keeps only the first type of it. That is what limited an information flow to
                 * running into an Actor, and a transition to running into a Node.
                 */
                const existingName = (findTypeRule(typeRules as TypeRule[], property.types) ??
                    findTypeRule(inlineUnionRules, property.types))?.name;
                const typeName = existingName ?? `UnionType_${unionId++}`;

                if (existingName === undefined) {
                    inlineUnionRules.push({
                        name: typeName,
                        definitions: property.types.map(type => ({
                            typeName: type.typeName,
                            type: type.type
                        }))
                    });
                }

                property.types = [{ typeName, type: 'simple' }];
            });
        });

    return [...typeRules, ...inlineUnionRules] as TypeRule[];
}

/** The rule written over exactly these types, whatever order they are written in, if there is one. */
function findTypeRule(typeRules: Array<TypeRule>, propertyTypes: Type[]): TypeRule | undefined {
    const sorted = propertyTypes
        .map(t => t.typeName)
        .sort()
        .join(',');
    return typeRules.find(
        rule =>
            rule.definitions
                .map(t => t.typeName)
                .sort()
                .join(',') === sorted
    );
}

export function transformDeclarationsToLangiumGrammar(
    declarations: Array<Declaration>,
    generatorConfig: { referenceProperty: string }
): LangiumGrammar {
    const entryRule = declarationToEntryRule(declarations.find(d => Decorator.has(d.decorators, 'root'))!);

    const typeRules = declarationsToTypeRules(declarations);

    const parserRules = declarations
        .filter(d => d.type === 'class' && !d.isAbstract && !Decorator.has(d.decorators, 'root') && !Decorator.has(d.decorators, 'alias'))
        .map(d => {
            // Merge inherited properties from parent classes
            const allProperties = new Map<string, Property>();

            // Recursively collect properties from parent class chain
            function collectParentProperties(decl: Declaration) {
                if (decl.extends && decl.extends.length > 0) {
                    for (const parentName of decl.extends) {
                        const parent = declarations.find(x => x.name === parentName);
                        if (parent) {
                            collectParentProperties(parent);
                            for (const prop of parent.properties ?? []) {
                                if (!allProperties.has(prop.name)) {
                                    allProperties.set(prop.name, prop);
                                }
                            }
                        }
                    }
                }
            }

            // First collect parent properties
            collectParentProperties(d);

            // Then add own properties (which can override parent properties)
            for (const prop of d.properties ?? []) {
                allProperties.set(prop.name, prop);
            }

            const properties: Array<Definition> = Array.from(allProperties.values()).map(property => ({
                name: property.name,
                type: property.types[0],
                multiplicity: property.multiplicity,
                crossReference: Decorator.has(property.decorators, 'reference'),
                optional: property.isOptional,
                freeText: Decorator.has(property.decorators, 'text'),
                identifier: property.name === generatorConfig.referenceProperty
            }));

            if (!properties.find(property => property.name === generatorConfig.referenceProperty)) {
                properties.unshift({
                    name: generatorConfig.referenceProperty,
                    type: { typeName: 'string', type: 'simple' },
                    multiplicity: Multiplicity.ONE_TO_ONE,
                    crossReference: false,
                    optional: false,
                    freeText: false,
                    identifier: true
                });
            }

            // Exclude aliased subtypes from the union—they serialize with parent's $type value
            const extendedBy = (d.extendedBy ?? []).filter(subclassName => {
                const subclass = declarations.find(decl => decl.name === subclassName);
                return !Decorator.has(subclass?.decorators ?? [], 'alias');
            });

            return {
                name: d.name!,
                isAbstract: !!d.isAbstract,
                extendedBy,
                definitions: properties
            };
        });

    // Resolve entry rule multi-type definitions to union type references
    entryRule.definitions.forEach(definition => {
        if (definition.types && definition.types.length > 1) {
            const unionType = typeRules.find(
                typeRule =>
                    typeRule.definitions
                        .map(t => t.typeName)
                        .sort()
                        .join(',') ===
                    definition
                        .types!.map(t => t.typeName)
                        .sort()
                        .join(',')
            );
            if (unionType) {
                definition.type = { typeName: unionType.name!, type: 'simple' };
            }
        } else if (definition.types) {
            definition.type = definition.types[0];
        }
    });

    return { entryRule, typeRules: typeRules as TypeRule[], parserRules };
}
