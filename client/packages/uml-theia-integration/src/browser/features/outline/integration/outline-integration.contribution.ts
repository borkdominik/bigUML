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
import { IActionDispatcher, ModelSource, TYPES } from '@eclipse-glsp/client';
import { UmlDiagramOutlineService } from '@eclipsesource/uml-glsp/lib/features/diagram-outline';
import { Container } from '@theia/core/shared/inversify';

import { OutlineIntegrationService } from './outline-integration.service';

export function connectOutlineIntegration(container: Container, outlineIntegrationServiceFactory: () => OutlineIntegrationService): void {
    const outlineIntegrationService = outlineIntegrationServiceFactory();

    container.bind(UmlDiagramOutlineService).toConstantValue(outlineIntegrationService);
    container.bind(OutlineIntegrationService).toConstantValue(outlineIntegrationService);
    container.bind(TYPES.SModelRootListener).toConstantValue(outlineIntegrationService);

    if (outlineIntegrationService instanceof UmlDiagramOutlineService) {
        outlineIntegrationService.connect(
            container.get<ModelSource>(TYPES.ModelSource),
            container.get<IActionDispatcher>(TYPES.IActionDispatcher)
        );
    }
}
