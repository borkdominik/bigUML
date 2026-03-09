/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import {
    EXPERIMENTAL_TYPES,
    TYPES,
    type ActionDispatcher,
    type ActionListener,
    type Disposable,
    type ExperimentalGLSPServerModelState
} from '@borkdominik-biguml/big-vscode-integration/vscode';
import { DisposableCollection } from '@eclipse-glsp/protocol';
import { inject, injectable, postConstruct } from 'inversify';
import {
    CodeGenerationActionResponse,
    RequestCodeGenerationAction,
    RequestSelectSourceCodeFolderAction,
    RequestSelectTemplateFileAction,
    SelectSourceCodeFolderActionResponse,
    SelectTemplateFileActionResponse
} from '../common/code-generation.action.js';

import { UMLClass, UMLEnumeration, UMLInterface, UMLPrimitiveType, type UMLSourceModel } from '@borkdominik-biguml/uml-protocol';
import { Eta } from 'eta';
import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import _, { type Dictionary } from 'lodash';
import { join } from 'path';
import * as vscode from 'vscode';
import { type CodeGenerationOptions, type JavaCodeGenerationOptions, type TypescriptCodeGenerationOptions } from '../types/config.js';

// Handle the action within the server and not the glsp client / server
@injectable()
export class CodeGenerationActionHandler implements Disposable {
    @inject(TYPES.ActionDispatcher)
    protected readonly actionDispatcher: ActionDispatcher;
    @inject(TYPES.ActionListener)
    protected readonly actionListener: ActionListener;
    @inject(EXPERIMENTAL_TYPES.GLSPServerModelState)
    protected readonly modelState: ExperimentalGLSPServerModelState;

    private readonly toDispose = new DisposableCollection();

    @postConstruct()
    protected init(): void {
        this.toDispose.push(
            this.actionListener.handleVSCodeRequest<RequestCodeGenerationAction>(RequestCodeGenerationAction.KIND, async message => {
                const model = this.modelState.getModelState();
                if (!model) {
                    return CodeGenerationActionResponse.create({ success: false, message: 'Model state is not available.' });
                }
                if (!message.action.language) {
                    return CodeGenerationActionResponse.create({ success: false, message: 'Language is not specified.' });
                }
                if (!message.action.languageOptions) {
                    return CodeGenerationActionResponse.create({ success: false, message: 'Language options are missing.' });
                }

                const sourceModel = model.getSourceModel();
                console.log(sourceModel);

                const typeNames = this.getTypeNames(sourceModel);
                const addedSourceModel = this.addTypeNames(sourceModel, typeNames);

                if (message.action.language == 'java') {
                    this.generateJavaCode(
                        addedSourceModel,
                        typeNames,
                        message.action.options,
                        message.action.languageOptions as JavaCodeGenerationOptions
                    );
                } else if (message.action.language == 'typescript') {
                    this.generateTypeScriptCode(
                        addedSourceModel,
                        typeNames,
                        message.action.options,
                        message.action.languageOptions as TypescriptCodeGenerationOptions
                    );
                } else {
                    return CodeGenerationActionResponse.create({ success: false });
                }

                return CodeGenerationActionResponse.create({ success: true });
            })
        );

        this.toDispose.push(
            this.actionListener.handleVSCodeRequest<RequestSelectSourceCodeFolderAction>(
                RequestSelectSourceCodeFolderAction.KIND,
                async () => {
                    const folders = await vscode.window.showOpenDialog({
                        canSelectFiles: false,
                        canSelectFolders: true,
                        canSelectMany: false,
                        openLabel: 'Select Folder'
                    });

                    const folderPath = folders?.[0]?.fsPath ?? null;

                    return SelectSourceCodeFolderActionResponse.create({
                        folder: folderPath
                    });
                }
            )
        );

        this.toDispose.push(
            this.actionListener.handleVSCodeRequest<RequestSelectTemplateFileAction>(RequestSelectTemplateFileAction.KIND, async () => {
                const folders = await vscode.window.showOpenDialog({
                    canSelectFiles: true,
                    canSelectFolders: false,
                    canSelectMany: false,
                    openLabel: 'Select Template File',
                    filters: {
                        'HandleBar Templates': ['hbs'],
                        'Eta Templates': ['eta']
                    }
                });

                const filePath = folders?.[0]?.fsPath ?? null;

                return SelectTemplateFileActionResponse.create({
                    file: filePath
                });
            })
        );
    }

    private generateJavaCode(
        sourceModel: any,
        typeNames: Map<string, string>,
        options: CodeGenerationOptions,
        languageOptions: JavaCodeGenerationOptions
    ): void {
        if (languageOptions?.multiple) {
            for (const [typeId, typeName] of typeNames) {
                const sourceModelForType: UMLSourceModel = this.getTypeFromModel(typeId, sourceModel);

                if (UMLPrimitiveType.is(sourceModelForType.packagedElement![0])) continue;

                const template = options.templateFile ? this.readTemplateFromFile(options.templateFile) : this.readTemplate('java');
                const code = template(sourceModelForType);

                vscode.workspace.fs.writeFile(
                    vscode.Uri.file(languageOptions.folder + '/' + typeName + '.java'),
                    new TextEncoder().encode(code)
                );
            }
        } else {
            const template = this.readTemplate('java');
            const code = template(sourceModel);

            vscode.workspace.fs.writeFile(vscode.Uri.file(languageOptions?.folder + '/output.java'), new TextEncoder().encode(code));
        }
    }

    private generateTypeScriptCode(
        sourceModel: any,
        typeNames: Map<string, string>,
        options: CodeGenerationOptions,
        languageOptions: TypescriptCodeGenerationOptions
    ): void {
        const eta = new Eta({ views: join(__dirname, 'templates') });

        if (languageOptions?.multiple) {
            for (const [typeId, typeName] of typeNames) {
                const sourceModelForType: UMLSourceModel = this.getTypeFromModel(typeId, sourceModel);

                if (UMLPrimitiveType.is(sourceModelForType.packagedElement![0])) continue;

                // For multiple files, we might need a way to filter the template or assume valid input
                // But for now, using the same template logic as java, iterating over packagedElement (which is filtered to 1 item)
                const code = this.renderTemplate(eta, 'typescript', sourceModelForType, options.templateFile);

                vscode.workspace.fs.writeFile(
                    vscode.Uri.file(languageOptions.folder + '/' + typeName + '.ts'),
                    new TextEncoder().encode(code)
                );
            }
        } else {
            const code = this.renderTemplate(eta, 'typescript', sourceModel, options.templateFile);
            vscode.workspace.fs.writeFile(vscode.Uri.file(languageOptions?.folder + '/output.ts'), new TextEncoder().encode(code));
        }
    }

    private renderTemplate(eta: Eta, language: string, data: any, customTemplateFile: string | null): string {
        let templateString = '';
        if (customTemplateFile) {
            templateString = readFileSync(customTemplateFile, { encoding: 'utf8' });
        } else {
            const templatePath = CodeGenerationActionHandler.templateFiles[language];
            templateString = readFileSync(templatePath, { encoding: 'utf8' });
        }
        return eta.renderString(templateString, data);
    }

    private getTypeFromModel(typeId: string, sourceModel: any): any {
        const t = sourceModel as UMLSourceModel;

        const n: UMLSourceModel = _.cloneDeep(sourceModel);

        n.packagedElement = t.packagedElement?.filter(element => element.id === typeId);

        return n;
    }

    private getTypeNames(sourceModel: Readonly<UMLSourceModel>) {
        const typeNames = new Map<string, string>();

        sourceModel.packagedElement?.forEach(element => {
            if (UMLClass.is(element)) {
                const t = element as UMLClass;
                typeNames.set(t.id, t.name);
            }
            if (UMLEnumeration.is(element)) {
                const t = element as UMLEnumeration;
                typeNames.set(t.id, t.name);
            }
            if (UMLInterface.is(element)) {
                const t = element as UMLInterface;
                typeNames.set(t.id, t.name);
            }
            if (UMLPrimitiveType.is(element)) {
                const t = element as UMLPrimitiveType;
                typeNames.set(t.id, t.name);
            }
        });
        return typeNames;
    }

    dispose(): void {
        this.toDispose.dispose();
    }

    static get templateFiles() {
        return _.reduce(
            CodeGenerationActionHandler.languages,
            (acc: Dictionary<string>, lang: string) => {
                const ext = lang === 'typescript' ? 'eta' : 'hbs';
                acc[lang] = join(__dirname, 'templates', `${lang}.${ext}`);
                return acc;
            },
            {}
        );
    }

    private readTemplate(lang: string): HandlebarsTemplateDelegate<any> {
        const tmpl = CodeGenerationActionHandler.templateFiles[lang];
        const source = readFileSync(tmpl, { encoding: 'utf8' });
        return Handlebars.compile(source);
    }

    private readTemplateFromFile(file: string): HandlebarsTemplateDelegate<any> {
        const source = readFileSync(file, { encoding: 'utf8' });
        return Handlebars.compile(source);
    }

    private static get extensions(): Dictionary<string> {
        return {
            java: 'java',
            typescript: 'ts'
        };
    }

    private static get languages(): string[] {
        return _.keys(CodeGenerationActionHandler.extensions);
    }

    static getExtension(lang: string): string {
        return _.get(CodeGenerationActionHandler.extensions, lang, 'js');
    }

    private addTypeNames(obj: any, typeMap: Map<string, string>): any {
        if (typeof obj !== 'object' || obj === null) return obj;

        if (Array.isArray(obj)) {
            return obj.map(item => this.addTypeNames(item, typeMap));
        }

        const newObj = { ...obj };

        if (newObj.$ref && typeMap.get(newObj.$ref)) {
            newObj.name = typeMap.get(newObj.$ref);
        }

        for (const key in newObj) {
            if (typeof newObj[key] === 'object') {
                newObj[key] = this.addTypeNames(newObj[key], typeMap);
            }
        }

        return newObj;
    }
}
