/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { BIGReactWebview } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { inject, injectable, postConstruct } from 'inversify';
import {
    CodeGenerationActionResponse,
    RequestCodeGenerationAction,
    SelectSourceCodeFolderActionResponse,
    SelectTemplateFileActionResponse
} from '../common/code-generation.action.js';

export const CodeGenerationViewId = Symbol('CodeGenerationViewId');

@injectable()
export class CodeGenerationProvider extends BIGReactWebview {
    @inject(CodeGenerationViewId)
    viewId: string;

    protected override cssPath = ['code-generation', 'bundle.css'];
    protected override jsPath = ['code-generation', 'bundle.js'];
    protected readonly actionCache = this.actionListener.createCache([
        CodeGenerationActionResponse.KIND,
        SelectSourceCodeFolderActionResponse.KIND,
        SelectTemplateFileActionResponse.KIND
    ]);

    @postConstruct()
    protected override init(): void {
        super.init();

        this.toDispose.push(this.actionCache);
    }

    protected override handleConnection(): void {
        super.handleConnection();

        this.toDispose.push(
            this.actionCache.onDidChange(message => this.webviewConnector.dispatch(message)),
            this.webviewConnector.onReady(() => {
                this.generateCode();
                this.webviewConnector.dispatch(this.actionCache.getActions());
            }),
            this.webviewConnector.onVisible(() => this.webviewConnector.dispatch(this.actionCache.getActions())),
            this.connectionManager.onDidActiveClientChange(() => {}),
            this.connectionManager.onNoActiveClient(() => {}),
            this.connectionManager.onNoConnection(() => {}),
            this.modelState.onDidChangeModelState(() => {
                this.generateCode();
            })
        );
    }

    protected generateCode(): void {
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
