/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { ContainerContext } from '@eclipse-glsp/theia-integration';
import { FrontendApplicationContribution } from '@theia/core/lib/browser/frontend-application';
import { ThemeIntegration, ThemeIntegrationFactory } from './theme-integration';
import { ThemeContribution } from './theme-integration.contribution';

export function registerThemeIntegration(context: ContainerContext): void {
    context.bind(FrontendApplicationContribution).to(ThemeContribution);
    context.bind(ThemeIntegrationFactory).toFactory(ctx => () => {
        const container = ctx.container.createChild();
        container.bind(ThemeIntegration).toSelf().inSingletonScope();
        return container.get(ThemeIntegration);
    });
}
