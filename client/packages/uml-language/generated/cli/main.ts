/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import chalk from 'chalk';
import { Command } from 'commander';
import { NodeFileSystem } from 'langium/node';
import { UmlLanguageMetaData } from '../language-server/generated/module.js';
import { createUmlServices } from '../language-server/yo-generated/uml-module.js';
import { extractAstNode } from './cli-util.js';
import { generateJavaScript } from './generator.js';

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createUmlServices(NodeFileSystem).Uml;
    const model = await extractAstNode<any>(fileName, services);
    const generatedFilePath = generateJavaScript(model, fileName, opts.destination);
    console.log(chalk.green(`JavaScript code generated successfully: ${generatedFilePath}`));
};

export type GenerateOptions = {
    destination?: string;
};

export default function (): void {
    const program = new Command();

    program.version(require('../../package.json').version);

    const fileExtensions = UmlLanguageMetaData.fileExtensions.join(', ');
    program
        .command('generate')
        .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
        .option('-d, --destination <dir>', 'destination directory of generating')
        .description('generates JavaScript code that prints "Hello, {name}!" for each greeting in a source file')
        .action(generateAction);

    program.parse(process.argv);
}
