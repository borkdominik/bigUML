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
import {
    ContainerContext,
    GLSPClientContribution,
    GLSPTheiaFrontendModule,
    registerDiagramManager,
    TheiaGLSPConnector
} from "@eclipse-glsp/theia-integration/lib/browser";
import { CommandContribution, MenuContribution } from "@theia/core";
import { DiagramConfiguration } from "sprotty-theia/lib";

import { UmlLanguage } from "../common/uml-language";
import { UmlModelServerClient } from "../common/uml-model-server-client";
import { registerDiagramOutlineViewWidget } from "./diagram-outline-view/diagram-outline-frontend-module";
import { UmlDiagramConfiguration } from "./diagram/diagram-configuration";
import { UmlDiagramManager } from "./diagram/diagram-manager";
import { UmlTheiaGLSPConnector } from "./diagram/theia-glsp-connector";
import { registerTheiaDiagramOutlineView } from "./theia-diagram-outline/theia-diagram-outline-frontend-module";
import { UmlGLSPClientContribution } from "./uml-client-contribution";
import { UmlModelContribution } from "./uml-command-contribution";

export class UmlTheiaFrontendModule extends GLSPTheiaFrontendModule {
    protected enableCopyPaste = true;
    readonly diagramLanguage = UmlLanguage;

    bindTheiaGLSPConnector(context: ContainerContext): void {
        context.bind(TheiaGLSPConnector).toDynamicValue(dynamicContext => {
            const connector = dynamicContext.container.resolve(
                UmlTheiaGLSPConnector
            );
            connector.doConfigure(this.diagramLanguage);
            return connector;
        });
    }

    bindDiagramConfiguration(context: ContainerContext): void {
        context.bind(DiagramConfiguration).to(UmlDiagramConfiguration);
    }

    bindGLSPClientContribution(context: ContainerContext): void {
        context.bind(GLSPClientContribution).to(UmlGLSPClientContribution);
    }

    configure(context: ContainerContext): void {
        context.bind(UmlModelContribution).toSelf().inSingletonScope();
        context.bind(CommandContribution).toService(UmlModelContribution);
        context.bind(MenuContribution).toService(UmlModelContribution);
        context.bind(UmlModelServerClient).toService(ModelServerClient);

        registerTheiaDiagramOutlineView(context.bind);
        registerDiagramOutlineViewWidget(context.bind);
    }

    configureDiagramManager(context: ContainerContext): void {
        registerDiagramManager(context.bind, UmlDiagramManager);
    }
}

export default new UmlTheiaFrontendModule();
