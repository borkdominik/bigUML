/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    extends: ['@eclipse-glsp'],
    ignorePatterns: ['**/{node_modules,lib}', '**/.eslintrc.cjs'],
    plugins: ['import'],
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: 'tsconfig.eslint.json'
    },
    rules: {
        // turn import issues off as eslint cannot handle ES modules
        'import/no-unresolved': 'off',
        'no-null/no-null': 'off',
        'no-shadow': 'off',
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
        '@typescript-eslint/no-shadow': ['error'],
        '@typescript-eslint/no-var-requires': 'off',
        'header/header': [
            2,
            'block',
            [
                {
                    pattern: '[\n\r]+ \\* Copyright \\([cC]\\) \\d{4}(-\\d{4})? .*[\n\r]+',
                    template: `********************************************************************************
* Copyright (c) 2025 borkdominik and others.
*
* This program and the accompanying materials are made available under the
* terms of the MIT License which is available at https://opensource.org/licenses/MIT.
*
* SPDX-License-Identifier: MIT
********************************************************************************`
                }
            ]
        ]
    }
};
