/** @type {import('eslint').Linter.Config} */
module.exports = {
    extends: '../../.eslintrc.js',
    rules: {
        "header/header": "off",
        "import/no-unresolved": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "max-len": ["error", { "code": 160 }],
        "chai-friendly/no-unused-expressions": "off"
    }
};
