/********************************************************************************
 * Copyright (c) 2020-2021 EclipseSource and others.
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
import { ThemeManager } from '@borkdominik-biguml/uml-glsp/lib/features/theme/theme.manager';
import { GLSPDiagramWidget } from '@eclipse-glsp/theia-integration';
import { FrontendApplicationContribution } from '@theia/core/lib/browser/frontend-application';
import { ThemeService } from '@theia/core/lib/browser/theming';
import { Container, inject, injectable } from '@theia/core/shared/inversify';
import { UTDiagramManager } from '../../glsp/diagram/ut-diagram.manager';
import { ThemeIntegration } from './theme-integration';

export function connectThemeIntegration(container: Container, themeIntegrationFactory: () => ThemeIntegration): void {
    const themeIntegration = themeIntegrationFactory();

    container.bind(ThemeIntegration).toConstantValue(themeIntegration);

    themeIntegration.connect(container.get(ThemeManager));
}

@injectable()
export class ThemeContribution implements FrontendApplicationContribution {
    @inject(UTDiagramManager)
    protected readonly diagramManager: UTDiagramManager;

    @inject(ThemeService) protected readonly themeService: ThemeService;

    onStart(): void {
        this.diagramManager.onCreated(widget => {
            if (widget instanceof GLSPDiagramWidget) {
                this.refresh(widget);
            }
        });
        this.themeService.onDidColorThemeChange(() => this.refreshAll());
    }

    protected async refreshAll(): Promise<void> {
        this.diagramManager.all.forEach(async widget => {
            if (widget instanceof GLSPDiagramWidget) {
                await this.refresh(widget);
            }
        });
    }

    protected async refresh(widget: GLSPDiagramWidget): Promise<void> {
        await widget.getSvgElement();
        const theme = this.themeService.getCurrentTheme();
        widget.diContainer.get(ThemeIntegration).updateTheme(theme);
    }
}
