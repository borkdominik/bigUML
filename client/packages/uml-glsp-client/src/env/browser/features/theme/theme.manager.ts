/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { type Action, type IActionHandler, type ICommand, type IDiagramStartup, TYPES, type ViewerOptions } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { SetUmlThemeAction, type UmlTheme } from '../../../common/features/theme/theme.actions.js';

const THEME_CLASSES: Record<UmlTheme, string> = {
    dark: 'uml-dark-theme',
    light: 'uml-light-theme'
};

/**
 * Puts the UML theme classes on the diagram and on the hidden div it is measured in.
 *
 * The theme is applied before the diagram is first rendered, not only once the server sends
 * `setUmlTheme`: styles scoped under `.uml-theme` change text sizes (members, frame titles, ...), and
 * the first layout is measured in the hidden div right after the model arrives - before the theme does.
 * Measured without the theme and drawn with it, a label is wider than the room laid out for it and runs
 * into its neighbour.
 */
@injectable()
export class ThemeManager implements IActionHandler, IDiagramStartup {
    @inject(TYPES.ViewerOptions) protected readonly viewerOptions: ViewerOptions;

    preInitialize(): void {
        this.updateTheme(this.initialTheme());
    }

    handle(action: Action): void | Action | ICommand {
        if (SetUmlThemeAction.is(action)) {
            this.updateTheme(action.theme);
        }
    }

    updateTheme(theme: UmlTheme): void {
        if (!(theme in THEME_CLASSES)) {
            console.error('Unknown theme: ', theme);
            return;
        }
        for (const element of [this.hiddenDiv(), document.getElementById(this.viewerOptions.baseDiv)]) {
            element?.classList.remove(...Object.values(THEME_CLASSES));
            element?.classList.add('uml-theme', THEME_CLASSES[theme]);
        }
    }

    /** The theme VS Code marks the webview with, the same mapping the extension sends `setUmlTheme` with. */
    protected initialTheme(): UmlTheme {
        const body = document.body.classList;
        if (body.contains('vscode-high-contrast-light') || body.contains('vscode-light')) {
            return 'light';
        }
        if (body.contains('vscode-dark') || body.contains('vscode-high-contrast')) {
            return 'dark';
        }
        return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    /**
     * The hidden div, created here if the hidden viewer has not rendered yet: it adopts the classes of an
     * existing placeholder on its first render, which is how the theme is in place for the first measure.
     */
    protected hiddenDiv(): HTMLElement {
        let hiddenDiv = document.getElementById(this.viewerOptions.hiddenDiv);
        if (!hiddenDiv) {
            hiddenDiv = document.createElement('div');
            hiddenDiv.id = this.viewerOptions.hiddenDiv;
            document.body.appendChild(hiddenDiv);
        }
        return hiddenDiv;
    }
}
