/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type Definition, type EntryRule, type LangiumGrammar, Multiplicity, type ParserRule, type TypeRule } from '../types/index.js';
import { getReturnTypeFromDefinitions, isString } from '../util.js';

export function generateLangiumText(grammar: LangiumGrammar, _languageId: string = 'grammar', languageName: string = 'NewGrammar') {
    const text = [`grammar ${languageName.replace(/ /g, '')}\n\n`];
    text.push(`import 'terminals'\n\n`);
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
                        element.type === 'constant' ? getLangiumType(JSON.parse(element.typeName)) : getLangiumType(element.typeName)
                    )
                    .join(' | ')
            );
            text.push(';');
            if (typeRule.extra && typeRule.extra.path) {
                text.push(` // path: ${typeRule.extra.path}`);
            }
            text.push(' // TEST_CHANGE');
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
    text.push(
        ` ${rule.definitions
            .map(
                (property, index) =>
                    `( ${entry && index === 0 ? '' : "','"}  ${getProperty(property, rules)} )` +
                    (property.optional || property.multiplicity == Multiplicity.ZERO_TO_N ? '?' : '')
            )
            .join(' ')} `
    );
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
                    text.push(getLangiumType(JSON.parse(property.type!.typeName)));
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
            text.push('(');
            text.push(isString(rules, property.type!) ? `'"'` : '');
            text.push(property.name);
            text.push('+=');
            text.push(getLangiumType(property.type!.typeName));
            text.push(isString(rules, property.type!) ? `'"'` : '');
            text.push(')');

            text.push('(');
            text.push(" ',' ");
            text.push(isString(rules, property.type!) ? `'"'` : '');
            text.push(property.name);
            text.push('+=');
            text.push(getLangiumType(property.type!.typeName));
            text.push(isString(rules, property.type!) ? `'"'` : '');
            text.push(')*');
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
    text.push(
        `'"'${property.name}${property.multiplicity === Multiplicity.ONE_TO_ONE ? '=' : '+='}[${property.type!.typeName}:LANGIUM_ID]'"'`
    );
    text.push(`'}'`);
    return text;
}
function getLangiumType(type: string) {
    return type === 'string' ? 'LANGIUM_ID' : type === 'number' ? 'LANGIUM_INT' : type === 'boolean' ? 'LANGIUM_BOOL' : type;
}
