/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { helloWorldModule } from '@borkdominik-biguml/big-hello-world/glsp-client';
import { minimapModule } from '@borkdominik-biguml/big-minimap/glsp-client';
import { outlineModule } from '@borkdominik-biguml/big-outline/glsp-client';
import { propertyPaletteModule } from '@borkdominik-biguml/big-property-palette/glsp-client';
import { ModelResourcesResponseAction } from '@borkdominik-biguml/uml-protocol';
import {
    type ContainerConfiguration,
    type IActionDispatcher,
    type IDiagramStartup,
    TYPES,
    bindAsService,
    bindOrRebind
} from '@eclipse-glsp/client';
import { type MaybePromise } from '@eclipse-glsp/protocol';
import { GLSPStarter } from '@eclipse-glsp/vscode-integration-webview';
import '@eclipse-glsp/vscode-integration-webview/css/glsp-vscode.css';
import { type GLSPDiagramIdentifier } from '@eclipse-glsp/vscode-integration-webview/lib/diagram-identifier.js';
import {
    ExtensionActionKind,
    HostExtensionActionHandler
} from '@eclipse-glsp/vscode-integration-webview/lib/features/default/extension-action-handler.js';
import { GLSPDiagramWidget } from '@eclipse-glsp/vscode-integration-webview/lib/glsp-diagram-widget.js';
import { type Container, inject, injectable } from 'inversify';
import { createUMLDiagramContainer } from '../browser/index.js';
import { GLSPIsReadyAction } from '../common/index.js';
import { UMLDiagramWidget } from './diagram.widget.js';
import { UMLHostExtensionActionHandler } from './vscode-extension-action-handler.js';

class UMLStarter extends GLSPStarter {
    createContainer(...containerConfiguration: ContainerConfiguration): Container {
        const container = createUMLDiagramContainer(
            ...containerConfiguration,
            outlineModule,
            minimapModule,
            propertyPaletteModule,
            helloWorldModule
        );

        return container;
    }

    protected override addVscodeBindings(container: Container, _diagramIdentifier: GLSPDiagramIdentifier): void {
        container.bind(UMLDiagramWidget).toSelf().inSingletonScope();
        bindOrRebind(container, GLSPDiagramWidget).toService(UMLDiagramWidget);
        container.rebind(HostExtensionActionHandler).to(UMLHostExtensionActionHandler).inSingletonScope();

        container.bind(ExtensionActionKind).toConstantValue(GLSPIsReadyAction.KIND);
        container.bind(ExtensionActionKind).toConstantValue(ModelResourcesResponseAction.KIND);
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
