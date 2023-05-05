/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import '../../css/colors.css';

import {
    ContainerContext,
    GLSPClientContribution,
    GLSPTheiaFrontendModule,
    registerDiagramManager,
    TheiaGLSPConnector
} from '@eclipse-glsp/theia-integration/lib/browser';
import { DiagramConfiguration } from 'sprotty-theia/lib';
import { UTDiagramLanguage } from '../common/language';
import { registerOutlineIntegration } from './features/outline/integration/di.config';
import { registerOutlineWidget } from './features/outline/widget/di.config';
import { registerThemeIntegration } from './features/theme/di.config';
import { UTClientContribution } from './glsp/connection/ut-client.contribution';
import { UTGLSPConnector } from './glsp/connection/ut-glsp.connector';
import { UTDiagramConfiguration } from './glsp/diagram/ut-diagram.configuration';
import { UTDiagramManager } from './glsp/diagram/ut-diagram.manager';
import { registerModelServerModule } from './modelserver/di.config';
import { registerEditorModule } from './theia/editor/di.config';
import { registerNewFileModule } from './theia/new-file/di.config';
import { registerWorkspaceModule } from './theia/workspace/di.config';

export class UTFrontendModule extends GLSPTheiaFrontendModule {
    readonly diagramLanguage = UTDiagramLanguage;

    override bindTheiaGLSPConnector(context: ContainerContext): void {
        context.bind(TheiaGLSPConnector).toDynamicValue(dynamicContext => {
            const connector = dynamicContext.container.resolve(UTGLSPConnector);
            connector.doConfigure(this.diagramLanguage);
            return connector;
        });
    }

    bindDiagramConfiguration(context: ContainerContext): void {
        context.bind(DiagramConfiguration).to(UTDiagramConfiguration);
    }

    override bindGLSPClientContribution(context: ContainerContext): void {
        context.bind(GLSPClientContribution).to(UTClientContribution);
    }

    override configure(context: ContainerContext): void {
        registerModelServerModule(context);
        registerEditorModule(context);
        registerNewFileModule(context);
        registerWorkspaceModule(context);

        registerOutlineIntegration(context);
        registerOutlineWidget(context);

        registerThemeIntegration(context);
    }

    override configureDiagramManager(context: ContainerContext): void {
        registerDiagramManager(context.bind, UTDiagramManager);
    }
}

export default new UTFrontendModule();
