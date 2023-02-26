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
import '../../css/colors.css';

import {
    ContainerContext,
    GLSPClientContribution,
    GLSPTheiaFrontendModule,
    registerDiagramManager,
    TheiaGLSPConnector
} from '@eclipse-glsp/theia-integration/lib/browser';
import { CommandContribution, MenuContribution } from '@theia/core';
import { FrontendApplicationContribution } from '@theia/core/lib/browser/frontend-application';
import { LabelProviderContribution } from '@theia/core/lib/browser/label-provider';
import { DiagramConfiguration } from 'sprotty-theia/lib';

import { UmlLanguage } from '../common/uml-language';
import { UmlTheiaGLSPConnector } from './diagram/theia-glsp-connector';
import { UmlDiagramConfiguration } from './diagram/uml-diagram-configuration';
import { UmlDiagramManager } from './diagram/uml-diagram-manager';
import { registerOutlineIntegration } from './features/outline/integration/outline-integration.module';
import { registerOutlineWidget } from './features/outline/widget/outline-widget.module';
import { UmlTreeLabelProviderContribution } from './label-provider';
import { UmlGLSPClientContribution } from './uml-client-contribution';
import { UmlModelContribution } from './uml-command-contribution';
import { UmlFrontendContribution } from './uml-frontend-contribution';

export class UmlTheiaFrontendModule extends GLSPTheiaFrontendModule {
    protected override enableCopyPaste = true;
    readonly diagramLanguage = UmlLanguage;

    override bindTheiaGLSPConnector(context: ContainerContext): void {
        context.bind(TheiaGLSPConnector).toDynamicValue(dynamicContext => {
            const connector = dynamicContext.container.resolve(UmlTheiaGLSPConnector);
            connector.doConfigure(this.diagramLanguage);
            return connector;
        });
    }

    bindDiagramConfiguration(context: ContainerContext): void {
        context.bind(DiagramConfiguration).to(UmlDiagramConfiguration);
    }

    override bindGLSPClientContribution(context: ContainerContext): void {
        context.bind(GLSPClientContribution).to(UmlGLSPClientContribution);
    }

    override configure(context: ContainerContext): void {
        context.bind(UmlModelContribution).toSelf().inSingletonScope();
        context.bind(CommandContribution).toService(UmlModelContribution);
        context.bind(MenuContribution).toService(UmlModelContribution);
        context.bind(FrontendApplicationContribution).to(UmlFrontendContribution).inSingletonScope();
        context.bind(LabelProviderContribution).to(UmlTreeLabelProviderContribution).inSingletonScope();

        registerOutlineIntegration(context.bind);
        registerOutlineWidget(context.bind);
    }

    override configureDiagramManager(context: ContainerContext): void {
        registerDiagramManager(context.bind, UmlDiagramManager);
    }
}

export default new UmlTheiaFrontendModule();
