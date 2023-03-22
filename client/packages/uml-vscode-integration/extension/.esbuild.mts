import * as esbuild from 'esbuild';

// TODO: Switch to arguments

const options: esbuild.BuildOptions = {
    entryPoints: ['./src/index.ts'],
    outfile: './lib/main.js',
    bundle: true,
    sourcemap: true,
    color: true,
    minify: process.env.ES_MINIFY ? true : false,
    logLevel: 'info',
    format: 'cjs',
    platform: 'node',
    external: ['vscode'],
    loader: {
        '.png': 'dataurl',
        '.woff': 'dataurl',
        '.woff2': 'dataurl',
        '.eot': 'dataurl',
        '.ttf': 'dataurl',
        '.svg': 'dataurl'
    }
};

if (process.env.ES_WATCH) {
    const context = await esbuild.context(options);
    await context.watch();
} else {
    await esbuild.build(options);
}
