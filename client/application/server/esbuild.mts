//@ts-check
import * as esbuild from 'esbuild';

const watch = process.argv.includes('--watch');
const minify = process.argv.includes('--minify');

const success = watch ? 'Watch build succeeded' : 'Build succeeded';

function getTime(): string {
    const date = new Date();
    return `[${`${padZeroes(date.getHours())}:${padZeroes(date.getMinutes())}:${padZeroes(date.getSeconds())}`}] `;
}

function padZeroes(i: number): string {
    return i.toString().padStart(2, '0');
}

const plugins: esbuild.Plugin[] = [
    {
        name: 'watch-plugin',
        setup(build) {
            build.onEnd(result => {
                if (result.errors.length === 0) {
                    console.log(getTime() + success);
                }
            });
        }
    }
];

const ctx = await esbuild.context({
    // Entry points for the vscode extension and the language server
    entryPoints: ['src/extension.ts', 'src/main.ts'],
    outdir: 'out',
    bundle: true,
    target: 'ES2017',
    // VSCode's extension host is still using cjs, so we need to transform the code
    format: 'cjs',
    // To prevent confusing node, we explicitly use the `.cjs` extension
    outExtension: {
        '.js': '.cjs'
    },
    loader: { '.ts': 'ts', '.ttf': 'dataurl' },
    external: ['vscode'],
    platform: 'node',
    sourcemap: !minify,
    minify,
    plugins
});

if (watch) {
    await ctx.watch();
} else {
    await ctx.rebuild();
    ctx.dispose();
}
