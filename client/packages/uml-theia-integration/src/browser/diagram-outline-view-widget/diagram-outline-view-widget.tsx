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

import { injectable, inject } from "@theia/core/shared/inversify";
import {
    TreeProps,
    ContextMenuRenderer,
    codicon
} from "@theia/core/lib/browser";
import { DiagramOutlineViewWidgetTreeModel } from "./diagram-outline-view-widget-model";
import { Emitter } from "@theia/core";
import { nls } from "@theia/core/lib/common/nls";
import { OutlineSymbolInformationNode, OutlineViewWidget } from "@theia/outline-view/lib/browser/outline-view-widget";

/**
 * Representation of an outline symbol information node.
 */
export interface DiagramOutlineSymbolInformationNode extends OutlineSymbolInformationNode {
    children: DiagramOutlineSymbolInformationNode[];
}

export type DiagramOutlineViewWidgetFactory = () => DiagramOutlineViewWidget;
export const DiagramOutlineViewWidgetFactory = Symbol("DiagramOutlineViewWidgetFactory");

@injectable()
export class DiagramOutlineViewWidget extends OutlineViewWidget {

    static LABEL = nls.localizeByDefault("Diagram Outline");

    readonly onDidChangeOpenStateEmitter = new Emitter<boolean>();

    constructor(
        @inject(TreeProps) treeProps: TreeProps,
        @inject(DiagramOutlineViewWidgetTreeModel) override readonly model: DiagramOutlineViewWidgetTreeModel,
        @inject(ContextMenuRenderer) contextMenuRenderer: ContextMenuRenderer
    ) {
        super(treeProps, model, contextMenuRenderer);

        this.id = "diagram-outline-view";
        this.title.label = DiagramOutlineViewWidget.LABEL;
        this.title.caption = DiagramOutlineViewWidget.LABEL;
        this.title.closable = true;
        this.title.iconClass = codicon("type-hierarchy");
        this.addClass("theia-outline-view");
    }
}
