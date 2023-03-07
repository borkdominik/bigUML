/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    extends: ['@eclipse-glsp'],
    ignorePatterns: ['**/{node_modules,lib}', '**/.eslintrc.js'],
    plugins: ['import'],
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: 'tsconfig.eslint.json'
    },
    rules: {
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
    }
};
