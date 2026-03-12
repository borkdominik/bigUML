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
import { createRequire } from 'module';
import { ESBuildRunner, rootConfig } from '../../esbuild.config.mjs';
const require = createRequire(import.meta.url);

const args = process.argv.slice(2);
const minify = args.includes('--minify');

const extensionConfig: es.BuildOptions = {
    ...rootConfig,
    minify: process.env.NODE_ENV === 'production' || minify,
    sourcemap: process.env.NODE_ENV !== 'production' || !minify,
    entryPoints: ['./src/index.ts'],
    outfile: './lib/main.cjs',
    platform: 'node',
    mainFields: ['module', 'main'],
    // VSCode uses CJS
    format: 'cjs',
    outExtension: {
        '.js': '.cjs'
    },
    external: ['vscode'],
    plugins: [
        copy({
            resolveFrom: 'cwd',
            assets: [
                {
                    from: '../../node_modules/@vscode/codicons/dist/*',
                    to: 'webviews/assets'
                },
                {
                    from: ['./wasm/tree-sitter-java.wasm'],
                    to: ['./lib']
                },
                {
                    from: ['./wasm/tree-sitter.wasm'],
                    to: ['./lib']
                }
            ]
        }),
        {
            name: 'alias-web-tree-sitter-to-cjs',
            setup(build) {
                build.onResolve({ filter: /^web-tree-sitter$/ }, args => {
                    // Resolve the path to the CJS entry manually
                    const cjsPath = require.resolve('web-tree-sitter');
                    return { path: cjsPath };
                });
            }
        }
    ]
};

const runner = new ESBuildRunner(extensionConfig);
await runner.run();
