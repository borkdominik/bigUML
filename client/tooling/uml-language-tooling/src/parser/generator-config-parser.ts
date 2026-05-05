/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import ts from "typescript";

export const visitGeneratorConfigFile = (target: any) => (node: ts.Node) => {
  if (ts.isVariableStatement(node)) {
    ts.forEachChild(node, visitGeneratorConfigFile(target));
  } else if (ts.isVariableDeclarationList(node)) {
    ts.forEachChild(node, visitGeneratorConfigFile(target));
  } else if (ts.isVariableDeclaration(node)) {
    node.forEachChild((child) => {
      if (ts.isIdentifier(child) && child.text === "properties") {
        ts.forEachChild(node, visitGeneratorConfigFile(target));
      }
    });
  } else if (ts.isPropertyAssignment(node)) {
    let propertyName = "";
    let propertyValue: any = "";
    node.forEachChild((child) => {
      if (ts.isIdentifier(child)) {
        propertyName = child.text;
      } else if (ts.isStringLiteral(child)) {
        propertyValue = child.text;
      } else if (ts.isNumericLiteral(child)) {
        propertyValue = +child.text;
      }
    });
    target[propertyName] = propertyValue;
  } else {
    ts.forEachChild(node, visitGeneratorConfigFile(target));
  }
};
