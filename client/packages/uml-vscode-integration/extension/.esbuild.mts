import * as esbuild from 'esbuild';

const options: esbuild.BuildOptions = {
    entryPoints: ['./src/index.ts'],
    outfile: './lib/main.js',
    bundle: true,
    sourcemap: true,
    logLevel: 'info',
    format: 'cjs',
    platform: 'node',
    external: ['vscode'],
    loader: {
        '.ts': 'ts',
        '.png': 'dataurl',
        '.woff': 'dataurl',
        '.woff2': 'dataurl',
        '.eot': 'dataurl',
        '.ttf': 'dataurl',
        '.svg': 'dataurl'
    }
};

// TODO: Switch to arguments

if (process.env.ES_WATCH) {
    const context = await esbuild.context(options);
    await context.watch();
} else {
    await esbuild.build(options);
}
