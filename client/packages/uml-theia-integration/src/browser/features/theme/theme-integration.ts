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

import { ThemeManager, UmlThemeType } from '@borkdominik-biguml/uml-glsp/lib/features/theme';
import { Theme, ThemeType } from '@theia/core/lib/common/theme';
import { injectable } from 'inversify';

export type ThemeIntegrationFactory = () => ThemeIntegration;
export const ThemeIntegrationFactory = Symbol('ThemeIntegrationFactory');

@injectable()
export class ThemeIntegration {
    protected themeManager?: ThemeManager;

    connect(themeManager: ThemeManager): void {
        this.themeManager = themeManager;
    }

    updateTheme(theme: Theme): void {
        this.themeManager?.updateTheme(mapTheme(theme.type));
    }
}

function mapTheme(type: ThemeType): UmlThemeType {
    switch (type) {
        case 'dark':
        case 'hc':
            return 'dark';
        default:
            return 'light';
    }
}
