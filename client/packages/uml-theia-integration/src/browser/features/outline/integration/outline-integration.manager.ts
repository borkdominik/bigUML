/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { GLSPDiagramWidget } from '@eclipse-glsp/theia-integration';
import { ApplicationShell } from '@theia/core/lib/browser';
import { inject, injectable } from '@theia/core/shared/inversify';

import { OutlineWidgetService } from '../widget/outline-widget.service';
import { OutlineIntegrationService } from './outline-integration.service';

@injectable()
export class OutlineIntegrationManager {
    @inject(ApplicationShell) protected readonly shell: ApplicationShell;

    @inject(OutlineWidgetService)
    protected readonly outlineWidgetService: OutlineWidgetService;

    async refresh(widget: GLSPDiagramWidget): Promise<void> {
        const outlineIntegrationService = widget.diContainer.get(OutlineIntegrationService);
        await outlineIntegrationService.refresh();
    }

    clear(): void {
        this.outlineWidgetService.publish([]);
    }
}
