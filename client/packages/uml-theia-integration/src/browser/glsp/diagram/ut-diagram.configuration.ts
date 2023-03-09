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
import { createUmlDiagramContainer } from '@borkdominik-biguml/uml-glsp/lib';
import { configureDiagramServer, GLSPDiagramConfiguration } from '@eclipse-glsp/theia-integration/lib/browser';
import { Container, inject, injectable } from 'inversify';

import { UTDiagramLanguage } from '../../../common/language';
import { connectOutlineIntegration, OutlineIntegrationFactory, OutlineIntegrationService } from '../../features/outline/integration';
import { UTDiagramServer } from '../connection/ut-diagram.server';

@injectable()
export class UTDiagramConfiguration extends GLSPDiagramConfiguration {
    @inject(OutlineIntegrationFactory) protected readonly outlineIntegrationWidgetFactory: () => OutlineIntegrationService;

    diagramType: string = UTDiagramLanguage.diagramType;

    doCreateContainer(widgetId: string): Container {
        const container = createUmlDiagramContainer(widgetId);

        configureDiagramServer(container, UTDiagramServer);

        connectOutlineIntegration(container, this.outlineIntegrationWidgetFactory);

        return container;
    }
}
