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
import { ModelServerClient } from "@eclipse-emfcloud/modelserver-theia";
import { GLSPClientContribution } from "@eclipse-glsp/theia-integration/lib/browser";
import { CommandContribution, MenuContribution } from "@theia/core";
import { FrontendApplicationContribution, OpenHandler, WidgetFactory } from "@theia/core/lib/browser";
import { ContainerModule, interfaces } from "inversify";
import { DiagramConfiguration, DiagramManager, DiagramManagerProvider } from "sprotty-theia/lib";

import { UmlModelServerClient } from "../common/uml-model-server-client";
import { UmlModelContribution } from "./command-contribution";
import { UmlGLSPDiagramClient } from "./diagram/diagram-client";
import { UmlDiagramConfiguration } from "./diagram/diagram-configuration";
import { UmlDiagramManager } from "./diagram/diagram-manager";
import { UmlModelServerFrontendContribution } from "./frontend-contribution";
import { UmlGLSPClientContribution } from "./glsp-client-contribution";

export default new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind, isBound: interfaces.IsBound, rebind: interfaces.Rebind) => {
    bind(UmlModelServerFrontendContribution).toSelf().inSingletonScope();
    bind(FrontendApplicationContribution).toService(UmlModelServerFrontendContribution);
    bind(UmlGLSPClientContribution).toSelf().inSingletonScope();
    bind(GLSPClientContribution).toService(UmlGLSPClientContribution);
    bind(UmlGLSPDiagramClient).toSelf().inSingletonScope();
    bind(DiagramConfiguration).to(UmlDiagramConfiguration).inSingletonScope();
    bind(UmlDiagramManager).toSelf().inSingletonScope();
    bind(FrontendApplicationContribution).toService(UmlDiagramManager);
    bind(OpenHandler).toService(UmlDiagramManager);
    bind(WidgetFactory).toService(UmlDiagramManager);
    bind(DiagramManagerProvider).toProvider<DiagramManager>(context => () => new Promise<DiagramManager>(resolve => {
        const diagramManager = context.container.get<UmlDiagramManager>(UmlDiagramManager);
        resolve(diagramManager);
    }));

    bind(UmlModelServerClient).toService(ModelServerClient);

    bind(UmlModelContribution).toSelf().inSingletonScope();
    bind(CommandContribution).toService(UmlModelContribution);
    bind(MenuContribution).toService(UmlModelContribution);
});
