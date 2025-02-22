/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import pluginHeader from 'eslint-plugin-header';
import pluginN from 'eslint-plugin-n';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

pluginHeader.rules.header.meta.schema = false;

export const coreConfig = tseslint.config(
    {
        name: 'ignore-global',
        ignores: ['**/lib/**/*', '**/dist/**/*', '**/node_modules/**/*']
    },
    {
        name: 'match-global',
        files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            },
            globals: { ...globals.browser, ...globals.node }
        }
    },
    {
        name: 'custom',
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
            '@typescript-eslint/no-unused-vars': 'off',
            // '@typescript-eslint/no-unused-vars': [
            //     'warn',
            //     {
            //         args: 'all',
            //         argsIgnorePattern: '^_',
            //         caughtErrors: 'all',
            //         caughtErrorsIgnorePattern: '^_',
            //         destructuredArrayIgnorePattern: '^_',
            //         varsIgnorePattern: '^_',
            //         ignoreRestSiblings: true
            //     }
            // ],
            '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports', fixStyle: 'inline-type-imports' }]
        }
    },
    // Patched rules
    {
        name: 'header',
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

export const reactConfig = tseslint.config(
    {
        name: 'react-recommended',
        ...react.configs.flat.recommended,
        settings: {
            react: {
                version: 'detect'
            }
        },
        ignores: ['**/big-components/**/*.*', '**/uml-glsp-client/**/*.*']
    },
    {
        name: 'jsx-runtime',
        ...react.configs.flat['jsx-runtime']
    },
    {
        name: 'react-hooks',
        plugins: {
            'react-hooks': reactHooks
        },
        rules: { ...reactHooks.configs.recommended.rules, 'react-hooks/exhaustive-deps': 'error' },
        ignores: ['**/big-components/**/*.*', '**/uml-glsp-client/**/*.*']
    }
);

export default tseslint.config(coreConfig, reactConfig);
