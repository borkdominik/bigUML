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
import { bindViewContribution, createTreeContainer, FrontendApplicationContribution } from '@theia/core/lib/browser';
import { WidgetFactory } from '@theia/core/lib/browser/widget-manager';
import { bindContributionProvider } from '@theia/core/lib/common/contribution-provider';
import { interfaces } from '@theia/core/shared/inversify';

import { OutlineWidgetContribution } from './outline-widget.contribution';
import { OutlineWidgetDecorator, OutlineWidgetDecoratorService } from './outline-widget.decorator';
import { OutlineWidgetTreeModel } from './outline-widget.model';
import { OutlineWidgetService } from './outline-widget.service';
import { OutlineWidget, OutlineWidgetFactory } from './outline-widget.widget';

export function registerOutlineWidget(bind: interfaces.Bind): void {
    bind(OutlineWidgetFactory).toFactory(ctx => () => createOutlineWidget(ctx.container));

    bind(OutlineWidgetService).toSelf().inSingletonScope();
    bind(WidgetFactory).toService(OutlineWidgetService);

    bindViewContribution(bind, OutlineWidgetContribution);
    bind(FrontendApplicationContribution).toService(OutlineWidgetContribution);
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
