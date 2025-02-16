/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

// @ts-check

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  singleQuote: true,
  jsxSingleQuote: true,
  arrowParens: "avoid",
  trailingComma: "none",
  endOfLine: "lf",
  printWidth: 140,
  tabWidth: 4,
  overrides: [
    {
      files: ["*.json", "*.yml"],
      options: {
        printWidth: 100,
        tabWidth: 2,
      },
    },
  ],
  plugins: ["prettier-plugin-packagejson"],
};

export default config;
