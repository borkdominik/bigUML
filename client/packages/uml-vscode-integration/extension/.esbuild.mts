import * as es from 'esbuild';

const args = process.argv.slice(2);
const minify = args.includes('--minify');
const watch = args.includes('--watch');

const extensionConfig: es.BuildOptions = {
    bundle: true,
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
    color: true,
    logLevel: 'info',
    loader: {
        '.png': 'dataurl',
        '.woff': 'dataurl',
        '.woff2': 'dataurl',
        '.eot': 'dataurl',
        '.ttf': 'dataurl',
        '.svg': 'dataurl'
    }
};

(async () => {
    try {
        if (watch) {
            const context = await es.context(extensionConfig);
            await context.watch();
        } else {
            await es.build(extensionConfig);
        }
    } catch (err) {
        process.stderr.write(err.stderr);
        process.exit(1);
    }
})();
