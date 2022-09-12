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

import { injectable } from "@theia/core/shared/inversify";
import { AbstractViewContribution } from "@theia/core/lib/browser/shell/view-contribution";
import { FrontendApplicationContribution, FrontendApplication } from "@theia/core/lib/browser/frontend-application";
import { Command, CommandRegistry } from "@theia/core/lib/common/command";
import { TabBarToolbarContribution, TabBarToolbarRegistry } from "@theia/core/lib/browser/shell/tab-bar-toolbar";
import { codicon, Widget } from "@theia/core/lib/browser/widgets";
import { DiagramOutlineViewWidget } from "./diagram-outline-view-widget";
import { CompositeTreeNode } from "@theia/core/lib/browser/tree";
import { OS } from "@theia/core/lib/common/os";
import { nls } from "@theia/core/lib/common/nls";

export const DIAGRAM_OUTLINE_VIEW_WIDGET_FACTORY_ID = "diagram-outline-view";

/**
 * Collection of `outline-view` commands.
 */
export namespace DiagramOutlineViewWidgetCommands {
    /**
     * Command which collapses all nodes
     * from the `outline-view` tree.
     */
    export const COLLAPSE_ALL: Command = {
        id: "diagramOutlineView.collapse.all",
        iconClass: codicon("collapse-all")
    };
}

@injectable()
export class DiagramOutlineViewContribution extends AbstractViewContribution<DiagramOutlineViewWidget> implements FrontendApplicationContribution, TabBarToolbarContribution {

    constructor() {
        super({
            widgetId: DIAGRAM_OUTLINE_VIEW_WIDGET_FACTORY_ID,
            widgetName: DiagramOutlineViewWidget.LABEL,
            defaultWidgetOptions: {
                area: "right",
                rank: 500
            },
            toggleCommandId: "diagramOutlineView:toggle",
            toggleKeybinding: OS.type() !== OS.Type.Linux
                ? "ctrlcmd+shift+o"
                : undefined
        });

    }

    async initializeLayout(app: FrontendApplication): Promise<void> {
        await this.openView();
    }

    override registerCommands(commands: CommandRegistry): void {
        super.registerCommands(commands);
        commands.registerCommand(DiagramOutlineViewWidgetCommands.COLLAPSE_ALL, {
            isEnabled: widget => this.withWidget(widget, () => true),
            isVisible: widget => this.withWidget(widget, () => true),
            execute: () => this.collapseAllItems()
        });
    }

    registerToolbarItems(toolbar: TabBarToolbarRegistry): void {
        toolbar.registerItem({
            id: DiagramOutlineViewWidgetCommands.COLLAPSE_ALL.id,
            command: DiagramOutlineViewWidgetCommands.COLLAPSE_ALL.id,
            tooltip: nls.localizeByDefault("Collapse All"),
            priority: 0
        });
    }

    /**
     * Collapse all nodes in the outline view tree.
     */
    protected async collapseAllItems(): Promise<void> {
        const { model } = await this.widget;
        const root = model.root;
        if (CompositeTreeNode.is(root)) {
            model.collapseAll(root);
        }
    }

    /**
     * Determine if the current widget is the `outline-view`.
     */
    protected withWidget<T>(widget: Widget | undefined = this.tryGetWidget(), cb: (widget: DiagramOutlineViewWidget) => T): T | false {
        if (widget instanceof DiagramOutlineViewWidget && widget.id === DIAGRAM_OUTLINE_VIEW_WIDGET_FACTORY_ID) {
            return cb(widget);
        }
        return false;
    }
}
