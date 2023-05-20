/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { IActionDispatcher, TYPES } from '@eclipse-glsp/client';
import { GLSPDiagramWidget } from '@eclipse-glsp/theia-integration';
import { FrontendApplicationContribution } from '@theia/core/lib/browser/frontend-application';
import { ThemeService } from '@theia/core/lib/browser/theming';
import { Container, inject, injectable } from '@theia/core/shared/inversify';
import { UTDiagramManager } from '../../glsp/diagram/ut-diagram.manager';
import { ThemeIntegration } from './theme-integration';

export function connectThemeIntegration(container: Container, themeIntegrationFactory: () => ThemeIntegration): void {
    const themeIntegration = themeIntegrationFactory();

    container.bind(ThemeIntegration).toConstantValue(themeIntegration);

    themeIntegration.connect(container.get<IActionDispatcher>(TYPES.IActionDispatcher));
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
