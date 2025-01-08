import * as es from 'esbuild';
import * as fs from 'fs';

const args = process.argv.slice(2);
const watch = args.includes('--watch');
const outdir = './bundles';

fs.rmSync(outdir, { recursive: true, force: true });

const componentsConfig: es.BuildOptions = {
    bundle: true,
    minify: process.env.NODE_ENV === 'production',
    sourcemap: process.env.NODE_ENV !== 'production' ? 'inline' : false,
    // target: 'es2020',
    format: 'esm',
    entryNames: '[dir]/bundle',
    entryPoints: ['./src/editor/index.ts', './src/property-palette/index.ts', './src/minimap/index.ts', './src/text-input-palette/index.ts'],
    outbase: 'src',
    outdir,
    color: true,
    logLevel: 'info',
    loader: {
        '.png': 'dataurl',
        '.jpg': 'dataurl',
        '.jpeg': 'dataurl',
        '.svg': 'dataurl',
        '.gif': 'dataurl',
        '.ttf': 'dataurl'
    },
    plugins: []
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
