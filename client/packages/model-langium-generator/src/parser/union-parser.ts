/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import ts, { SyntaxKind } from "typescript";
import { type Property } from "../types/index.js";
import { visitTypeReferenceNode } from "./type-reference-parser.js";

export const visitUnionType = (target: Property) => (node: ts.Node) => {
  if (
    node.kind === SyntaxKind.NumberKeyword ||
    node.kind === SyntaxKind.BooleanKeyword ||
    node.kind === SyntaxKind.StringKeyword
  ) {
    target.types.push({ type: "simple", typeName: node.getText() });
  } else if (ts.isTypeReferenceNode(node)) {
    ts.forEachChild(node, visitTypeReferenceNode(target));
  } else if (ts.isLiteralTypeNode(node)) {
    ts.forEachChild(node, (child) => {
      if (
        ts.isStringLiteral(child) ||
        ts.isNumericLiteral(child) ||
        child.kind === ts.SyntaxKind.TrueKeyword ||
        child.kind === ts.SyntaxKind.FalseKeyword
      ) {
        const text = child.getText().replace(/'/g, "");
        target.types.push({ type: "constant", typeName: JSON.stringify(text) });
      }
    });
  }
};
