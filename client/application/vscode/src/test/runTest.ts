/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { runTests } from '@vscode/test-electron';
import * as path from 'path';

async function main() {
    try {
        // __dirname at runtime: <repo>/application/vscode/lib/test/test
        // Go up three levels: test -> test -> lib -> application/vscode
        const extensionDevelopmentPath = path.resolve(__dirname, '../../../');

        // IMPORTANT: point directly to the compiled CJS file
        const extensionTestsPath = path.resolve(__dirname, './suite/index.cjs');

        await runTests({
            extensionDevelopmentPath,
            extensionTestsPath
        });
    } catch (err) {
        console.error('Failed to run tests');
        if (err) {
            console.error(err);
        }
        process.exit(1);
    }
}

main();
