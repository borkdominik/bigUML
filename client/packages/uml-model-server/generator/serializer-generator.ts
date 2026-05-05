/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type Definition, getReturnTypeFromDefinitions, type LangiumGrammar, Multiplicity } from '@borkdominik-biguml/uml-language-tooling';
import { Eta } from 'eta';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const eta = new Eta({ views: path.join(__dirname, 'templates') });

const SIMPLE_TYPES = ['string', 'number', 'boolean'];

export function generateSerializer(rules: LangiumGrammar, languageId: string, languageName: string, generatorConfig: any): string {
    const referenceProperty: string = generatorConfig.referenceProperty ?? '__id';

    const serializeRootBody = buildRootElementSerializer(rules, referenceProperty);
    const parserRuleMethods = buildRuleElementSerializer(rules, referenceProperty);
    const typeRuleMethods = buildTypeRuleElementSerializer(rules);

    return eta.render('./uml-diagram-serializer', {
        entryName: rules.entryRule.name,
        languageName,
        languageId,
        parserRules: rules.parserRules,
        typeRules: rules.typeRules,
        serializeRootBody,
        parserRuleMethods,
        typeRuleMethods
    });
}

// Body builders (TypeScript code strings passed to the template)

function buildTypeRuleElementSerializer(rules: LangiumGrammar): string {
    return rules.typeRules
        .map(ruleElement => {
            const retType = getReturnTypeFromDefinitions(ruleElement.definitions);
            const body = retType
                ? `return ${retType === 'string' ? `'"' + element + '"'` : 'element'};`
                : ruleElement.definitions
                      .map(
                          element =>
                              `if (is${element.typeName}(element)) {\n      return this.serialize${element.typeName}(element);\n    }`
                      )
                      .join('\n    ');
            return `serialize${ruleElement.name}(element: ${ruleElement.name}): any {\n    ${body}\n  }`;
        })
        .join('\n\n  ');
}

function buildRuleElementSerializer(rules: LangiumGrammar, referenceProperty: string): string {
    const allRules = (rules.parserRules as any[]).concat([
        {
            ...rules.entryRule,
            isAbstract: false,
            extendedBy: [],
            isRoot: true
        }
    ]);

    return allRules
        .map(ruleElement => {
            const delegatePart = (ruleElement.extendedBy ?? [])
                .map((extendedBy: string) => `if (is${extendedBy}(element)) { return this.serialize${extendedBy}(element); }`)
                .join('\n    ');

            let bodyPart = '';
            if (!ruleElement.isAbstract) {
                const typeLine = ruleElement.isRoot ? '' : `str.push('"__type": "${ruleElement.name}"');\n    `;
                const propLines = (ruleElement.definitions ?? [])
                    .map((property: any) => buildPropertyCall(property, referenceProperty))
                    .join('\n    ');
                bodyPart = typeLine + propLines;
            }

            return `serialize${ruleElement.name}(element: ${ruleElement.name}): string {
    let str: Array<string> = [];
    ${delegatePart}${bodyPart}
    return '{' + str.join(',\\n') + '}';
  }`;
        })
        .join('\n\n  ');
}

function buildPropertyCall(property: Definition, referenceProperty: string): string {
    const lines: string[] = [];
    lines.push(`if (element.${property.name} !== undefined && element.${property.name} !== null) {`);
    if (property.multiplicity === Multiplicity.ONE_TO_ONE) {
        lines.push(
            `  str.push('"${property.name}": ' + ${serializePropertyValue(property, 'element.' + property.name, referenceProperty)});`
        );
    } else {
        lines.push(`  str.push('"${property.name}": ['+`);
        lines.push(
            `    element.${property.name}.map(property => ${serializePropertyValue(property, 'property', referenceProperty)}).join(",")`
        );
        lines.push(`  +']');`);
    }
    lines.push('}');
    return lines.join('\n    ');
}

function serializePropertyValue(property: Definition, elementString: string, referenceProperty: string): string {
    if (property.crossReference) {
        return (
            `'{' + ' "__type": "Reference", "__refType": "${property.type!.typeName}", "__value": "' + (` +
            elementString +
            `.ref?.${referenceProperty} ?? "undefined")` +
            ` + '"}'`
        );
    } else if (SIMPLE_TYPES.includes(property.type!.typeName)) {
        return property.type!.typeName === 'string' ? `'"' + ${elementString} + '"'` : `${elementString}+ ""`;
    } else {
        if (property.type!.type === 'constant') {
            return `'"' + ${elementString}+ '"'`;
        } else {
            return `this.serialize${property.type!.typeName}(${elementString})`;
        }
    }
}

function buildRootElementSerializer(rules: LangiumGrammar, referenceProperty: string): string {
    const rootElement = rules.entryRule;
    const lines = [`if (is${rootElement.name}(root)) {`];
    for (const ruleElement of rootElement.definitions) {
        if (SIMPLE_TYPES.includes(ruleElement.type!.typeName) || ruleElement.type!.type === 'constant') {
            lines.push(`  str.push('"${ruleElement.name}": root.${ruleElement.name}');`);
        } else if (ruleElement.multiplicity === Multiplicity.ONE_TO_ONE) {
            lines.push(`  str.push('"${ruleElement.name}": ' + this.serialize${ruleElement.type!.typeName}(root.${ruleElement.name}));`);
        } else {
            lines.push(
                `  str.push('"${ruleElement.name}": [\\n' + root.${ruleElement.name}.map(element => '' + this.serialize${ruleElement.type!.typeName}(element)).join(",\\n") + '\\n]');`
            );
        }
    }
    lines.push('}');
    return lines.join('\n    ');
}
