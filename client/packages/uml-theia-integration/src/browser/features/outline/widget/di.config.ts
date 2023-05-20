/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { ContainerContext } from '@eclipse-glsp/theia-integration';
import { bindViewContribution, createTreeContainer, FrontendApplicationContribution } from '@theia/core/lib/browser';
import { WidgetFactory } from '@theia/core/lib/browser/widget-manager';
import { bindContributionProvider } from '@theia/core/lib/common/contribution-provider';
import { interfaces } from '@theia/core/shared/inversify';

import { OutlineWidgetContribution } from './outline-widget.contribution';
import { OutlineWidgetDecorator, OutlineWidgetDecoratorService } from './outline-widget.decorator';
import { OutlineWidgetTreeModel } from './outline-widget.model';
import { OutlineWidgetService } from './outline-widget.service';
import { OutlineWidget, OutlineWidgetFactory } from './outline-widget.widget';

export function registerOutlineWidget(context: ContainerContext): void {
    context.bind(OutlineWidgetFactory).toFactory(ctx => () => createOutlineWidget(ctx.container));

    context.bind(OutlineWidgetService).toSelf().inSingletonScope();
    context.bind(WidgetFactory).toService(OutlineWidgetService);

    bindViewContribution(context.bind, OutlineWidgetContribution);
    context.bind(FrontendApplicationContribution).toService(OutlineWidgetContribution);
}

function createOutlineWidgetContainer(parent: interfaces.Container): interfaces.Container {
    const child = createTreeContainer(parent, {
        props: { expandOnlyOnExpansionToggleClick: true, search: true },
        widget: OutlineWidget,
        model: OutlineWidgetTreeModel,
        decoratorService: OutlineWidgetDecoratorService
    });
    bindContributionProvider(child, OutlineWidgetDecorator);
    return child;
}

function createOutlineWidget(parent: interfaces.Container): OutlineWidget {
    const child = createOutlineWidgetContainer(parent);

    return child.get(OutlineWidget);
}
