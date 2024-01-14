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

import { ContainerConfiguration } from '@eclipse-glsp/protocol';
import { GLSPStarter } from '@eclipse-glsp/vscode-integration-webview';
import { GLSPDiagramIdentifier } from '@eclipse-glsp/vscode-integration-webview/lib/diagram-identifier';
import { GLSPDiagramWidget } from '@eclipse-glsp/vscode-integration-webview/lib/glsp-diagram-widget';
import { Container } from 'inversify';
import { UmlDiagramWidget } from './diagram.widget';

class UVStarter extends GLSPStarter {
    createContainer(...containerConfiguration: ContainerConfiguration): Container {
        const container = createUmlDiagramContainer(...containerConfiguration);

        return container;
    }

    protected override addVscodeBindings(container: Container, diagramIdentifier: GLSPDiagramIdentifier): void {
        container.bind(UmlDiagramWidget).toSelf().inSingletonScope();
        container.rebind(GLSPDiagramWidget).toService(UmlDiagramWidget);
    }

    /* TODO: Removed
    protected override get extensionActionKinds(): string[] {
        return [...super.extensionActionKinds, RequestPropertyPaletteAction.KIND, SetPropertyPaletteAction.KIND];
    }
    */
}

export function launch(): void {
    new UVStarter();
}
