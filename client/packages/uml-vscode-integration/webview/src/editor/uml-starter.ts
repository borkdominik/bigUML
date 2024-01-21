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

import { GLSPIsReadyAction } from '@borkdominik-biguml/uml-protocol';
import { IActionDispatcher, IDiagramStartup, TYPES } from '@eclipse-glsp/client';
import { bindAsService, bindOrRebind, ContainerConfiguration, MaybePromise } from '@eclipse-glsp/protocol';
import { GLSPStarter } from '@eclipse-glsp/vscode-integration-webview';
import { GLSPDiagramIdentifier } from '@eclipse-glsp/vscode-integration-webview/lib/diagram-identifier';
import { ExtensionActionKind } from '@eclipse-glsp/vscode-integration-webview/lib/features/default/extension-action-handler';
import { GLSPDiagramWidget } from '@eclipse-glsp/vscode-integration-webview/lib/glsp-diagram-widget';
import { Container, inject, injectable } from 'inversify';
import { UmlDiagramWidget } from './diagram.widget';

class UVStarter extends GLSPStarter {
    createContainer(...containerConfiguration: ContainerConfiguration): Container {
        const container = createUmlDiagramContainer(...containerConfiguration);

        return container;
    }

    protected override addVscodeBindings(container: Container, diagramIdentifier: GLSPDiagramIdentifier): void {
        container.bind(UmlDiagramWidget).toSelf().inSingletonScope();
        bindOrRebind(container, GLSPDiagramWidget).toService(UmlDiagramWidget);
        container.bind(ExtensionActionKind).toConstantValue(GLSPIsReadyAction.KIND);
        bindAsService(container, TYPES.IDiagramStartup, GLSPReadyStartup);
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

@injectable()
class GLSPReadyStartup implements IDiagramStartup {
    @inject(TYPES.IActionDispatcher)
    protected actionDispatcher: IActionDispatcher;

    public postRequestModel(): MaybePromise<void> {
        this.actionDispatcher.dispatch(GLSPIsReadyAction.create());
    }
}
