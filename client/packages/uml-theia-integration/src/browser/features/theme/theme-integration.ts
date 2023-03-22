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
