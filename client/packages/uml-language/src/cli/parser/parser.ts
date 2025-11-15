/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import fs from "fs";
import prettier from "prettier";
import ts from "typescript";
import { type Declaration } from "../types/index.js";
import { visitGeneratorConfigFile } from "./generator-config-parser.js";
import { visit } from "./typescript-file-parser.js";

export async function parseDefinitionFile(
  path: any
): Promise<Array<Declaration>> {
  const definitionFileContent = fs.readFileSync(path, "utf8");
  const formattedDefinitionFile = await prettier.format(definitionFileContent, {
    parser: "typescript",
    trailingComma: "es5",
  });
  fs.writeFileSync(path, formattedDefinitionFile);
  const program = ts.createProgram([path], {
    target: ts.ScriptTarget.ES2022,
  });
  program.getTypeChecker();
  const source = program.getSourceFile(path);
  const declarations: Array<Declaration> = [];
  ts.forEachChild(source!, visit(declarations));
  return declarations;
}

export function parseLangiumConfigFile(path: string) {
  const file = JSON.parse(fs.readFileSync(path).toString());
  const languageName = file.projectName;
  const languageId = file.languages[0].id;
  return { languageName, languageId };
}

export function parseGeneratorConfigFile(path: string) {
  const program = ts.createProgram([path], {
    target: ts.ScriptTarget.ES2022,
  });
  program.getTypeChecker();
  const source = program.getSourceFile(path);

  const properties: any = {};

  ts.forEachChild(source!, visitGeneratorConfigFile(properties));
  if (!properties["referenceProperty"]) {
    properties["referenceProperty"] = "__id";
  }
  return properties;
}
