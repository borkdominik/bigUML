/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import {
    CodeGenerationActionResponse,
    RequestCodeGenerationAction,
    SelectSourceCodeFolderActionResponse,
    SelectTemplateFileActionResponse
} from '@borkdominik-biguml/big-code-generation';
import type { WebviewMessenger, WebviewViewProviderOptions } from '@borkdominik-biguml/big-vscode/vscode';
import {
    type ActionDispatcher,
    type CacheActionListener,
    type ConnectionManager,
    type GlspModelState,
    TYPES,
    WebviewViewProvider
} from '@borkdominik-biguml/big-vscode/vscode';
import { DisposableCollection } from '@eclipse-glsp/vscode-integration';
import { inject, injectable, postConstruct } from 'inversify';
import type { Disposable } from 'vscode';

@injectable()
export class CodeGenerationWebviewViewProvider extends WebviewViewProvider {
    @inject(TYPES.ConnectionManager)
    protected readonly connectionManager: ConnectionManager;

    @inject(TYPES.GlspModelState)
    protected readonly modelState: GlspModelState;

    @inject(TYPES.ActionDispatcher)
    protected readonly actionDispatcher: ActionDispatcher;

    protected actionCache: CacheActionListener;

    constructor(@inject(TYPES.WebviewViewOptions) options: WebviewViewProviderOptions) {
        super({
            viewId: options.viewType,
            viewType: options.viewType,
            htmlOptions: {
                files: {
                    js: [['code-generation', 'bundle.js']],
                    css: [['code-generation', 'bundle.css']]
                }
            }
        });
    }

    @postConstruct()
    protected init(): void {
        this.actionCache = this.actionListener.createCache([
            CodeGenerationActionResponse.KIND,
            SelectSourceCodeFolderActionResponse.KIND,
            SelectTemplateFileActionResponse.KIND
        ]);
        this.toDispose.push(this.actionCache);
    }

    protected override resolveWebviewProtocol(messenger: WebviewMessenger): Disposable {
        const disposables = new DisposableCollection();
        disposables.push(
            super.resolveWebviewProtocol(messenger),
            this.actionCache.onDidChange(message => this.actionMessenger.dispatch(message)),
            this.connectionManager.onNoConnection(() => {}),
            this.modelState.onDidChangeModelState(() => {
                this.requestCodeGeneration();
            })
        );
        return disposables;
    }

    protected override handleOnReady(): void {
        this.requestCodeGeneration();
        this.actionMessenger.dispatch(this.actionCache.getActions());
    }

    protected override handleOnVisible(): void {
        this.actionMessenger.dispatch(this.actionCache.getActions());
    }

    protected requestCodeGeneration(): void {
        this.actionDispatcher.dispatch(
            RequestCodeGenerationAction.create({
                options: {
                    templateFile: null
                },
                language: null,
                languageOptions: null
            })
        );
    }
}
