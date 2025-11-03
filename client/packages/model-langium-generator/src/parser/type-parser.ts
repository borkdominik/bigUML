/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import ts from "typescript";
import { type Declaration, Multiplicity, type Property } from "../types/index.js";
import { visitTypeReferenceNode } from "./type-reference-parser.js";
import { visitUnionType } from "./union-parser.js";

export const visitTypeDeclaration =
  (target: Declaration) => (node: ts.Node) => {
    const property = {
      decorators: [],
      isOptional: true,
      types: [],
      multiplicity: Multiplicity.ONE_TO_ONE,
    } as any as Property;
    if (ts.isIdentifier(node)) {
      target.name = node.text;
    } else if (ts.isUnionTypeNode(node)) {
      target.properties!.push(property);
      ts.forEachChild(node, visitUnionType(property));
    } else if (ts.isTypeReferenceNode(node)) {
      target.properties!.push(property);
      ts.forEachChild(node, visitTypeReferenceNode(property));
    } else if (ts.isLiteralTypeNode(node)) {
      target.properties!.push(property);
      ts.forEachChild(node, (child) => {
        if (
          ts.isStringLiteral(child) ||
          ts.isNumericLiteral(child) ||
          child.kind === ts.SyntaxKind.TrueKeyword ||
          child.kind === ts.SyntaxKind.FalseKeyword
        ) {
          property.types.push({ type: "constant", typeName: child.getText() });
        }
      });
    }
  };
