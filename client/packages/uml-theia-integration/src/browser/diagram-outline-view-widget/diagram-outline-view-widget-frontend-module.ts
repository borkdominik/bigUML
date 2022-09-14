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

import { interfaces } from "@theia/core/shared/inversify";
import { DiagramOutlineViewContribution } from "./diagram-outline-view-widget-contribution";
import { WidgetFactory } from "@theia/core/lib/browser/widget-manager";
import {
    FrontendApplicationContribution,
    createTreeContainer,
    bindViewContribution
} from "@theia/core/lib/browser";
import { TabBarToolbarContribution } from "@theia/core/lib/browser/shell/tab-bar-toolbar";
import { DiagramOutlineViewWidgetFactory, DiagramOutlineViewWidget } from "./diagram-outline-view-widget";
import { bindContributionProvider } from "@theia/core/lib/common/contribution-provider";
import { DiagramOutlineViewWidgetTreeModel } from "./diagram-outline-view-widget-model";
import { DiagramOutlineViewWidgetDecoratorService, DiagramOutlineTreeDecorator } from "./diagram-outline-view-widget-decorator";
import { DiagramOutlineViewWidgetService } from "./diagram-outline-view-widget-service";

export function registerDiagramOutlineViewWidget(bind: interfaces.Bind): void {
    bind(DiagramOutlineViewWidgetFactory).toFactory(ctx =>
        () => createDiagramOutlineViewWidget(ctx.container)
    );

    bind(DiagramOutlineViewWidgetService).toSelf().inSingletonScope();
    bind(WidgetFactory).toService(DiagramOutlineViewWidgetService);

    bindViewContribution(bind, DiagramOutlineViewContribution);
    bind(FrontendApplicationContribution).toService(DiagramOutlineViewContribution);
    bind(TabBarToolbarContribution).toService(DiagramOutlineViewContribution);
}

function createDiagramOutlineViewWidgetContainer(parent: interfaces.Container): interfaces.Container {
    const child = createTreeContainer(parent, {
        props: { expandOnlyOnExpansionToggleClick: true, search: true },
        widget: DiagramOutlineViewWidget,
        model: DiagramOutlineViewWidgetTreeModel,
        decoratorService: DiagramOutlineViewWidgetDecoratorService
    });
    bindContributionProvider(child, DiagramOutlineTreeDecorator);
    return child;
}

function createDiagramOutlineViewWidget(parent: interfaces.Container): DiagramOutlineViewWidget {
    const child = createDiagramOutlineViewWidgetContainer(parent);

    return child.get(DiagramOutlineViewWidget);
}
