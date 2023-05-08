/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { SetUmlThemeAction, UmlTheme } from '@borkdominik-biguml/uml-glsp/lib/features/theme';
import { IActionDispatcher } from '@eclipse-glsp/client';
import { Theme } from '@theia/core/lib/common/theme';
import { injectable } from 'inversify';

export type ThemeIntegrationFactory = () => ThemeIntegration;
export const ThemeIntegrationFactory = Symbol('ThemeIntegrationFactory');

@injectable()
export class ThemeIntegration {
    protected actionDispatcher?: IActionDispatcher;

    connect(actionDispatcher: IActionDispatcher): void {
        this.actionDispatcher = actionDispatcher;
    }

    updateTheme(theme: Theme): void {
        this.actionDispatcher?.dispatch(SetUmlThemeAction.create(mapTheme(theme)));
    }
}

function mapTheme(theme: Theme): UmlTheme {
    switch (theme.type) {
        case 'dark':
        case 'hc':
            return 'dark';
        default:
            return 'light';
    }
}
