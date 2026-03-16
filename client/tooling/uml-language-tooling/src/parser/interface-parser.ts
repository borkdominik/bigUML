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
import { visitPropertyDeclaration } from "./property-parser.js";

export const visitInterfaceDeclaration =
  (target: Declaration) => (node: ts.Node) => {
    if (ts.isIdentifier(node)) {
      target.name = node.text;
    } else if (ts.isPropertySignature(node)) {
      const property: Property = {
        decorators: [],
        isOptional: false,
        types: [],
        multiplicity: Multiplicity.ONE_TO_ONE,
      } as any as Property;
      target.properties!.push(property);
      ts.forEachChild(node, visitPropertyDeclaration(property));
    } else if (ts.isHeritageClause(node)) {
      ts.forEachChild(node, (child) => {
        if (ts.isExpressionWithTypeArguments(child)) {
          ts.forEachChild(child, (child) => {
            if (ts.isIdentifier(child)) {
              if (child.text === "ABSTRACT_ELEMENT") {
                target.isAbstract = true;
              } else if (child.text === "ROOT_ELEMENT") {
                target.decorators!.push("root");
              } else {
                target.extends!.push(child.getText());
              }
            }
          });
        }
      });
    }
  };
