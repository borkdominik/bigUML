/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import chalk from "chalk";

export function checkGeneratorConfigValidity(config: any) {
  if (typeof config.referenceProperty !== "string") {
    throw new Error(
      chalk.red(
        "Reference Property must be of type string. Change the referenceProperty Parameter within the generator-config file to a valid value."
      )
    );
  }
}
