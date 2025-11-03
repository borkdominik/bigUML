/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import ts from "typescript";
import { type Declaration } from "../types/index.js";
import { visitClassDeclaration } from "./class-parser.js";
import { visitInterfaceDeclaration } from "./interface-parser.js";
import { visitTypeDeclaration } from "./type-parser.js";

export const visit = (target: Array<Declaration>) => (node: ts.Node) => {
  const declaration: Declaration = {
    type:
      ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node)
        ? "class"
        : "type",
    isAbstract: ts.isTypeAliasDeclaration(node),
    decorators: [],
    properties: [],
    extends: [],
  };
  if (ts.isClassDeclaration(node)) {
    target.push(declaration);
    ts.forEachChild(node, visitClassDeclaration(declaration));
  } else if (ts.isTypeAliasDeclaration(node)) {
    target.push(declaration);
    ts.forEachChild(node, visitTypeDeclaration(declaration));
  } else if (ts.isInterfaceDeclaration(node)) {
    target.push(declaration);
    ts.forEachChild(node, visitInterfaceDeclaration(declaration));
  }
};
