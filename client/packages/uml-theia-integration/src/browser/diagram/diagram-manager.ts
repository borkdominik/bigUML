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
import { GLSPDiagramManager, GLSPWidgetOpenerOptions, GLSPWidgetOptions } from "@eclipse-glsp/theia-integration/lib/browser";
import { SelectionService } from "@theia/core";
import URI from "@theia/core/lib/common/uri";
import { WorkspaceService } from "@theia/workspace/lib/browser";
import { inject, injectable, postConstruct } from "inversify";
import { DiagramWidgetOptions } from "sprotty-theia";

import { UmlLanguage } from "../../common/uml-language";

export interface UmlDiagramWidgetOptions extends DiagramWidgetOptions, GLSPWidgetOptions {
    workspaceRoot: string;
}

@injectable()
export class UmlDiagramManager extends GLSPDiagramManager {

    @inject(SelectionService) protected readonly selectionService: SelectionService;
    @inject(WorkspaceService) protected readonly workspaceService: WorkspaceService;

    readonly diagramType = UmlLanguage.diagramType;
    readonly label = UmlLanguage.label + " Editor";

    private workspaceRoot: string;

    @postConstruct()
    protected async initialize(): Promise<void> {
        super.initialize();
        this.workspaceService.roots.then(roots => (this.workspaceRoot = roots[0].resource.toString()));
    }

    get fileExtensions(): string[] {
        return UmlLanguage.fileExtensions;
    }

    get iconClass(): string {
        return UmlLanguage.iconClass!;
    }

    protected createWidgetOptions(uri: URI, options?: GLSPWidgetOpenerOptions): UmlDiagramWidgetOptions {
        return {
            ...super.createWidgetOptions(uri, options),
            workspaceRoot: this.workspaceRoot
        } as UmlDiagramWidgetOptions;
    }

}
