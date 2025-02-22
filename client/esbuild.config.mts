/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import * as es from 'esbuild';
import * as fs from 'fs';

export const reactConfig: es.BuildOptions = {
    jsx: 'automatic',
    alias: {
        react: 'react'
    }
};

export const rootConfig: es.BuildOptions = {
    bundle: true,
    minify: process.env.NODE_ENV === 'production',
    sourcemap: process.env.NODE_ENV !== 'production' ? 'inline' : false,
    format: 'esm',
    outbase: 'src',
    color: true,
    logLevel: 'info',
    loader: {
        '.png': 'dataurl',
        '.jpg': 'dataurl',
        '.jpeg': 'dataurl',
        '.svg': 'dataurl',
        '.gif': 'dataurl',
        '.ttf': 'dataurl'
    }
};

export class ESBuildRunner {
    constructor(protected readonly config: es.BuildOptions) {}

    get args(): string[] {
        return process.argv.slice(2);
    }

    get isWatch(): boolean {
        return this.args.includes('--watch');
    }

    clear(): void {
        if (!this.config.outdir) {
            throw new Error('No outdir specified');
        }

        fs.rmSync(this.config.outdir, { recursive: true, force: true });
    }

    async run(): Promise<void> {
        try {
            if (this.isWatch) {
                await this.watch();
            } else {
                await this.build();
            }
        } catch (_err) {
            process.exit(1);
        }
    }

    async build(): Promise<void> {
        await es.build(this.config);
    }

    async watch(): Promise<void> {
        const context = await es.context(this.config);
        await context.watch();
    }
}
