import * as es from 'esbuild';
import { copy } from 'esbuild-plugin-copy';

const args = process.argv.slice(2);
const watch = args.includes('--watch');
const outFolder = './bundle';
const copyFolders = ['../uml-vscode-integration/extension/bundles/uml-components'];

const componentsConfig: es.BuildOptions = {
    bundle: true,
    minify: process.env.NODE_ENV === 'production',
    sourcemap: process.env.NODE_ENV !== 'production',
    target: 'es2020',
    format: 'esm',
    entryPoints: ['./src/index.ts'],
    outfile: `${outFolder}/main.js`,
    color: true,
    logLevel: 'info',
    plugins: [
        copy({
            // this is equal to process.cwd(), which means we use cwd path as base path to resolve `to` path
            // if not specified, this plugin uses ESBuild.build outdir/outfile options as base path.
            resolveFrom: 'cwd',
            assets: {
                from: ['./bundle/*'],
                to: copyFolders
            },
            watch
        })
    ]
};

(async () => {
    try {
        if (watch) {
            const context = await es.context(componentsConfig);
            await context.watch();
        } else {
            await es.build(componentsConfig);
        }
    } catch (err) {
        process.stderr.write(err.stderr);
        process.exit(1);
    }
})();
