/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

// @ts-check

import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import pluginHeader from 'eslint-plugin-header';
import pluginN from 'eslint-plugin-n';
pluginHeader.rules.header.meta.schema = false;

export default tseslint.config(
    {
        ignores: ['lib/**/*']
    },
    { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
    {
        files: ['src/**/*.{ts,tsx}', '*.mjs'],
        extends: [eslint.configs.recommended, tseslint.configs.recommended],
        plugins: {
            n: pluginN
        },
        rules: {
            'no-unused-vars': 'off',
            'no-restricted-imports': [
                'error',
                {
                    paths: [
                        {
                            name: 'sprotty',
                            message:
                                "The sprotty default exports are customized and reexported by GLSP. Please use '@eclipse-glsp/client' instead"
                        },
                        {
                            name: 'sprotty-protocol',
                            message:
                                "The sprotty-protocol default exports are customized and reexported by GLSP. Please use '@eclipse-glsp/client' instead"
                        }
                    ],
                    patterns: []
                }
            ],
            'n/file-extension-in-import': ['error', 'always'],
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-namespace': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true
                }
            ],
            '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports', fixStyle: 'inline-type-imports' }]
        }
    },

    // Patched rules
    {
        files: ['src/**/*.{mjs,ts,tsx}', '*.mjs'],
        plugins: {
            header: pluginHeader
        },
        rules: {
            'header/header': [
                2,
                'block',
                [
                    {
                        pattern: '[\n\r]+ \\* Copyright \\([cC]\\) \\d{4}(-\\d{4})? .*[\n\r]+',
                        template: `*********************************************************************************
* Copyright (c) ${new Date().getFullYear()} borkdominik and others.
*
* This program and the accompanying materials are made available under the
* terms of the MIT License which is available at https://opensource.org/licenses/MIT.
*
* SPDX-License-Identifier: MIT
*********************************************************************************`
                    }
                ]
            ]
        }
    }
);
