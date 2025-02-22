/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { copy } from 'esbuild-plugin-copy';
import { ESBuildRunner, rootConfig } from '../../esbuild.config.mjs';

const runner = new ESBuildRunner({
    ...rootConfig,
    outdir: 'dist',
    entryNames: 'bundle',
    entryPoints: ['./src/web/index.ts'],
    tsconfig: './tsconfig.json',
    plugins: [
        copy({
            resolveFrom: 'cwd',
            assets: [
                {
                    from: ['dist/**/*'],
                    to: ['../../application/vscode/webviews/glsp-client']
                }
            ]
        })
    ]
});
runner.clear();
await runner.run();
