/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { ContainerContext } from '@eclipse-glsp/theia-integration';

import { OutlineIntegrationManager } from './outline-integration.manager';
import { OutlineIntegrationFactory, OutlineIntegrationService } from './outline-integration.service';

export function registerOutlineIntegration(context: ContainerContext): void {
    context.bind(OutlineIntegrationManager).toSelf().inSingletonScope();
    context.bind(OutlineIntegrationFactory).toFactory(ctx => () => {
        const container = ctx.container.createChild();
        container.bind(OutlineIntegrationService).toSelf().inSingletonScope();
        return container.get(OutlineIntegrationService);
    });
}
