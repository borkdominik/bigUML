/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

// @ts-check

/**
 * Local oxlint JS plugin (ESLint plugin API). Replaces `eslint-plugin-header`:
 * every source file has to start with a block comment containing the copyright line.
 */

const COPYRIGHT = /[\n\r]+ \* Copyright \([cC]\) \d{4}(-\d{4})? .*[\n\r]+/;

const header = () => `/*********************************************************************************
 * Copyright (c) ${new Date().getFullYear()} borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
`;

const headerRule = {
    meta: {
        type: 'layout',
        fixable: 'code',
        docs: { description: 'Require the bigUML copyright header' },
        messages: { missing: 'Missing or malformed copyright header.' }
    },
    create(context) {
        return {
            Program() {
                const text = context.sourceCode.text;
                // Keep a shebang line (e.g. `#!/usr/bin/env tsx`) in front of the header
                const start = text.startsWith('#!') ? text.indexOf('\n') + 1 : 0;
                const body = text.slice(start);
                const end = body.startsWith('/*') ? body.indexOf('*/') : -1;
                if (end !== -1 && COPYRIGHT.test(body.slice(2, end))) {
                    return;
                }
                context.report({
                    loc: { line: 1, column: 0 },
                    messageId: 'missing',
                    fix: fixer => fixer.insertTextBeforeRange([start, start], header())
                });
            }
        };
    }
};

export default {
    meta: { name: 'biguml' },
    rules: { header: headerRule }
};
