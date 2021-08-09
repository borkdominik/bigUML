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
import { FrontendApplicationContribution } from "@theia/core/lib/browser/frontend-application";
import { ThemeService, ThemeType } from "@theia/core/lib/browser/theming";
import { inject, injectable } from "inversify";

@injectable()
export class UmlFrontendContribution implements FrontendApplicationContribution {

    @inject(ThemeService) protected readonly themeService: ThemeService;

    static readonly darkColorsCss = require("../../src/browser/style/uml-colors-dark.useable.css");
    static readonly darkIconsCss = require("../../src/browser/style/icons-dark.useable.css");

    static readonly lightColorsCss = require("../../src/browser/style/uml-colors-light.useable.css");
    static readonly lightIconsCss = require("../../src/browser/style/icons-light.useable.css");

    onStart(): void {
        this.updateTheme();
        this.themeService.onThemeChange(() => this.updateTheme());
    }

    protected updateTheme(): void {
        const themeType: ThemeType = this.themeService.getCurrentTheme().type;
        if (themeType === "dark" || themeType === "hc") {
            // unload light
            UmlFrontendContribution.lightColorsCss.unuse();
            UmlFrontendContribution.lightIconsCss.unuse();
            // load dark
            UmlFrontendContribution.darkColorsCss.use();
            UmlFrontendContribution.darkIconsCss.use();
        } else if (themeType === "light") {
            // unload dark
            UmlFrontendContribution.darkColorsCss.unuse();
            UmlFrontendContribution.darkIconsCss.unuse();
            // load light
            UmlFrontendContribution.lightColorsCss.use();
            UmlFrontendContribution.lightIconsCss.use();
        }
    }
}
