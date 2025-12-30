/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { ESBuildRunner, reactConfig, rootConfig } from '../../esbuild.config.mjs';

const runner = new ESBuildRunner({
    ...rootConfig,
    ...reactConfig,
    outdir: 'dist',
    entryNames: 'bundle',
    entryPoints: ['src/extension.ts', 'src/main.ts'],
    format: 'cjs',
    outExtension: {
        '.js': '.cjs'
    },
    tsconfig: './tsconfig.json'
});
runner.clear();
await runner.run();
