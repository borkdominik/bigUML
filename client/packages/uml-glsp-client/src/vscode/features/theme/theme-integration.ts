/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { TYPES, type ActionDispatcher } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { SetUMLThemeAction, type UMLTheme } from '@borkdominik-biguml/uml-glsp-client';
import { type GlspVscodeClient } from '@eclipse-glsp/vscode-integration';
import { inject, injectable, postConstruct } from 'inversify';
import * as vscode from 'vscode';

@injectable()
export class ThemeIntegration {
    protected readonly disposables: vscode.Disposable[] = [];

    constructor(
        @inject(TYPES.ActionDispatcher)
        protected readonly actionDispatcher: ActionDispatcher
    ) {}

    @postConstruct()
    initialize(): void {
        this.refresh();
        this.onChange(_e => this.refresh());
    }

    updateTheme(client: GlspVscodeClient): void {
        this.actionDispatcher.dispatchToClient(client.clientId, this.createAction());
    }

    refresh(): void {
        this.actionDispatcher.broadcast(this.createAction());
    }

    dispose(): void {
        this.disposables.forEach(d => d.dispose());
    }

    protected onChange(cb: (e: vscode.ColorTheme) => void): void {
        this.disposables.push(vscode.window.onDidChangeActiveColorTheme(cb));
    }

    protected createAction(): SetUMLThemeAction {
        return SetUMLThemeAction.create(mapTheme(vscode.window.activeColorTheme));
    }
}

function mapTheme(theme: vscode.ColorTheme): UMLTheme {
    switch (theme.kind) {
        case vscode.ColorThemeKind.Dark:
        case vscode.ColorThemeKind.HighContrast:
            return 'dark';
        default:
            return 'light';
    }
}
