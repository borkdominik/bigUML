/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { createUMLDiagramContainer } from '@borkdominik-biguml/uml-glsp/lib';

import '@eclipse-glsp/vscode-integration-webview/css/glsp-vscode.css';

import { AudioRecordingCompleteAction, ExportHistoryAction, GLSPIsReadyAction, MinimapExportSvgAction, ModelResourcesResponseAction } from '@borkdominik-biguml/uml-protocol';
import { IActionDispatcher, IDiagramStartup, InitializeCanvasBoundsAction, TYPES } from '@eclipse-glsp/client';
import { ContainerConfiguration, MaybePromise, SetViewportAction, bindAsService, bindOrRebind } from '@eclipse-glsp/protocol';
import { GLSPStarter } from '@eclipse-glsp/vscode-integration-webview';
import { GLSPDiagramIdentifier } from '@eclipse-glsp/vscode-integration-webview/lib/diagram-identifier';
import { ExtensionActionKind } from '@eclipse-glsp/vscode-integration-webview/lib/features/default/extension-action-handler';
import { GLSPDiagramWidget } from '@eclipse-glsp/vscode-integration-webview/lib/glsp-diagram-widget';
import { Container, inject, injectable } from 'inversify';
import { UMLDiagramWidget } from './diagram.widget';

class UMLStarter extends GLSPStarter {
    createContainer(...containerConfiguration: ContainerConfiguration): Container {
        const container = createUMLDiagramContainer(...containerConfiguration);

        return container;
    }

    protected override addVscodeBindings(container: Container, diagramIdentifier: GLSPDiagramIdentifier): void {
        container.bind(UMLDiagramWidget).toSelf().inSingletonScope();
        bindOrRebind(container, GLSPDiagramWidget).toService(UMLDiagramWidget);
        container.bind(ExtensionActionKind).toConstantValue(GLSPIsReadyAction.KIND);
        container.bind(ExtensionActionKind).toConstantValue(MinimapExportSvgAction.KIND);
        container.bind(ExtensionActionKind).toConstantValue(ModelResourcesResponseAction.KIND);
        container.bind(ExtensionActionKind).toConstantValue(SetViewportAction.KIND); // necessary to have it in the provider loop
        container.bind(ExtensionActionKind).toConstantValue(InitializeCanvasBoundsAction.KIND); // necessary to have it in the provider loop
        container.bind(ExtensionActionKind).toConstantValue(AudioRecordingCompleteAction.KIND);
        container.bind(ExtensionActionKind).toConstantValue(ExportHistoryAction.KIND);

        bindAsService(container, TYPES.IDiagramStartup, GLSPReadyStartup);
    }
}

export function launch(): void {
    new UMLStarter();
}

@injectable()
class GLSPReadyStartup implements IDiagramStartup {
    @inject(TYPES.IActionDispatcher)
    protected actionDispatcher: IActionDispatcher;

    public postRequestModel(): MaybePromise<void> {
        this.actionDispatcher.dispatch(GLSPIsReadyAction.create());
    }
}
