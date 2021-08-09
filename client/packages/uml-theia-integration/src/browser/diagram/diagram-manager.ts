/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
import {
    EnableToolPaletteAction,
    InitializeClientSessionAction,
    RequestTypeHintsAction,
    SetEditModeAction
} from "@eclipse-glsp/client";
import {
    GLSPDiagramManager,
    GLSPDiagramWidget,
    GLSPNotificationManager,
    GLSPTheiaDiagramServer,
    GLSPTheiaSprottyConnector,
    GLSPWidgetOpenerOptions,
    GLSPWidgetOptions
} from "@eclipse-glsp/theia-integration/lib/browser";
import { MessageService, SelectionService } from "@theia/core";
import { WidgetManager } from "@theia/core/lib/browser";
import URI from "@theia/core/lib/common/uri";
import { EditorManager } from "@theia/editor/lib/browser";
import { WorkspaceService } from "@theia/workspace/lib/browser";
import { inject, injectable } from "inversify";
import { DiagramServer, ModelSource, RequestModelAction, TYPES } from "sprotty";
import { DiagramWidget, DiagramWidgetOptions, TheiaFileSaver } from "sprotty-theia";

import { UmlLanguage } from "../../common/uml-language";
import { UmlGLSPDiagramClient } from "./diagram-client";

export const UML_DIAGRAM_ICON_CLASS = "fa fa-project-diagram";

export interface UmlDiagramWidgetOptions extends DiagramWidgetOptions, GLSPWidgetOptions {
    workspaceRoot: string;
}

@injectable()
export class UmlDiagramManager extends GLSPDiagramManager {
    readonly diagramType = UmlLanguage.DiagramType;
    readonly iconClass = UML_DIAGRAM_ICON_CLASS;
    readonly label = UmlLanguage.Label + " Editor";

    private _diagramConnector: GLSPTheiaSprottyConnector;
    private workspaceRoot: string;

    @inject(SelectionService) protected readonly selectionService: SelectionService;

    constructor(
        @inject(UmlGLSPDiagramClient) diagramClient: UmlGLSPDiagramClient,
        @inject(TheiaFileSaver) fileSaver: TheiaFileSaver,
        @inject(WidgetManager) widgetManager: WidgetManager,
        @inject(EditorManager) editorManager: EditorManager,
        @inject(MessageService) messageService: MessageService,
        @inject(GLSPNotificationManager) notificationManager: GLSPNotificationManager,
        @inject(WorkspaceService) workspaceService: WorkspaceService) {
        super();
        this._diagramConnector = new GLSPTheiaSprottyConnector({
            diagramClient,
            fileSaver, editorManager, widgetManager, diagramManager: this, messageService, notificationManager
        });
        workspaceService.roots.then(roots => this.workspaceRoot = roots[0].uri);
    }

    get fileExtensions(): string[] {
        return [UmlLanguage.FileExtension];
    }

    get diagramConnector(): GLSPTheiaSprottyConnector {
        return this._diagramConnector;
    }

    async createWidget(options?: any): Promise<DiagramWidget> {
        if (DiagramWidgetOptions.is(options)) {
            const clientId = this.createClientId();
            const widgetId = this.createWidgetId(options);
            const config = this.getDiagramConfiguration(options);
            const diContainer = config.createContainer(clientId);
            return new UmlDiagramWidget(options, widgetId, diContainer, this.editorPreferences, this.diagramConnector);
        }
        throw Error("DiagramWidgetFactory needs DiagramWidgetOptions but got " + JSON.stringify(options));
    }

    protected createWidgetOptions(uri: URI, options?: GLSPWidgetOpenerOptions): UmlDiagramWidgetOptions {
        return {
            ...super.createWidgetOptions(uri, options),
            workspaceRoot: this.workspaceRoot
        } as UmlDiagramWidgetOptions;
    }

}

export class UmlDiagramWidget extends GLSPDiagramWidget {

    options: UmlDiagramWidgetOptions;

    protected initializeSprotty(): void {
        const modelSource = this.diContainer.get<ModelSource>(TYPES.ModelSource);
        if (modelSource instanceof DiagramServer) {
            modelSource.clientId = this.id;
        }
        if (modelSource instanceof GLSPTheiaDiagramServer && this.connector) {
            this.connector.connect(modelSource);
        }

        this.disposed.connect(() => {
            if (modelSource instanceof GLSPTheiaDiagramServer && this.connector) {
                this.connector.disconnect(modelSource);
            }
        });

        this.actionDispatcher.dispatch(new InitializeClientSessionAction(this.widgetId));
        this.actionDispatcher.dispatch(new RequestModelAction({
            sourceUri: this.uri.path.toString(),
            needsClientLayout: `${this.viewerOptions.needsClientLayout}`,
            ... this.options
        }));

        this.actionDispatcher.dispatch(new RequestTypeHintsAction(this.options.diagramType));
        this.actionDispatcher.dispatch(new EnableToolPaletteAction());
        this.actionDispatcher.dispatch(new SetEditModeAction(this.options.editMode));
    }

}
