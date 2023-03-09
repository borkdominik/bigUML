/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
import { FrontendApplicationContribution } from '@theia/core/lib/browser/frontend-application';
import { ThemeService } from '@theia/core/lib/browser/theming';
import { inject, injectable } from 'inversify';

@injectable()
export class ThemeManager implements FrontendApplicationContribution {
    @inject(ThemeService) protected readonly themeService: ThemeService;

    static readonly darkColorsCss = require('@borkdominik-biguml/uml-glsp/css/colors/colors-dark.useable.css');
    static readonly lightColorsCss = require('@borkdominik-biguml/uml-glsp/css/colors/colors-light.useable.css');

    onStart(): void {
        this.updateTheme();
        this.themeService.onDidColorThemeChange(() => this.updateTheme());
    }

    protected updateTheme(): void {
        const themeType = this.themeService.getCurrentTheme().type;
        if (themeType === 'dark' || themeType === 'hc') {
            ThemeManager.lightColorsCss.unuse();
            ThemeManager.darkColorsCss.use();
        } else if (themeType === 'light') {
            ThemeManager.darkColorsCss.unuse();
            ThemeManager.lightColorsCss.use();
        }
    }
}
