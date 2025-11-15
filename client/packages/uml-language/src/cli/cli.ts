#!/usr/bin/env tsx
/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { OutlineContribution } from '@borkdominik-biguml/big-outline/server';
import { PropertyPaletteContribution } from '@borkdominik-biguml/big-property-palette/server';
import fs from 'fs';
import path from 'path';
import { buildCreationPathMapping, writeCreationPathFile } from './generator/creation-path-generator.js';
import { buildDefaultValueMapping, writeDefaultValueFile } from './generator/default-value-generator.js';
import { generateLangiumText } from './generator/langium-generator.js';
import { generateSerializer } from './generator/serializer-generator.js';
import { generateValidationFiles } from './generator/validation-generator.js';
import { parseDefinitionFile, parseGeneratorConfigFile, parseLangiumConfigFile } from './parser/parser.js';
import { GeneratorRegistry } from './registry/generator-registry.js';
import { transformDeclaration, transformLangiumDeclarationsToLangiumGrammar } from './transformer.js';
import { checkDeclarationValidity, checkGeneratorConfigValidity, checkLangiumGrammar } from './validators/index.js';

/** Parse the command line */
const args = process.argv.slice(2);

if (args.length < 1) {
    throw new Error('Expecting at least one argument');
}
if (args[0] !== 'generate') {
    throw new Error('Can only handle the generate argument');
}
if (args[0] === 'generate') {
    const config = parseLangiumConfigFile(path.resolve('./', 'langium-config.json'));
    const generatorConfig = parseGeneratorConfigFile(path.resolve('./', 'generator-config.ts'));
    checkGeneratorConfigValidity(generatorConfig);

    const extensionPath = path.resolve('./', 'generated', 'language-server');

    const defFilePath = path.resolve(extensionPath, 'definition', 'def.ts');
    console.log('Generating from TypeScript definitions at', defFilePath);
    parseDefinitionFile(defFilePath).then(tsDeclarations => {
        const output = JSON.stringify(tsDeclarations, null, 2);

        // Define the output folder and file path
        const outputFolder = path.join(extensionPath, 'yo-generated');
        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder, { recursive: true });
        }
        const testFilePath = path.join(outputFolder, 'testkarol.ts');

        // Write the output to testkarol.ts
        fs.writeFileSync(testFilePath, output, { encoding: 'utf8' });
        console.log('DEBUG: Raw declarations have been written to', testFilePath);

        // Continue with your generation process
        generate(tsDeclarations, generatorConfig, config, extensionPath);
    });
}

async function generate(tsDeclarations: any, generatorConfig: any, config: any, extensionPath: string) {
    const langiumDeclarations = transformDeclaration(tsDeclarations);
    checkDeclarationValidity(langiumDeclarations);
    const langiumGrammar = transformLangiumDeclarationsToLangiumGrammar(langiumDeclarations, generatorConfig);
    checkLangiumGrammar(langiumGrammar);
    const grammarText = generateLangiumText(langiumGrammar, config.languageId, config.languageName);
    writeToFile(extensionPath, path.join(extensionPath, 'yo-generated', `${config.languageId}.langium`), grammarText);
    generateSerializer(langiumGrammar, config.languageId, config.languageName, generatorConfig).then(text =>
        writeToFile(extensionPath, path.join(extensionPath, 'yo-generated', `${config.languageId}-serializer.ts`), text)
    );

    const glspRoot = path.join(path.dirname(extensionPath), 'glsp-server');
    const creationPathMapping = buildCreationPathMapping(langiumDeclarations);
    writeCreationPathFile(glspRoot, creationPathMapping);

    const defaultMapping = buildDefaultValueMapping(langiumDeclarations);
    writeDefaultValueFile(glspRoot, defaultMapping);

    generateValidationFiles(extensionPath);

    const registry = new GeneratorRegistry();
    registry.register(PropertyPaletteContribution);
    registry.register(OutlineContribution);

    await registry.execute(glspRoot, langiumDeclarations);
}

function writeToFile(extensionPath: string, filePath: string, text: string) {
    if (!fs.existsSync(extensionPath)) {
        fs.mkdirSync(extensionPath, { recursive: true });
    }
    fs.writeFileSync(filePath, text, { encoding: 'utf8', flag: 'w' });
}
