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
import { DisposableCollection } from "@theia/core";
import { FrontendApplication, FrontendApplicationContribution } from "@theia/core/lib/browser/frontend-application";
import { AbstractViewContribution } from "@theia/core/lib/browser/shell/view-contribution";
import { OS } from "@theia/core/lib/common/os";
import { inject, injectable } from "@theia/core/shared/inversify";
import { EditorManager } from "@theia/editor/lib/browser";
import debounce = require("lodash.debounce");

import { DiagramOutlineViewService } from "./diagram-outline-view-service";
import { DiagramOutlineViewWidget } from "./diagram-outline-view-widget";

export const DIAGRAM_OUTLINE_VIEW_WIDGET_FACTORY_ID = "diagram-outline-view";

@injectable()
export class DiagramOutlineViewContribution extends AbstractViewContribution<DiagramOutlineViewWidget> implements FrontendApplicationContribution {
    protected readonly toDisposeOnClose = new DisposableCollection();
    protected readonly toDisposeOnEditor = new DisposableCollection();
    protected canUpdateOutline = true;

    @inject(DiagramOutlineViewService)
    protected readonly diagramOutlineViewService: DiagramOutlineViewService;

    @inject(EditorManager)
    protected readonly editorManager: EditorManager;

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

    onStart(app: FrontendApplication): void {
        this.diagramOutlineViewService.onDidChangeOpenState(async open => {
            console.log("OnDidChangeOpenState", open);
            if (open) {
                this.toDisposeOnClose.push(this.toDisposeOnEditor);
                this.toDisposeOnClose.push(this.editorManager.onCurrentEditorChanged(
                    debounce(() => this.handleCurrentEditorChanged(), 50)
                ));
                this.handleCurrentEditorChanged();
            } else {
                this.toDisposeOnClose.dispose();
            }
        });
        this.diagramOutlineViewService.onDidSelect(async node => {
            console.log("OnDidDelect", node);
        });
    }

    protected handleCurrentEditorChanged(): void {
        this.toDisposeOnEditor.dispose();
        if (this.toDisposeOnClose.disposed) {
            return;
        }
        this.toDisposeOnClose.push(this.toDisposeOnEditor);

        this.updateOutline();
    }

    protected async updateOutline(editorSelection?: Range): Promise<void> {
        if (!this.canUpdateOutline) {
            return;
        }

    }

    async initializeLayout(app: FrontendApplication): Promise<void> {
        await this.openView();
    }
}
