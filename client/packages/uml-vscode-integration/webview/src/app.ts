/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { createUmlDiagramContainer } from '@borkdominik-biguml/uml-glsp/lib';

import '@eclipse-glsp/vscode-integration-webview/css/glsp-vscode.css';

import { OutlineService } from '@borkdominik-biguml/uml-glsp/lib/features/outline';
import { GLSPStarter } from '@eclipse-glsp/vscode-integration-webview';
import { GLSPDiagramIdentifier } from '@eclipse-glsp/vscode-integration-webview/lib/diagram-identifer';
import { GLSPVscodeDiagramWidget } from '@eclipse-glsp/vscode-integration-webview/lib/glsp-vscode-diagram-widget';
import { Container } from 'inversify';
import { SprottyDiagramIdentifier } from 'sprotty-vscode-webview';
import { OutlineIntegrationService } from './features/outline/integration/outline-integration.service';
import { UVDiagramWidget } from './vscode/uv-diagram.widget';

class UVStarter extends GLSPStarter {
    createContainer(diagramIdentifier: SprottyDiagramIdentifier): Container {
        const container = createUmlDiagramContainer(diagramIdentifier.clientId);

        container.bind(OutlineService).to(OutlineIntegrationService).inSingletonScope();

        return container;
    }

    protected override addVscodeBindings(container: Container, diagramIdentifier: GLSPDiagramIdentifier): void {
        super.addVscodeBindings(container, diagramIdentifier);
        container.unbind(GLSPVscodeDiagramWidget);

        container.bind(UVDiagramWidget).toSelf().inSingletonScope();
        container.bind(GLSPVscodeDiagramWidget).toService(UVDiagramWidget);
    }
}

export function launch(): void {
    new UVStarter();
}
