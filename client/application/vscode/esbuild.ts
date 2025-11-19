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
    entryPoints: ['./src/index.ts'],
    outfile: './lib/main.cjs',
    platform: 'node',
    mainFields: ['module', 'main'],
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
                }
            ]
        })
    ]
};

/**
 * 2) Test bundle (runTest + mocha suite)
 */
const testConfig: es.BuildOptions = {
    ...rootConfig,
    minify: false,
    sourcemap: true,
    entryPoints: ['./src/test/runTest.ts', './src/test/suite/index.ts', './src/test/suite/advancedSearch.test.ts'],
    outdir: './lib/test',
    platform: 'node',
    mainFields: ['module', 'main'],
    format: 'cjs',
    outExtension: {
        '.js': '.cjs'
    },
    external: ['vscode', '@vscode/test-electron', 'mocha']
};

const extensionRunner = new ESBuildRunner(extensionConfig);
await extensionRunner.run();

const testRunner = new ESBuildRunner(testConfig);
await testRunner.run();
