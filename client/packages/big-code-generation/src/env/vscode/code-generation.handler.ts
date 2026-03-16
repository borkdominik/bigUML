/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import {
    TYPES,
    type ActionDispatcher,
    type ActionListener,
    type GlspModelState,
    type OnActivate,
    type OnDispose
} from '@borkdominik-biguml/big-vscode/vscode';
import { DisposableCollection } from '@eclipse-glsp/protocol';
import { Eta } from 'eta';
import { readFileSync } from 'fs';
import { inject, injectable, postConstruct } from 'inversify';
import { join } from 'path';
import * as vscode from 'vscode';
import {
    CodeGenerationActionResponse,
    RequestCodeGenerationAction,
    RequestSelectSourceCodeFolderAction,
    RequestSelectTemplateFileAction,
    SelectSourceCodeFolderActionResponse,
    SelectTemplateFileActionResponse
} from '../common/code-generation.action.js';
import type { CodeGenerationOptions, JavaCodeGenerationOptions, TypescriptCodeGenerationOptions } from '../common/config.js';

@injectable()
export class CodeGenerationActionHandler implements OnActivate, OnDispose {
    @inject(TYPES.ActionDispatcher)
    protected readonly actionDispatcher: ActionDispatcher;
    @inject(TYPES.ActionListener)
    protected readonly actionListener: ActionListener;
    @inject(TYPES.GlspModelState)
    protected readonly modelState: GlspModelState;

    private readonly toDispose = new DisposableCollection();

    @postConstruct()
    protected init(): void {}

    onActivate(): void {
        this.toDispose.push(
            this.actionListener.handleVSCodeRequest<RequestCodeGenerationAction>(RequestCodeGenerationAction.KIND, async message => {
                const state = this.modelState.getModelState();
                if (!state) {
                    return CodeGenerationActionResponse.create({ success: false, message: 'Model state is not available.' });
                }
                if (!message.action.language) {
                    return CodeGenerationActionResponse.create({ success: false, message: 'Language is not specified.' });
                }
                if (!message.action.languageOptions) {
                    return CodeGenerationActionResponse.create({ success: false, message: 'Language options are missing.' });
                }

                const model = state.getModel();
                const entities = model.diagram.entities ?? [];
                const relations = model.diagram.relations ?? [];

                const templateData = this.buildTemplateData(entities, relations);

                if (message.action.language === 'java') {
                    this.generateCode(
                        templateData,
                        message.action.options,
                        message.action.languageOptions as JavaCodeGenerationOptions,
                        'java'
                    );
                } else if (message.action.language === 'typescript') {
                    this.generateCode(
                        templateData,
                        message.action.options,
                        message.action.languageOptions as TypescriptCodeGenerationOptions,
                        'typescript'
                    );
                } else {
                    return CodeGenerationActionResponse.create({ success: false, message: 'Unsupported language.' });
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

                    return SelectSourceCodeFolderActionResponse.create({
                        folder: folders?.[0]?.fsPath ?? null
                    });
                }
            )
        );

        this.toDispose.push(
            this.actionListener.handleVSCodeRequest<RequestSelectTemplateFileAction>(RequestSelectTemplateFileAction.KIND, async () => {
                const files = await vscode.window.showOpenDialog({
                    canSelectFiles: true,
                    canSelectFolders: false,
                    canSelectMany: false,
                    openLabel: 'Select Template File',
                    filters: {
                        'Eta Templates': ['eta']
                    }
                });

                return SelectTemplateFileActionResponse.create({
                    file: files?.[0]?.fsPath ?? null
                });
            })
        );
    }

    dispose(): void {
        this.toDispose.dispose();
    }

    /**
     * Builds template-friendly data from the new AST model format.
     * The templates expect a `packagedElement` array with resolved type names.
     */
    private buildTemplateData(entities: any[], relations: any[]): any {
        const nameMap = new Map<string, string>();
        for (const entity of entities) {
            if (entity.__id && entity.name) {
                nameMap.set(entity.__id, entity.name);
            }
        }

        const resolveTypeName = (ref: any): { name: string } | undefined => {
            if (!ref) {
                return undefined;
            }
            if (ref.__refText) {
                return { name: ref.__refText };
            }
            if (ref.__ref && ref.__ref.__id) {
                const name = nameMap.get(ref.__ref.__id);
                return name ? { name } : undefined;
            }
            return undefined;
        };

        const elements = entities.map(entity => {
            const base: any = {
                __type: entity.__type,
                __id: entity.__id,
                name: entity.name,
                visibility: entity.visibility
            };

            if (entity.__type === 'Class' || entity.__type === 'AbstractClass') {
                base.isAbstract = entity.isAbstract ?? false;

                base.ownedAttribute = (entity.properties ?? []).map((p: any) => ({
                    name: p.name,
                    visibility: p.visibility,
                    type: resolveTypeName(p.propertyType)
                }));

                base.ownedOperation = (entity.operations ?? []).map((op: any) => ({
                    name: op.name,
                    visibility: op.visibility,
                    ownedParameter: (op.parameters ?? []).map((param: any) => ({
                        name: param.name,
                        direction: param.direction,
                        type: resolveTypeName(param.parameterType)
                    }))
                }));

                const generalizations = relations
                    .filter(r => r.relationType === 'Generalization' && r.source?.__refText === entity.name)
                    .map(r => ({ general: { name: r.target?.__refText ?? '' } }));
                if (generalizations.length > 0) {
                    base.generalization = generalizations;
                }

                const realizations = relations
                    .filter(r => r.relationType === 'InterfaceRealization' && r.source?.__refText === entity.name)
                    .map(r => ({ contract: { name: r.target?.__refText ?? '' } }));
                if (realizations.length > 0) {
                    base.interfaceRealization = realizations;
                }
            } else if (entity.__type === 'Interface') {
                base.ownedAttribute = (entity.properties ?? []).map((p: any) => ({
                    name: p.name,
                    visibility: p.visibility,
                    type: resolveTypeName(p.propertyType)
                }));

                base.ownedOperation = (entity.operations ?? []).map((op: any) => ({
                    name: op.name,
                    visibility: op.visibility,
                    ownedParameter: (op.parameters ?? []).map((param: any) => ({
                        name: param.name,
                        direction: param.direction,
                        type: resolveTypeName(param.parameterType)
                    }))
                }));
            } else if (entity.__type === 'DataType') {
                base.ownedAttribute = (entity.properties ?? []).map((p: any) => ({
                    name: p.name,
                    visibility: p.visibility,
                    type: resolveTypeName(p.propertyType)
                }));

                base.ownedOperation = (entity.operations ?? []).map((op: any) => ({
                    name: op.name,
                    visibility: op.visibility,
                    ownedParameter: (op.parameters ?? []).map((param: any) => ({
                        name: param.name,
                        direction: param.direction,
                        type: resolveTypeName(param.parameterType)
                    }))
                }));
            } else if (entity.__type === 'Enumeration') {
                base.ownedLiteral = (entity.values ?? []).map((v: any) => ({
                    name: v.name
                }));
            }

            return base;
        });

        return { packagedElement: elements };
    }

    private generateCode(
        templateData: any,
        options: CodeGenerationOptions,
        languageOptions: JavaCodeGenerationOptions | TypescriptCodeGenerationOptions,
        language: string
    ): void {
        const extension = language === 'typescript' ? 'ts' : 'java';

        if (languageOptions?.multiple) {
            const elements: any[] = templateData.packagedElement ?? [];
            for (const element of elements) {
                if (element.__type === 'PrimitiveType') {
                    continue;
                }
                const singleData = { packagedElement: [element] };
                const code = this.renderTemplate(language, singleData, options.templateFile);
                vscode.workspace.fs.writeFile(
                    vscode.Uri.file(join(languageOptions.folder!, `${element.name}.${extension}`)),
                    new TextEncoder().encode(code)
                );
            }
        } else {
            const code = this.renderTemplate(language, templateData, options.templateFile);
            vscode.workspace.fs.writeFile(
                vscode.Uri.file(join(languageOptions.folder!, `output.${extension}`)),
                new TextEncoder().encode(code)
            );
        }
    }

    private renderTemplate(language: string, data: any, customTemplateFile: string | null): string {
        const eta = new Eta();
        let templateString: string;

        if (customTemplateFile) {
            templateString = readFileSync(customTemplateFile, { encoding: 'utf8' });
        } else {
            const templatePath = join(__dirname, '..', 'templates', `${language}.eta`);
            templateString = readFileSync(templatePath, { encoding: 'utf8' });
        }

        return eta.renderString(templateString, data);
    }
}
