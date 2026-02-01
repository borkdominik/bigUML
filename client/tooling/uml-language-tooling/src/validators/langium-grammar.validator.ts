/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import chalk from "chalk";
import { DirectedGraph } from "typescript-graph";
import { type LangiumGrammar, Multiplicity } from "../types/index.js";

interface GraphNode {
  typeArgument: string;
}

function checkGrammarSerializable(lanigiumGrammar: LangiumGrammar) {
  let initialSerializable: Set<string> = new Set();
  const serializableRuleElements: Set<string> = new Set([
    "string",
    "number",
    "boolean",
  ]);
  while (true) {
    initialSerializable = new Set([...serializableRuleElements]);
    if (
      lanigiumGrammar.entryRule.definitions &&
      lanigiumGrammar.entryRule.definitions.length > 0 &&
      lanigiumGrammar.entryRule.definitions.every(
        (definition) =>
          serializableRuleElements.has(definition.type!.typeName) ||
          definition.type!.type === "constant" ||
          definition.optional ||
          definition.multiplicity === Multiplicity.ZERO_TO_N
      )
    ) {
      serializableRuleElements.add(lanigiumGrammar.entryRule.name);
    }
    lanigiumGrammar.parserRules.forEach((parserRule) => {
      if (
        parserRule.definitions &&
        parserRule.definitions.length > 0 &&
        parserRule.definitions.every(
          (definition) =>
            serializableRuleElements.has(definition.type!.typeName) ||
            definition.type!.type === "constant" ||
            definition.optional ||
            definition.multiplicity === Multiplicity.ZERO_TO_N
        )
      ) {
        serializableRuleElements.add(parserRule.name);
      } else if (parserRule.isAbstract && parserRule.extendedBy) {
        if (
          parserRule.extendedBy.every((extendedBy) =>
            serializableRuleElements.has(extendedBy)
          )
        ) {
          serializableRuleElements.add(parserRule.name);
        }
      } else if (
        parserRule.definitions?.length === 0 &&
        parserRule.extendedBy?.length === 0
      ) {
        serializableRuleElements.add(parserRule.name);
      }
    });
    lanigiumGrammar.typeRules.forEach((typeRule) => {
      if (
        typeRule.definitions &&
        typeRule.definitions.length > 0 &&
        typeRule.definitions.every(
          (definition) =>
            serializableRuleElements.has(definition.typeName) ||
            definition.type! === "constant"
        )
      ) {
        serializableRuleElements.add(typeRule.name);
      }
    });
    if (initialSerializable.size === serializableRuleElements.size) {
      break;
    }
  }
  const nonSerializableRuleElements = lanigiumGrammar.parserRules
    .map((declaration) => declaration.name)
    .concat(lanigiumGrammar.typeRules.map((declaration) => declaration.name))
    .concat([lanigiumGrammar.entryRule.name])
    .filter(
      (declarationName) => !serializableRuleElements.has(declarationName)
    );
  if (nonSerializableRuleElements.length > 0) {
    throw new Error(
      chalk.red(
        `ERROR: Can not create grammar with current definition as interfaces [${nonSerializableRuleElements}] are not serializable.`
      )
    );
  }
}

function checkUnusedInterfaces(langiumGrammar: LangiumGrammar) {
  const graph = new DirectedGraph<GraphNode>((node) => node.typeArgument);
  graph.insert({ typeArgument: "string" });
  graph.insert({ typeArgument: "number" });
  graph.insert({ typeArgument: "boolean" });
  graph.insert({ typeArgument: langiumGrammar.entryRule.name });
  langiumGrammar.typeRules.forEach((declaration) => {
    graph.insert({ typeArgument: declaration.name });
  });
  langiumGrammar.parserRules.forEach((declaration) => {
    graph.insert({ typeArgument: declaration.name });
  });
  langiumGrammar.entryRule.definitions?.forEach((definition) => {
    if (definition.type!.type !== "constant") {
      graph.addEdge(langiumGrammar.entryRule.name, definition.type!.typeName);
    }
  });
  langiumGrammar.parserRules.forEach((parserRule) => {
    parserRule.definitions?.forEach((definition) => {
      if (definition.type!.type !== "constant") {
        graph.addEdge(parserRule.name, definition.type!.typeName);
      }
    });
    parserRule.extendedBy.forEach((extend) => {
      graph.addEdge(parserRule.name, extend);
    });
  });
  langiumGrammar.typeRules.forEach((typeRule) => {
    typeRule.definitions?.forEach((definition) => {
      if (definition.type! !== "constant") {
        graph.addEdge(typeRule.name, definition.typeName);
      }
    });
  });

  graph.getNodes().forEach((node) => {
    if (
      !["string", "number", "boolean"].includes(node.typeArgument) &&
      graph.indegreeOfNode(node.typeArgument) === 0 &&
      node.typeArgument !== langiumGrammar.entryRule.name
    ) {
      console.log(
        chalk.yellow(
          `WARNING: Type ${node.typeArgument} has been defined but is never used.`
        )
      );
    }
  });
}

export function checkLangiumGrammar(langiumGrammar: LangiumGrammar) {
  checkUnusedInterfaces(langiumGrammar);
  checkGrammarSerializable(langiumGrammar);
}
