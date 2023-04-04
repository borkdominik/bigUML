import * as esbuild from 'esbuild';

const minify = process.argv.includes('--es-minify');
const watch = process.argv.includes('--es-watch');

const options: esbuild.BuildOptions = {
    entryPoints: ['./src/index.ts'],
    outfile: './lib/main.js',
    bundle: true,
    sourcemap: true,
    color: true,
    minify,
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

if (watch) {
    const context = await esbuild.context(options);
    await context.watch();
} else {
    await esbuild.build(options);
}
