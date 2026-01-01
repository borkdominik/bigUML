/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import prettier from 'prettier';
import { type Definition, type LangiumGrammar, Multiplicity } from '../types/index.js';
import { getReturnTypeFromDefinitions } from '../util.js';
const SIMPLE_TYPES = ['string', 'number', 'boolean'];
let referenceProperty = '__id';

export function generateSerializer(rules: LangiumGrammar, languageId: string, languageName: string, generatorConfig: any) {
    referenceProperty = generatorConfig.referenceProperty ?? '__id';
    const rootElement = rules.entryRule;
    const serializerText = `
      /********************************************************************************
     * Copyright (c) 2023 CrossBreeze.
     ********************************************************************************/

    import { DiagramSerializer, Serializer } from "@borkdominik-biguml/model-server";
    import { ${rules.entryRule.name}, is${rules.entryRule.name}, ${rules.parserRules
        .map(ruleElement => ruleElement.name + ',' + 'is' + ruleElement.name)
        .concat(rules.typeRules.map(ruleElement => ruleElement.name + ',' + 'is' + ruleElement.name).flat())
        .join(',')} } from "../generated/ast.js";
    import { ${languageName}Services } from "./${languageId}-module.js";
    import { AstNode } from "langium";

    export class ${languageName}Serializer
      implements Serializer<${rootElement.name}>, DiagramSerializer<${rootElement.name}>
    {
      constructor(protected services: ${languageName}Services) {}

      serialize(root: AstNode): string {
        let str: Array<string> = [];
        ${rootElementSerializer(rules)}
        str = str.filter(element => !!element);
        const json = JSON.parse("{\\n" + str.join(",\\n") + "\\n}");
        return JSON.stringify(json,undefined,'\\t');
      }

      ${ruleElementSerializer(rules)}

      ${typeRuleElementSerializer(rules)}

      public asDiagram(root: ${rootElement.name}): string {
        return "";
      }
    }

      `;

    return prettier.format(serializerText, {
        parser: 'typescript',
        trailingComma: 'es5'
    });
}
function typeRuleElementSerializer(rules: LangiumGrammar): string {
    return rules.typeRules
        .map(ruleElement => {
            let text = '';
            const retType = getReturnTypeFromDefinitions(ruleElement.definitions);
            text += `serialize${ruleElement.name}(element: ${ruleElement.name}): any {
            ${
                retType
                    ? `return ${retType === 'string' ? `'"' + element + '"'` : 'element'};`
                    : ruleElement.definitions
                          .map(element => {
                              return `if (is${element.typeName}(element)) {
                      return this.serialize${element.typeName}(element);
                  }`;
                          })
                          .join('\n')
            }}`;
            return text;
        })
        .join('\n\n');
}
function ruleElementSerializer(rules: LangiumGrammar): string {
    return (rules.parserRules as any[])
        .concat({
            ...rules.entryRule,
            isAbstract: false,
            extendedBy: [],
            isRoot: true
        })
        .map(ruleElement => {
            let text = '';
            text += `serialize${ruleElement.name}(element: ${ruleElement.name}): string {
            let str: Array<string> = [];
            ${
                `${ruleElement.extendedBy
                    .map((extendedBy: any) => `if (is${extendedBy}(element)) {return this.serialize${extendedBy}(element);}`)
                    .join('\n')}` +
                (ruleElement.isAbstract
                    ? ''
                    : (ruleElement.isRoot ? '' : `str.push('"__type": "${ruleElement.name}"');\n`) +
                      ruleElement.definitions
                          .map((property: any) => {
                              const propertyText: string[] = [
                                  `if (element.${property.name} !== undefined && element.${property.name} !== null) {`
                              ];
                              if (property.multiplicity === Multiplicity.ONE_TO_ONE) {
                                  propertyText.push(
                                      `str.push('"${property.name}": ' + ${serializePropertyValue(property, 'element.' + property.name)})`
                                  );
                              } else {
                                  propertyText.push(`str.push('"${property.name}": ['+
                    element.${property.name}.map(property => ${serializePropertyValue(property, 'property')}).join(",")
                  +']')`);
                              }
                              propertyText.push('}');
                              return propertyText.join('\n');
                          })
                          .join('\n'))
            }
            return '{' + str.join(',\\n') + '}';
          }`;
            return text;
        })
        .join('\n\n');
}
function serializePropertyValue(property: Definition, elementString: string = 'element') {
    let propertyText = '';
    if (property.crossReference) {
        propertyText =
            `'{' +' "__type": "Reference", "__refType": "${property.type!.typeName}", "__value": "' + (` +
            elementString +
            '.ref?.' +
            referenceProperty +
            ' ?? "undefined")' +
            ` + '"}'`;
    } else if (SIMPLE_TYPES.includes(property.type!.typeName)) {
        propertyText = `${property.type!.typeName === 'string' ? `'"' + ` + elementString + `+ '"'` : elementString + '+ ""'}`;
    } else {
        if (property.type!.type === 'constant') {
            propertyText = `'"' + ` + elementString + `+ '"'`;
        } else {
            propertyText = `this.serialize${property.type!.typeName}(${elementString})`;
        }
    }
    return propertyText;
}
function rootElementSerializer(rules: LangiumGrammar): string {
    const rootElement = rules.entryRule;
    const text = `if (is${rootElement.name}(root)) {
      ${rootElement.definitions
          .map(ruleElement =>
              SIMPLE_TYPES.includes(ruleElement.type!.typeName) || ruleElement.type!.type === 'constant'
                  ? `str.push(${`'"${ruleElement.name}": root.${ruleElement.name}'`})`
                  : ruleElement.multiplicity === Multiplicity.ONE_TO_ONE
                    ? `str.push(${`'"${ruleElement.name}": ' + this.serialize${ruleElement.type!.typeName}(root.${ruleElement.name})`})`
                    : `
            str.push(${`'"${ruleElement.name + '": [\\n'}' +  root.${ruleElement.name}.map(element => '' + this.serialize${
                ruleElement.type!.typeName
            }(element)).join(",\\n") + '\\n]'`})
          `
          )
          .join('')}
        }`;
    return text;
}
