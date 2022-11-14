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
import { configureDiagramServer, GLSPDiagramConfiguration } from "@eclipse-glsp/theia-integration/lib/browser";
import { createUmlDiagramContainer } from "@eclipsesource/uml-sprotty/lib";
import { Container, inject, injectable } from "inversify";

import { UmlLanguage } from "../../common/uml-language";
import {
    connectTheiaDiagramOutlineView,
    TheiaDiagramOutlineFactory,
    TheiaDiagramOutlineService
} from "../theia-diagram-outline";
import { UmlTheiaDiagramServer } from "./diagram-server";

@injectable()
export class UmlDiagramConfiguration extends GLSPDiagramConfiguration {
    @inject(TheiaDiagramOutlineFactory) protected readonly theiaDiagramOutlineFactory: () => TheiaDiagramOutlineService;

    diagramType: string = UmlLanguage.diagramType;

    doCreateContainer(widgetId: string): Container {
        const container = createUmlDiagramContainer(widgetId);

        configureDiagramServer(container, UmlTheiaDiagramServer);

        connectTheiaDiagramOutlineView(container, this.theiaDiagramOutlineFactory);

        return container;
    }
}
