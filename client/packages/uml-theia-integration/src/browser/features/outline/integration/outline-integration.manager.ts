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
