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
import { TYPES } from "@eclipse-glsp/client/lib";
import {
    connectTheiaContextMenuService,
    TheiaContextMenuService,
    TheiaContextMenuServiceFactory
} from "@eclipse-glsp/theia-integration/lib/browser";
import { createUmlDiagramContainer } from "@eclipsesource/uml-sprotty/lib";
import { SelectionService } from "@theia/core";
import { Container, inject, injectable } from "inversify";
import { DiagramConfiguration, TheiaDiagramServer } from "sprotty-theia/lib";

import { UmlLanguage } from "../../common/uml-language";
import { UmlGLSPTheiaDiagramServer } from "./diagram-server";

@injectable()
export class UmlDiagramConfiguration implements DiagramConfiguration {

    @inject(SelectionService) protected selectionService: SelectionService;
    @inject(TheiaContextMenuServiceFactory) protected contextMenuServiceFactory: () => TheiaContextMenuService;

    diagramType: string = UmlLanguage.DiagramType;

    createContainer(widgetId: string): Container {
        const container = createUmlDiagramContainer(widgetId);
        container.bind(TYPES.ModelSource).to(UmlGLSPTheiaDiagramServer).inSingletonScope();
        container.bind(TheiaDiagramServer).toService(UmlGLSPTheiaDiagramServer);
        connectTheiaContextMenuService(container, this.contextMenuServiceFactory);
        return container;
    }
}
