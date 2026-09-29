/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

/**
 * The only build of the repository. Packages are not compiled on their own: they export their
 * TypeScript sources and everything is bundled from here.
 *
 *   tsx esbuild.ts                 development build (inline source maps)
 *   tsx esbuild.ts --watch         development build + watch
 *   tsx esbuild.ts --production    minified build without source maps
 *   tsx esbuild.ts --analyze       additionally write `build/meta/*.json` (https://esbuild.github.io/analyze/)
 *                                  and print the largest inputs of every bundle
 */
import * as es from 'esbuild';
import * as fs from 'node:fs';
import { createRequire } from 'node:module';
import * as path from 'node:path';

const args = process.argv.slice(2);
const isWatch = args.includes('--watch');
const isProduction = args.includes('--production') || process.env.NODE_ENV === 'production';
const isAnalyze = args.includes('--analyze');

const appDir = import.meta.dirname;
const packagesDir = path.resolve(appDir, '../../packages');
const require = createRequire(import.meta.url);

/**
 * GLSP and sprotty are CommonJS and `require('inversify')`, while our sources `import` it, which
 * would bundle inversify's CJS and ESM builds side by side. Resolve every import to the CJS build
 * so that the whole bundle shares one inversify instance.
 */
const singleInversify: es.Plugin = {
    name: 'single-inversify',
    setup(build) {
        const cjsEntry = require.resolve('inversify');
        build.onResolve({ filter: /^inversify$/ }, () => ({ path: cjsEntry }));
    }
};

/** Copies static assets that are loaded at runtime next to the bundles. */
const copyAssets: es.Plugin = {
    name: 'copy-assets',
    setup(build) {
        build.onEnd(() => {
            const codicons = path.dirname(require.resolve('@vscode/codicons/package.json'));
            fs.cpSync(path.join(codicons, 'dist'), path.join(appDir, 'webviews/assets'), { recursive: true });
            fs.cpSync(path.join(packagesDir, 'big-code-generation/templates'), path.join(appDir, 'templates'), { recursive: true });
        });
    }
};

const common: es.BuildOptions = {
    bundle: true,
    minify: isProduction,
    sourcemap: isProduction ? false : 'inline',
    color: true,
    logLevel: 'info',
    // Replaces the tsconfig lookup. JSX runtimes that differ from React are selected per file by pragma.
    tsconfigRaw: {
        compilerOptions: {
            experimentalDecorators: true,
            useDefineForClassFields: true,
            jsx: 'react-jsx'
        }
    },
    loader: {
        '.png': 'dataurl',
        '.jpg': 'dataurl',
        '.jpeg': 'dataurl',
        '.svg': 'dataurl',
        '.gif': 'dataurl',
        '.ttf': 'dataurl'
    },
    plugins: [singleInversify]
};

const extension: es.BuildOptions = {
    ...common,
    entryPoints: [path.join(appDir, 'src/index.ts'), path.join(appDir, 'src/server.main.ts')],
    outdir: path.join(appDir, 'build'),
    platform: 'node',
    // VS Code loads extensions as CommonJS
    format: 'cjs',
    outExtension: { '.js': '.cjs' },
    mainFields: ['module', 'main'],
    external: ['vscode'],
    logOverride: { 'duplicate-case': 'silent' },
    plugins: [...common.plugins!, copyAssets]
};

/** Webview name (folder below `webviews/`) → entry point */
const webviews: Record<string, string> = {
    'glsp-client': 'uml-glsp-client/src/env/browser/webview/glsp.webview.ts',
    advancedsearch: 'big-advancedsearch/src/env/browser/webview/advancedsearch.webview.tsx',
    'code-generation': 'big-code-generation/src/env/browser/webview/code-generation.webview.tsx',
    minimap: 'big-minimap/src/env/browser/webview/minimap.webview.tsx',
    'property-palette': 'big-property-palette/src/env/browser/webview/property-palette.webview.tsx',
    'revision-management': 'big-revision-management/src/env/browser/webview/revision-management.webview.tsx'
};

const webviewsDir = path.join(appDir, 'webviews');

/** Chunk names contain a content hash; remove the chunks of the previous (watch) build before writing new ones. */
const cleanChunks: es.Plugin = {
    name: 'clean-chunks',
    setup(build) {
        build.onStart(() => fs.rmSync(path.join(webviewsDir, 'chunks'), { recursive: true, force: true }));
    }
};

/**
 * All webviews are bundled in one build so that code they share (React, GLSP, sprotty, our packages)
 * is split into common chunks below `webviews/chunks/` instead of being duplicated in every bundle.
 * The webviews load their bundle as a module script, so the chunks are fetched through `import`.
 */
const webviewBuild: es.BuildOptions = {
    ...common,
    entryPoints: Object.fromEntries(Object.entries(webviews).map(([name, entry]) => [`${name}/bundle`, path.join(packagesDir, entry)])),
    outdir: webviewsDir,
    platform: 'browser',
    format: 'esm',
    splitting: true,
    chunkNames: 'chunks/[name]-[hash]',
    plugins: [...common.plugins!, cleanChunks]
};

const builds: [name: string, options: es.BuildOptions][] = [
    ['extension', extension],
    ['webviews', webviewBuild]
];

fs.rmSync(path.join(appDir, 'build'), { recursive: true, force: true });
for (const name of Object.keys(webviews)) {
    fs.rmSync(path.join(webviewsDir, name), { recursive: true, force: true });
}

async function writeAnalysis(name: string, metafile: es.Metafile): Promise<void> {
    const metaDir = path.join(appDir, 'build/meta');
    fs.mkdirSync(metaDir, { recursive: true });
    fs.writeFileSync(path.join(metaDir, `${name}.json`), JSON.stringify(metafile));
    console.log(`\n${name}:${await es.analyzeMetafile(metafile, { color: true })}`);
}

if (isWatch) {
    const contexts = await Promise.all(builds.map(([, options]) => es.context(options)));
    await Promise.all(contexts.map(context => context.watch()));
} else {
    const results = await Promise.allSettled(builds.map(([, options]) => es.build({ ...options, metafile: isAnalyze })));
    if (results.some(result => result.status === 'rejected')) {
        process.exit(1);
    }
    if (isAnalyze) {
        for (const [index, result] of results.entries()) {
            if (result.status === 'fulfilled' && result.value.metafile) {
                await writeAnalysis(builds[index][0], result.value.metafile);
            }
        }
    }
}
