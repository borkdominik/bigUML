/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type * as es from 'esbuild';
import { copy } from 'esbuild-plugin-copy';
import { ESBuildRunner, rootConfig } from '../../esbuild.config.mjs';

const args = process.argv.slice(2);
const minify = args.includes('--minify');

const extensionConfig: es.BuildOptions = {
    ...rootConfig,
    minify: process.env.NODE_ENV === 'production' || minify,
    sourcemap: process.env.NODE_ENV !== 'production' || !minify,
    entryPoints: ['./src/index.ts', './src/main.ts'],
    platform: 'node',
    mainFields: ['module', 'main'],
    outdir: 'lib',
    // VSCode uses CJS
    format: 'cjs',
    outExtension: {
        '.js': '.cjs'
    },
    external: ['vscode'],
    logOverride: {
        'duplicate-case': 'silent'
    },
    plugins: [
        copy({
            resolveFrom: 'cwd',
            assets: [
                {
                    from: '../../node_modules/@vscode/codicons/dist/*',
                    to: 'webviews/assets'
                }
            ]
        })
    ]
};

const runner = new ESBuildRunner(extensionConfig);
await runner.run();
