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

import '@eclipsesource/uml-glsp/css/colors/colors-dark.useable.css';
import { injectable } from 'inversify';
import * as vscode from 'vscode';

@injectable()
export class ThemeManager {
    /*
    static readonly darkColorsCss = require('@eclipsesource/uml-glsp/css/colors/colors-dark.useable.css');

    static readonly lightColorsCss = require('@eclipsesource/uml-glsp/css/colors/colors-light.useable.css');
    */
    protected disposables: vscode.Disposable[] = [];

    initialize(): void {
        this.updateTheme(vscode.window.activeColorTheme.kind);
    }

    updateTheme(themeType: vscode.ColorThemeKind): void {
        /*
        if (themeType === vscode.ColorThemeKind.Dark || themeType === vscode.ColorThemeKind.HighContrast) {
            // unload light
            ThemeManager.lightColorsCss.unuse();
            // UmlFrontendContribution.lightIconsCss.unuse();
            // load dark
            ThemeManager.darkColorsCss.use();
            // UmlFrontendContribution.darkIconsCss.use();
        } else if (themeType === vscode.ColorThemeKind.Light) {
            // unload dark
            ThemeManager.darkColorsCss.unuse();
            // UmlFrontendContribution.darkIconsCss.unuse();
            // load light
            ThemeManager.lightColorsCss.use();
            // UmlFrontendContribution.lightIconsCss.use();
        }
        */
    }

    onChange(cb: (e: vscode.ColorTheme) => void): void {
        this.disposables.push(vscode.window.onDidChangeActiveColorTheme(cb));
    }

    dispose(): void {
        this.disposables.forEach(d => d.dispose());
    }
}
