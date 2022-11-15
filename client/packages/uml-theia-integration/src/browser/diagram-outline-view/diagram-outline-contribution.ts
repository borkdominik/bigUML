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
import { DiagramWidget, GLSPDiagramWidget } from "@eclipse-glsp/theia-integration";
import { DisposableCollection } from "@theia/core";
import { FrontendApplication, FrontendApplicationContribution } from "@theia/core/lib/browser/frontend-application";
import { AbstractViewContribution } from "@theia/core/lib/browser/shell/view-contribution";
import { OS } from "@theia/core/lib/common/os";
import { inject, injectable } from "@theia/core/shared/inversify";
import { EditorManager } from "@theia/editor/lib/browser";

import { IChangedArgs, UmlDiagramManager } from "../diagram/uml-diagram-manager";
import { TheiaDiagramOutlineManager } from "../theia-diagram-outline";
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

    @inject(TheiaDiagramOutlineManager)
    protected readonly theiaDiagramOutlineManager: TheiaDiagramOutlineManager;

    @inject(UmlDiagramManager)
    protected readonly diagramManager: UmlDiagramManager;
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
        this.diagramManager.onCurrentEditorChanged(event => {
            this.handleEditorChanged(event);
        });

        this.diagramOutlineViewService.onDidChangeOpenState(async open => {
            const currentEditor = this.diagramManager.currentEditor;

            if (open) {
                if (currentEditor instanceof GLSPDiagramWidget) {
                    this.theiaDiagramOutlineManager.refresh(currentEditor);
                } else {
                    this.diagramOutlineViewService.publish([]);
                }
            }
        });
    }

    protected handleEditorChanged(event: IChangedArgs<DiagramWidget>): void {
        if (event.newValue instanceof GLSPDiagramWidget) {
            this.theiaDiagramOutlineManager.refresh(event.newValue);
        } else if (event.oldValue instanceof GLSPDiagramWidget) {
            this.theiaDiagramOutlineManager.clear();
        }
    }

    async initializeLayout(app: FrontendApplication): Promise<void> {
        await this.openView();
    }
}
