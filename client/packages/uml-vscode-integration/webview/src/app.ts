/********************************************************************************
 * Copyright (c) 2020-2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { createUmlDiagramContainer } from '@borkdominik-bigUML/uml-glsp/lib';
import { OutlineService } from '@borkdominik-bigUML/uml-glsp/lib/features/outline';
import { GLSPStarter } from '@eclipse-glsp/vscode-integration-webview';
import '@eclipse-glsp/vscode-integration-webview/css/glsp-vscode.css';
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
