/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { Multiplicity } from '@borkdominik-biguml/uml-language-tooling';
import {
    type Definition,
    type EntryRule,
    getReturnTypeFromDefinitions,
    isString,
    type LangiumGrammar,
    type ParserRule,
    type TypeRule
} from '../builder/grammar-transformer.js';

export function renderLangiumText(grammar: LangiumGrammar, _languageId: string = 'grammar', languageName: string = 'NewGrammar') {
    enumKeys = collectEnumKeys(grammar);
    const text = [`grammar ${languageName.replace(/ /g, '')}\n\n`];
    text.push(`import '../../env/langium/terminals'\n\n`);
    text.push(getJsonRule(grammar.entryRule, grammar, true) + '\n');
    text.push(parserRuleToLangiumText(grammar.parserRules, grammar) + '\n');
    text.push(typeRuleToLangiumText(grammar.typeRules));
    return text.join('');
}

function typeRuleToLangiumText(typeRules: Array<TypeRule>) {
    return typeRules
        .map(typeRule => {
            const text = [];
            text.push(typeRule.name);
            const returnType = getReturnTypeFromDefinitions(typeRule.definitions);
            text.push(returnType ? ' returns ' + returnType : '');
            text.push(':');
            text.push(
                typeRule.definitions
                    .map(element =>
                        element.type === 'constant' ? toLangiumKeyword(JSON.parse(element.typeName)) : getLangiumType(element.typeName)
                    )
                    .join(' | ')
            );
            text.push(';');
            if (typeRule.extra && typeRule.extra.path) {
                text.push(` // path: ${typeRule.extra.path}`);
            }
            return text.join(' ');
        })
        .join('\n');
}

function parserRuleToLangiumText(parserRules: Array<ParserRule>, langiumGrammar: LangiumGrammar) {
    return parserRules.map(parserRuleElement => getJsonRule(parserRuleElement, langiumGrammar)).join('\n');
}

function getJsonRule(rule: ParserRule | EntryRule, rules: LangiumGrammar, entry: boolean = false): string {
    const text = [];
    text.push(`${entry ? 'entry ' : ''}` + `${rule.name}`);
    text.push(': ');

    if ((rule as any).extendedBy && (rule as any).extendedBy.length > 0) {
        text.push((rule as any).extendedBy.join(' | '));
        text.push(' | ');
    }

    text.push(" '{' ");
    text.push(entry ? '' : `'"__type"' ':' '"${rule.name}"' `);

    const SKIP = `( ',' __unknown += UnknownProperty )*`;
    const propertyParts = rule.definitions.map(
        (property, index) =>
            `( ${entry && index === 0 ? '' : "','"}  ${getProperty(property, rules)} )` +
            (property.optional || property.multiplicity == Multiplicity.ZERO_TO_N ? '?' : '')
    );
    // Insert unknown-field skip between every pair of known fields and at the end
    text.push(` ${propertyParts.join(` ${SKIP} `)} ${SKIP} `);

    text.push(" '}' ;");
    return text.join(' ');
}

function getProperty(property: Definition, rules: LangiumGrammar): string {
    const text: string[] = [];
    text.push(`'"` + property.name + `"'`);
    text.push("':'");
    if (property.multiplicity === Multiplicity.ONE_TO_ONE) {
        if (property.crossReference) {
            text.push(...getReference(property));
        } else if (property.type!.typeName === 'string') {
            text.push(stringValue(property.name, '='));
        } else if (isString(rules, property.type!)) {
            text.push(`'"'`);
            text.push(property.name);
            text.push('=');
            text.push(getLangiumType(property.type!.typeName));
            text.push(`'"'`);
        } else {
            if (property.type!.type === 'constant') {
                if (typeof JSON.parse(property.type!.typeName) === 'string') {
                    text.push(`'"'`);
                    text.push(property.name);
                    text.push('=');
                    text.push(toLangiumKeyword(JSON.parse(property.type!.typeName)));
                    text.push(`'"'`);
                } else {
                    text.push(property.name);
                    text.push('=');
                    text.push(getLangiumType(property.type!.typeName));
                }
            } else {
                text.push(property.name);
                text.push('=');
                text.push(getLangiumType(property.type!.typeName));
            }
        }
    } else {
        text.push("'['");
        text.push('(');
        if (property.crossReference) {
            text.push(...getReference(property));
            text.push("( ',' ");
            text.push(...getReference(property));
            text.push(')*');
        } else {
            const item = (): string =>
                property.type!.typeName === 'string'
                    ? stringValue(property.name, '+=')
                    : isString(rules, property.type!)
                      ? `'"' ${property.name} += ${getLangiumType(property.type!.typeName)} '"'`
                      : `${property.name} += ${getLangiumType(property.type!.typeName)}`;
            text.push(`( ${item()} )`);
            text.push(`( ',' ${item()} )*`);
        }
        text.push(')' + (property.multiplicity === Multiplicity.ZERO_TO_N ? '?' : ''));
        text.push("']'");
    }
    return text.join(' ');
}

function getReference(property: Definition): string[] {
    const text = [];
    text.push(`'{'`);
    text.push(`'"__type"'`);
    text.push(`':'`);
    text.push(`'"Reference"'`);
    text.push(` ',' `);
    text.push(`'"__refType"'`);
    text.push(`':'`);
    text.push(`'"${property.type!.typeName}"'`);
    text.push(` ',' `);
    text.push(`'"__value"'`);
    text.push(`':'`);
    text.push(`${property.name}${property.multiplicity === Multiplicity.ONE_TO_ONE ? '=' : '+='}[${property.type!.typeName}:STRING]`);
    text.push(`'}'`);
    return text;
}

/**
 * The rule a property's value is read with. A string of any kind - a name, free text, an id - is one
 * JSON string (`STRING`), read and written the way JSON reads and writes it, so it can hold anything.
 */
function getLangiumType(type: string) {
    return type === 'string' ? 'STRING' : type === 'number' ? 'LANGIUM_INT' : type === 'boolean' ? 'LANGIUM_BOOL' : type;
}

/**
 * The keys that hold an enum value somewhere in the grammar, with the rules of those enums. An enum value
 * is written as the quoted keyword it is (`"visibility": "PUBLIC"`), which keeps its type in the AST; the
 * lexer hands such a value over as that keyword rather than as a `STRING` (see `UmlDiagramTokenBuilder`).
 */
let enumKeys = new Map<string, Set<string>>();

function collectEnumKeys(grammar: LangiumGrammar): Map<string, Set<string>> {
    const keys = new Map<string, Set<string>>();
    for (const rule of [grammar.entryRule, ...grammar.parserRules]) {
        for (const property of rule.definitions) {
            const type = property.type;
            if (!type || property.crossReference || type.typeName === 'string' || !isString(grammar, type)) {
                continue;
            }
            if (type.type === 'constant') {
                continue;
            }
            const rules = keys.get(property.name) ?? new Set<string>();
            rules.add(type.typeName);
            keys.set(property.name, rules);
        }
    }
    return keys;
}

/**
 * A string property's value. Where the same key holds an enum in another element - a parameter's
 * `effect` is an `EffectType`, a transition's is free text - the lexer cannot tell the two apart and
 * hands over a value that reads as one of those enum values as its keyword, so the keyword is taken here
 * too.
 */
function stringValue(name: string, operator: '=' | '+='): string {
    const enums = enumKeys.get(name);
    if (!enums || enums.size === 0) {
        return `${name} ${operator} STRING`;
    }
    return `( ${name} ${operator} STRING | ${[...enums].map(rule => `'"' ${name} ${operator} ${rule} '"'`).join(' | ')} )`;
}

/** Wrap a constant value as a Langium keyword (e.g., `"CLASS"`). */
function toLangiumKeyword(value: string): string {
    return `"${value}"`;
}
