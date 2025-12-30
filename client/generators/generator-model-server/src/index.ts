/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import chalk from 'chalk';
import _ from 'lodash';
import { EOL } from 'node:os';
import * as path from 'node:path';
import which from 'which';
import Generator from 'yeoman-generator';

const __dirname = import.meta.dirname;

const TEMPLATE_CORE_DIR = '../src/templates/core';
const TEMPLATE_VSCODE_DIR = '../src/templates/vscode';
const TEMPLATE_CLI_DIR = '../src/templates/cli';
const USER_DIR = '.';

const EXTENSION_NAME = /<%= extension-name %>/g;
const RAW_LANGUAGE_NAME = /<%= RawLanguageName %>/g;
const FILE_EXTENSION = /"?<%= file-extension %>"?/g;
const FILE_EXTENSION_GLOB = /<%= file-glob-extension %>/g;

const LANGUAGE_NAME = /<%= LanguageName %>/g;
const LANGUAGE_ID = /<%= language-id %>/g;
const LANGUAGE_PATH_ID = /language-id/g;

const ENTRY_ELEMENT_NAME = /<%= EntryElementName %>/g;
const REFERENCE_PROPERTY = /<%= ReferenceProperty %>/g;

const NEWLINES = /\r?\n/g;

interface Answers {
    extensionName: string;
    rawLanguageName: string;
    fileExtensions: string;
    entryElementName: string;
    referenceProperty: string;
}

function description(...d: string[]): string {
    return chalk.reset(chalk.dim(d.join(' ') + '\n')) + chalk.green('?');
}

class LangiumGenerator extends Generator {
    private answers?: Answers;

    async prompting(): Promise<void> {
        this.answers = await this.prompt([
            {
                type: 'input',
                name: 'extensionName',
                prefix: description(
                    'Welcome to Langium!',
                    'This tool generates a VS Code extension with a "Hello World" language to get started quickly.',
                    'The extension name is an identifier used in the extension marketplace or package registry.'
                ),
                message: 'Your extension name:',
                default: 'workflow-model-server'
            },
            {
                type: 'input',
                name: 'rawLanguageName',
                prefix: description(
                    'The language name is used to identify your language in VS Code.',
                    'Please provide a name to be shown in the UI.',
                    'CamelCase and kebab-case variants will be created and used in different parts of the extension and language server.'
                ),
                message: 'Your language name:',
                default: 'Workflow Diagram',
                validate: (input: string): boolean | string =>
                    /^[a-zA-Z].*$/.test(input) ? true : 'The language name must start with a letter.'
            },
            {
                type: 'input',
                name: 'fileExtensions',
                prefix: description(
                    'Source files of your language are identified by their file name extension.',
                    'You can specify multiple file extensions separated by commas.'
                ),
                message: 'File extensions:',
                default: '.wf',
                validate: (input: string): boolean | string =>
                    /^\.?\w+(\s*,\s*\.?\w+)*$/.test(input)
                        ? true
                        : 'A file extension can start with . and must contain only letters and digits. Extensions must be separated by commas.'
            },
            {
                type: 'input',
                name: 'entryElementName',
                prefix: description('The name of the entry element in the model'),
                default: 'Model',
                message: 'Entry element name: ',
                validate: (input: string): boolean | string =>
                    /^[a-zA-Z].*$/.test(input) ? true : 'The entry element name must start with a letter.'
            },
            {
                type: 'input',
                name: 'referenceProperty',
                prefix: description('The property which is used to create the references'),
                default: '__id',
                message: 'Reference Property Name: '
            }
        ]);
    }

    writing(): void {
        const fileExtensions = Array.from(new Set(this.answers!.fileExtensions.split(',').map(ext => ext.replace(/\./g, '').trim())));
        this.answers!.fileExtensions = `[${fileExtensions.map(ext => `".${ext}"`).join(', ')}]`;

        const fileExtensionGlob = fileExtensions.length > 1 ? `{${fileExtensions.join(',')}}` : fileExtensions[0];

        this.answers!.rawLanguageName = this.answers!.rawLanguageName.replace(/(?![\w| |\-|_])./g, '');
        const languageName = _.upperFirst(_.camelCase(this.answers!.rawLanguageName));
        const languageId = _.kebabCase(this.answers!.rawLanguageName);

        this.sourceRoot(path.join(__dirname, TEMPLATE_CORE_DIR));
        const pkgJson = this.fs.readJSON(path.join(this.sourceRoot(), '.package.json'));
        this.fs.extendJSON(this._extensionPath('package-template.json'), pkgJson, undefined, 4);

        for (const path of ['.', '.eslintrc.json']) {
            this.fs.copy(this.templatePath(path), this._extensionPath(path), {
                process: content => this._replaceTemplateWords(fileExtensionGlob, languageName, languageId, content as any),
                processDestinationPath: path => this._replaceTemplateNames(languageId, path)
            });
        }

        // .gitignore files don't get published to npm, so we need to copy it under a different name
        this.fs.copy(this.templatePath('../gitignore.txt'), this._extensionPath('.gitignore'));

        {
            this.sourceRoot(path.join(__dirname, TEMPLATE_VSCODE_DIR));
            const pkgJson = this.fs.readJSON(path.join(this.sourceRoot(), '.package.json'));
            this.fs.extendJSON(this._extensionPath('package-template.json'), pkgJson, undefined, 4);
            this.sourceRoot(path.join(__dirname, TEMPLATE_VSCODE_DIR));
            for (const path of ['.']) {
                this.fs.copy(this.templatePath(path), this._extensionPath(path), {
                    process: content => this._replaceTemplateWords(fileExtensionGlob, languageName, languageId, content as any),
                    processDestinationPath: path => this._replaceTemplateNames(languageId, path)
                });
            }
        }

        {
            this.sourceRoot(path.join(__dirname, TEMPLATE_CLI_DIR));
            const pkgJson = this.fs.readJSON(path.join(this.sourceRoot(), '.package.json'));
            this.fs.extendJSON(this._extensionPath('package-template.json'), pkgJson, undefined, 4);
            for (const path of ['.']) {
                this.fs.copy(this.templatePath(path), this._extensionPath(path), {
                    process: content => this._replaceTemplateWords(fileExtensionGlob, languageName, languageId, content as any),
                    processDestinationPath: path => this._replaceTemplateNames(languageId, path)
                });
            }
        }

        this.fs.copy(this._extensionPath('package-template.json'), this._extensionPath('package.json'), {
            process: content => this._replaceTemplateWords(fileExtensionGlob, languageName, languageId, content as any),
            processDestinationPath: path => this._replaceTemplateNames(languageId, path)
        });
        this.fs.delete(this._extensionPath('package-template.json'));
    }

    async install(): Promise<void> {
        const extensionPath = this._extensionPath();

        const opts = { cwd: extensionPath };
        if (!this.args.includes('skip-install')) {
            this.spawnCommandSync('npm', ['install'], opts);
        }
        this.spawnCommandSync('npm', ['run', 'generate'], opts);

        this.spawnCommandSync('npm', ['run', 'build'], opts);
    }

    async end(): Promise<void> {
        const code = await which('code').catch(() => undefined);
        if (code) {
            const answer = await this.prompt({
                type: 'list',
                name: 'openWith',
                message: 'Do you want to open the new folder with Visual Studio Code?',
                choices: [
                    {
                        name: 'Open with `code`',
                        value: code
                    },
                    {
                        name: 'Skip',
                        value: false
                    }
                ]
            });
            if (answer?.openWith) {
                this.spawnCommand(answer.openWith, [this._extensionPath()]);
            }
        }
    }

    _extensionPath(...path: string[]): string {
        return this.destinationPath(USER_DIR, this.answers!.extensionName, ...path);
    }

    _replaceTemplateWords(fileExtensionGlob: string, languageName: string, languageId: string, content: Buffer): string {
        return content
            .toString()
            .replace(EXTENSION_NAME, this.answers!.extensionName)
            .replace(RAW_LANGUAGE_NAME, this.answers!.rawLanguageName)
            .replace(FILE_EXTENSION, this.answers!.fileExtensions)
            .replace(ENTRY_ELEMENT_NAME, this.answers!.entryElementName)
            .replace(REFERENCE_PROPERTY, this.answers!.referenceProperty)
            .replace(FILE_EXTENSION_GLOB, fileExtensionGlob)
            .replace(LANGUAGE_NAME, languageName)
            .replace(LANGUAGE_ID, languageId)
            .replace(NEWLINES, EOL);
    }

    _replaceTemplateNames(languageId: string, path: string): string {
        return path.replace(LANGUAGE_PATH_ID, languageId);
    }
}

export default LangiumGenerator;
