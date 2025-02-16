/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { SetUMLThemeAction, type UMLTheme } from '@borkdominik-biguml/uml-glsp';
import { type GlspVscodeClient } from '@eclipse-glsp/vscode-integration';
import { inject, injectable, postConstruct } from 'inversify';
import * as vscode from 'vscode';
import { TYPES } from '../../di.types.js';
import { type UMLGLSPConnector } from '../../glsp/uml-glsp-connector.js';

@injectable()
export class ThemeIntegration {
    protected readonly disposables: vscode.Disposable[] = [];

    constructor(
        @inject(TYPES.Connector)
        protected readonly connector: UMLGLSPConnector
    ) {}

    @postConstruct()
    initialize(): void {
        this.refresh();
        this.onChange(_e => this.refresh());
    }

    updateTheme(client: GlspVscodeClient): void {
        this.connector.sendActionToClient(client.clientId, this.createAction());
    }

    refresh(): void {
        this.connector.broadcastActionToClients(this.createAction());
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
