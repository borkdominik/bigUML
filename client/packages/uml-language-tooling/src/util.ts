/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import prettier from "prettier";
import { type LangiumGrammar } from "./types/index.js";
import { type Type } from "./types/types.js";

export function getReturnTypeFromDefinitions(definitions: Array<Type>): any {
  if (definitions.every((definition) => definition.type === "simple")) {
    if (definitions.every((definition) => definition.typeName === "number")) {
      return "number";
    } else if (
      definitions.every((definition) => definition.typeName === "boolean")
    ) {
      return "boolean";
    }
  } else if (
    definitions.every((definition) => definition.type === "constant")
  ) {
    let type = "string";
    if (
      definitions.every(
        (definition) => typeof JSON.parse(definition.typeName) === "number"
      )
    ) {
      type = "number";
    } else if (
      definitions.every(
        (definition) => typeof JSON.parse(definition.typeName) === "boolean"
      )
    ) {
      type = "boolean";
    }
    return type;
  }
}

export function isString(langiumGrammar: LangiumGrammar, _type: Type): any {
  if (_type.typeName === "string") return true;
  const typeRule = langiumGrammar.typeRules.find(
    (ruleElement) => ruleElement.name === _type.typeName
  );
  if (typeRule) {
    return getReturnTypeFromDefinitions(typeRule.definitions) === "string";
  }
}

export async function format(content: string): Promise<string> {
  try {
    return await prettier.format(content, {
      parser: "typescript",
      semi: true,
      singleQuote: true,
    });
  } catch {
    console.warn("Prettier formatting failed. Writing raw output.");
    return content;
  }
}
