/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import ts from "typescript";
import { Multiplicity, type Property } from "../types/index.js";

export const visitTypeReferenceNode = (target: Property) => (node: ts.Node) => {
  if (ts.isIdentifier(node)) {
    if (node.text === "Array") {
      target.multiplicity = target.isOptional
        ? Multiplicity.ZERO_TO_N
        : Multiplicity.ONE_TO_N;
    } else if (node.text === "CrossReference") {
      target.decorators.push("crossReference");
    } else {
      target.types.push({ type: "complex", typeName: node.text });
    }
  } else if (ts.isTypeReferenceNode(node)) {
    ts.forEachChild(node, visitTypeReferenceNode(target));
  } else if (
    node.kind === ts.SyntaxKind.StringKeyword ||
    node.kind === ts.SyntaxKind.NumberKeyword ||
    node.kind === ts.SyntaxKind.BooleanKeyword
  ) {
    target.types.push({ type: "simple", typeName: node.getText() });
  }
};
