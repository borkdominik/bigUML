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

import { RequestPropertyPaletteAction, SetPropertyPaletteAction } from '@borkdominik-biguml/uml-common';
import { GLSPStarter, GLSPVscodeDiagramServer } from '@eclipse-glsp/vscode-integration-webview';
import { GLSPDiagramIdentifier } from '@eclipse-glsp/vscode-integration-webview/lib/diagram-identifer';
import { GLSPVscodeDiagramWidget } from '@eclipse-glsp/vscode-integration-webview/lib/glsp-vscode-diagram-widget';
import { Container } from 'inversify';
// eslint-disable-next-line no-restricted-imports
import { SprottyDiagramIdentifier } from 'sprotty-vscode-webview';
import { UVDiagramServer } from './vscode/uv-diagram.server';
import { UVDiagramWidget } from './vscode/uv-diagram.widget';

class UVStarter extends GLSPStarter {
    createContainer(diagramIdentifier: SprottyDiagramIdentifier): Container {
        const container = createUmlDiagramContainer(diagramIdentifier.clientId);

        return container;
    }

    protected override addVscodeBindings(container: Container, diagramIdentifier: GLSPDiagramIdentifier): void {
        super.addVscodeBindings(container, diagramIdentifier);
        container.unbind(GLSPVscodeDiagramWidget);
        container.unbind(GLSPVscodeDiagramServer);

        container.bind(UVDiagramWidget).toSelf().inSingletonScope();
        container.bind(GLSPVscodeDiagramWidget).toService(UVDiagramWidget);

        container.bind(UVDiagramServer).toSelf().inSingletonScope();
        container.bind(GLSPVscodeDiagramServer).toService(UVDiagramServer);
    }

    protected override get extensionActionKinds(): string[] {
        return [...super.extensionActionKinds, RequestPropertyPaletteAction.KIND, SetPropertyPaletteAction.KIND];
    }
}

export function launch(): void {
    new UVStarter();
}
