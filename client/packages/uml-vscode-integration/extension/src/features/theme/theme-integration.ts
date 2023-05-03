/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { SetUmlThemeAction, UmlTheme } from '@borkdominik-biguml/uml-glsp/lib/features/theme';
import { inject, injectable, postConstruct } from 'inversify';
import * as vscode from 'vscode';
import { TYPES } from '../../di.types';
import { UVGlspConnector } from '../../glsp/uv-glsp-connector';

@injectable()
export class ThemeIntegration {
    protected readonly disposables: vscode.Disposable[] = [];

    constructor(
        @inject(TYPES.Connector)
        protected readonly connector: UVGlspConnector
    ) {}

    @postConstruct()
    initialize(): void {
        this.refresh();
        this.onChange(e => this.refresh());
    }

    refresh(): void {
        this.connector.broadcastActionToClients(SetUmlThemeAction.create(mapTheme(vscode.window.activeColorTheme)));
    }

    dispose(): void {
        this.disposables.forEach(d => d.dispose());
    }

    protected onChange(cb: (e: vscode.ColorTheme) => void): void {
        this.disposables.push(vscode.window.onDidChangeActiveColorTheme(cb));
    }
}

function mapTheme(theme: vscode.ColorTheme): UmlTheme {
    switch (theme.kind) {
        case vscode.ColorThemeKind.Dark:
        case vscode.ColorThemeKind.HighContrast:
            return 'dark';
        default:
            return 'light';
    }
}
