/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Container, ContainerModule } from 'inversify';
import { minimapModule } from 'packages/uml-vscode-integration/extension/src/features/minimap/minimap.module.js';
import type * as vscode from 'vscode';
import { TYPES } from './di.types.js';
import { outlineModule } from './features/outline/outline.module.js';
import { propertyPaletteModule } from './features/property-palette/property-palette.module.js';
import { themeModule } from './features/theme/theme.module.js';
import { IDEServer } from './glsp/ide-server.js';
import { IDESessionClient } from './glsp/ide-session-client.js';
import { UMLGLSPConnector } from './glsp/uml-glsp-connector.js';
import { UMLGLSPServer } from './glsp/uml-glsp-server.js';
import { type GlspServerConfig, glspServerModule } from './server/glsp-server.launcher.js';
import { serverManagerModule } from './server/server.manager.js';
import { vscodeModule } from './vscode/vscode.module.js';

export function createContainer(
    extensionContext: vscode.ExtensionContext,
    options: {
        glspServerConfig: GlspServerConfig;
    }
): Container {
    const container = new Container({
        skipBaseClassChecks: true
    });

    container.bind(TYPES.ExtensionContext).toConstantValue(extensionContext);

    const coreModule = new ContainerModule((bind, _unbind, _isBound, _rebind) => {
        bind(UMLGLSPServer).toSelf().inSingletonScope();
        bind(TYPES.GlspServer).toService(UMLGLSPServer);
        bind(TYPES.Disposable).toService(UMLGLSPServer);

        bind(UMLGLSPConnector).toSelf().inSingletonScope();
        bind(TYPES.Connector).toService(UMLGLSPConnector);
        bind(TYPES.Disposable).toService(UMLGLSPConnector);

        bind(TYPES.IDEServer).to(IDEServer).inSingletonScope();
        bind(TYPES.IDESessionClient).to(IDESessionClient).inSingletonScope();
    });

    container.load(
        glspServerModule(options.glspServerConfig),
        coreModule,
        serverManagerModule,
        vscodeModule,
        themeModule,
        propertyPaletteModule,
        outlineModule,
        minimapModule
    );

    return container;
}
