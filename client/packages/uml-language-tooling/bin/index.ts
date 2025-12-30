#!/usr/bin/env tsx
/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import fs from 'fs';
import { fileURLToPath } from 'node:url';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { buildCreationPathMapping, writeCreationPathFile } from '../src/generator/creation-path-generator.js';
import { buildDefaultValueMapping, writeDefaultValueFile } from '../src/generator/default-value-generator.js';
import { generateLangiumText } from '../src/generator/langium-generator.js';
import { generateSerializer } from '../src/generator/serializer-generator.js';
import { generateValidationFiles } from '../src/generator/validation-generator.js';
import { parseDefinitionFile, parseGeneratorConfigFile, parseLangiumConfigFile } from '../src/parser/parser.js';
import { GeneratorRegistry } from '../src/registry/generator-registry.js';
import { transformDeclaration, transformLangiumDeclarationsToLangiumGrammar } from '../src/transformer.js';
import { type Paths } from '../src/types/index.js';
import { checkDeclarationValidity, checkGeneratorConfigValidity, checkLangiumGrammar } from '../src/validators/index.js';

interface GenerateArgs {
    def: string;
    gen: string;
    langiumConfig?: string;
    generatorConfig?: string;
}

/**
 * Resolves a path that can be either:
 * - A relative/absolute file path (e.g., ./config.json, /absolute/path/config.json)
 * - A node module path (e.g., @foo/bar/config.json, some-package/config.js)
 */
function resolvePath(inputPath: string): string {
    // Check if it's a relative or absolute path
    if (inputPath.startsWith('./') || inputPath.startsWith('../') || path.isAbsolute(inputPath)) {
        return path.resolve(inputPath);
    }

    // Try to resolve as a node module
    return fileURLToPath(import.meta.resolve(inputPath));
}

yargs(hideBin(process.argv))
    .command<GenerateArgs>(
        'generate',
        'Generate language tooling files from TypeScript definitions',
        yargs => {
            return yargs
                .option('def', {
                    alias: 'd',
                    type: 'string',
                    description: 'Path to the language definition file',
                    demandOption: true
                })
                .option('gen', {
                    alias: 'g',
                    type: 'string',
                    description: 'Path to the generated output directory',
                    demandOption: true
                })
                .option('langiumConfig', {
                    type: 'string',
                    description: 'Path to langium-config.json (file path or node module)',
                    default: './langium-config.json'
                })
                .option('generatorConfig', {
                    type: 'string',
                    description: 'Path to generator-config.ts (file path or node module)',
                    default: './generator-config.ts'
                });
        },
        async argv => {
            const srcPath = resolvePath(argv.def);
            const genPath = path.resolve(argv.gen);
            const configPath = resolvePath(argv.langiumConfig ?? './langium-config.json');
            const generatorConfigPath = resolvePath(argv.generatorConfig ?? './generator-config.ts');

            const config = parseLangiumConfigFile(configPath);
            const generatorConfig = parseGeneratorConfigFile(generatorConfigPath);
            checkGeneratorConfigValidity(generatorConfig);

            console.log('Generating from TypeScript definitions at', srcPath);

            const tsDeclarations = await parseDefinitionFile(srcPath);
            const output = JSON.stringify(tsDeclarations, null, 2);

            const outputFolder = path.join(genPath, 'langium');
            if (!fs.existsSync(outputFolder)) {
                fs.mkdirSync(outputFolder, { recursive: true });
            }
            const testFilePath = path.join(outputFolder, 'testkarol.ts');

            fs.writeFileSync(testFilePath, output, { encoding: 'utf8' });
            console.log('DEBUG: Raw declarations have been written to', testFilePath);

            await generate(tsDeclarations, generatorConfig, config, {
                def: srcPath,
                gen: genPath
            });
        }
    )
    .demandCommand(1, 'You need to specify a command')
    .strict()
    .fail((msg, err, yargs) => {
        if (err) throw err;
        yargs.showHelp();
        console.log();
        console.error(msg);
        process.exit(1);
    })
    .parse();

async function generate(tsDeclarations: any, generatorConfig: any, config: any, paths: Paths) {
    const langiumDeclarations = transformDeclaration(tsDeclarations);
    checkDeclarationValidity(langiumDeclarations);
    const langiumGrammar = transformLangiumDeclarationsToLangiumGrammar(langiumDeclarations, generatorConfig);
    checkLangiumGrammar(langiumGrammar);
    const grammarText = generateLangiumText(langiumGrammar, config.languageId, config.languageName);

    fs.writeFileSync(path.join(paths.gen, 'langium', `${config.languageId}.langium`), grammarText, { encoding: 'utf8', flag: 'w' });
    generateSerializer(langiumGrammar, config.languageId, config.languageName, generatorConfig).then(text =>
        fs.writeFileSync(path.join(paths.gen, 'langium', `${config.languageId}-serializer.ts`), text, { encoding: 'utf8', flag: 'w' })
    );

    const glspRoot = path.join(paths.gen, 'glsp-server');
    const creationPathMapping = buildCreationPathMapping(langiumDeclarations);
    writeCreationPathFile(glspRoot, creationPathMapping);

    const defaultMapping = buildDefaultValueMapping(langiumDeclarations);
    writeDefaultValueFile(glspRoot, defaultMapping);

    generateValidationFiles(paths);

    const registry = new GeneratorRegistry();
    await registry.execute(glspRoot, langiumDeclarations);
}
