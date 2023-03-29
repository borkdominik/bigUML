/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
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

import { Action, IActionHandler, ICommand, TYPES, ViewerOptions } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { SetUmlThemeAction } from './theme.actions';

export type UmlTheme = 'dark' | 'light';

@injectable()
export class ThemeManager implements IActionHandler {
    @inject(TYPES.ViewerOptions) protected readonly viewerOptions: ViewerOptions;

    updateTheme(theme: UmlTheme): void {
        if (theme === 'dark') {
            document.getElementById(this.viewerOptions.baseDiv)?.classList.remove('uml-theme', 'uml-light-theme');
            document.getElementById(this.viewerOptions.baseDiv)?.classList.add('uml-theme', 'uml-dark-theme');
        } else if (theme === 'light') {
            document.getElementById(this.viewerOptions.baseDiv)?.classList.remove('uml-theme', 'uml-dark-theme');
            document.getElementById(this.viewerOptions.baseDiv)?.classList.add('uml-theme', 'uml-light-theme');
        } else {
            console.error('Unknown theme: ', theme);
        }
    }

    handle(action: Action): void | Action | ICommand {
        if (SetUmlThemeAction.is(action)) {
            this.updateTheme(action.theme);
        }
    }
}
