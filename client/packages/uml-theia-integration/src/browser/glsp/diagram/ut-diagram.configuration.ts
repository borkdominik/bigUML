/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { createUmlDiagramContainer } from '@borkdominik-biguml/uml-glsp/lib';
import { configureDiagramServer, GLSPDiagramConfiguration } from '@eclipse-glsp/theia-integration/lib/browser';
import { Container, inject, injectable } from 'inversify';

import { UTDiagramLanguage } from '../../../common/language';
import { connectOutlineIntegration, OutlineIntegrationFactory, OutlineIntegrationService } from '../../features/outline/integration';
import { ThemeIntegration, ThemeIntegrationFactory } from '../../features/theme/theme-integration';
import { connectThemeIntegration } from '../../features/theme/theme-integration.contribution';
import { UTDiagramServer } from '../connection/ut-diagram.server';

@injectable()
export class UTDiagramConfiguration extends GLSPDiagramConfiguration {
    @inject(OutlineIntegrationFactory) protected readonly outlineIntegrationFactory: () => OutlineIntegrationService;
    @inject(ThemeIntegrationFactory) protected readonly themeIntegrationFactory: () => ThemeIntegration;

    diagramType: string = UTDiagramLanguage.diagramType;

    doCreateContainer(widgetId: string): Container {
        const container = createUmlDiagramContainer(widgetId);

        configureDiagramServer(container, UTDiagramServer);

        connectOutlineIntegration(container, this.outlineIntegrationFactory);
        connectThemeIntegration(container, this.themeIntegrationFactory);

        return container;
    }
}
