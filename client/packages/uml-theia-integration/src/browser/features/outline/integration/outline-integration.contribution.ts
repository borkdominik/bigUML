/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { OutlineService } from '@borkdominik-biguml/uml-glsp/lib/features/outline/index';
import { IActionDispatcher, ModelSource, TYPES } from '@eclipse-glsp/client';
import { Container } from '@theia/core/shared/inversify';

import { OutlineIntegrationService } from './outline-integration.service';

export function connectOutlineIntegration(container: Container, outlineIntegrationServiceFactory: () => OutlineIntegrationService): void {
    const outlineIntegrationService = outlineIntegrationServiceFactory();

    container.bind(OutlineService).toConstantValue(outlineIntegrationService);
    container.bind(OutlineIntegrationService).toConstantValue(outlineIntegrationService);
    container.bind(TYPES.SModelRootListener).toConstantValue(outlineIntegrationService);

    if (outlineIntegrationService instanceof OutlineService) {
        outlineIntegrationService.connect(
            container.get<ModelSource>(TYPES.ModelSource),
            container.get<IActionDispatcher>(TYPES.IActionDispatcher)
        );
    }
}
