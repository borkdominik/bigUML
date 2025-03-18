/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { type Action, type IActionHandler, type ICommand, TYPES, type ViewerOptions } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { SetUMLThemeAction, type UMLTheme } from '../../../common/features/theme/theme.actions.js';

@injectable()
export class ThemeManager implements IActionHandler {
    @inject(TYPES.ViewerOptions) protected readonly viewerOptions: ViewerOptions;

    updateTheme(theme: UMLTheme): void {
        if (theme === 'dark') {
            document.getElementById(this.viewerOptions.hiddenDiv)?.classList.remove('uml-theme', 'uml-light-theme');
            document.getElementById(this.viewerOptions.hiddenDiv)?.classList.add('uml-theme', 'uml-dark-theme');
            document.getElementById(this.viewerOptions.baseDiv)?.classList.remove('uml-theme', 'uml-light-theme');
            document.getElementById(this.viewerOptions.baseDiv)?.classList.add('uml-theme', 'uml-dark-theme');
        } else if (theme === 'light') {
            document.getElementById(this.viewerOptions.hiddenDiv)?.classList.remove('uml-theme', 'uml-dark-theme');
            document.getElementById(this.viewerOptions.hiddenDiv)?.classList.add('uml-theme', 'uml-light-theme');
            document.getElementById(this.viewerOptions.baseDiv)?.classList.remove('uml-theme', 'uml-dark-theme');
            document.getElementById(this.viewerOptions.baseDiv)?.classList.add('uml-theme', 'uml-light-theme');
        } else {
            console.error('Unknown theme: ', theme);
        }
    }

    handle(action: Action): void | Action | ICommand {
        if (SetUMLThemeAction.is(action)) {
            this.updateTheme(action.theme);
        }
    }
}
