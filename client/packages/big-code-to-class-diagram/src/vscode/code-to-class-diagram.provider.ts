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
    ChangeLanguageResponseAction,
    GenerateDiagramRequestAction,
    GenerateDiagramResponseAction,
    RequestChangeLanguageAction,
    RequestSelectFolderAction,
    SelectedFolderResponseAction
} from '../common/code-to-class-diagram.action.js';

export const CodeToClassDiagramViewId = Symbol('CodeToClassDiagramViewId');

@injectable()
export class CodeToClassDiagramProvider extends BIGReactWebview {
    @inject(CodeToClassDiagramViewId)
    viewId: string;

    protected override cssPath = ['code-to-class-diagram', 'bundle.css'];
    protected override jsPath = ['code-to-class-diagram', 'bundle.js'];
    protected readonly actionCache = this.actionListener.createCache([SelectedFolderResponseAction.KIND]);

    @postConstruct()
    protected override init(): void {
        super.init();

        this.toDispose.push(this.actionCache);
    }

    protected override handleConnection(): void {
        super.handleConnection();

        this.toDispose.push(
            this.actionCache.onDidChange(message => {
                this.webviewConnector.dispatch(message);
            }),
            this.webviewConnector.onReady(() => {}),
            this.connectionManager.onDidActiveClientChange(() => {
                console.warn('onDidActiveClientChange');
            }),
            this.connectionManager.onNoActiveClient(() => {
                console.warn('onNoActiveClient');
                // Send a message to the webview when there is no active client
                this.webviewConnector.dispatch(SelectedFolderResponseAction.create());
                this.webviewConnector.dispatch(GenerateDiagramResponseAction.create());
                this.webviewConnector.dispatch(ChangeLanguageResponseAction.create());
            }),
            this.connectionManager.onNoConnection(() => {
                console.warn('onNoConnection');
                // Send a message to the webview when there is no glsp client
                this.webviewConnector.dispatch(SelectedFolderResponseAction.create());
                this.webviewConnector.dispatch(GenerateDiagramResponseAction.create());
                this.webviewConnector.dispatch(ChangeLanguageResponseAction.create());
            }),
            this.modelState.onDidChangeModelState(() => {
                console.warn('onDidChangeModelState');
            })
        );
    }

    protected requestFolder(): void {
        this.actionDispatcher.dispatch(RequestSelectFolderAction.create());
    }

    protected requestDiagram(): void {
        this.actionDispatcher.dispatch(GenerateDiagramRequestAction.create());
    }

    protected requestLanguage(): void {
        this.actionDispatcher.dispatch(RequestChangeLanguageAction.create({ language: 'Java' }));
    }
}
