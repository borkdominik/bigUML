/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import chalk from "chalk";
import { type LangiumDeclaration } from "../types/index.js";

export function checkDeclarationValidity(
  declarations: LangiumDeclaration[]
): void {
  if (
    !declarations.find((declaration) => declaration.decorators!.includes("root"))
  ) {
    throw new Error(
      chalk.red(
        "Grammar has no entry element defined. Add @root decorator to your entry rule class"
      )
    );
  }
  const rootElements = declarations.filter((declaration) =>
    declaration.decorators!.includes("root")
  );
  if (rootElements.length > 1) {
    throw new Error(
      chalk.red(
        "Grammar has too many root elements defined. Remove @root decorator from classes that are not the root element."
      )
    );
  }
  const rootElement = rootElements[0];
  if (!rootElement.properties || rootElement.properties.length === 0) {
    throw new Error(
      chalk.red(
        "Grammar has no elements in root defined. Add properties to class with @root decorator to add elements."
      )
    );
  }
  const abstractErrors = declarations
    .filter((declaration) => declaration.type !== "type")
    .filter(
      (ruleElement) =>
        ruleElement.isAbstract &&
        (!ruleElement.extendedBy || ruleElement.extendedBy.length === 0)
    )
    .map((errorRuleElement) => errorRuleElement.name);
  if (abstractErrors && abstractErrors.length > 0) {
    throw new Error(
      chalk.red(
        `Can not create grammar rule for abstract declaration that is not extended by other declarations. [${abstractErrors.join(
          ", "
        )}]`
      )
    );
  }
}
