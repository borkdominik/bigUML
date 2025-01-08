/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Container, ContainerModule } from 'inversify';
import { minimapModule } from 'packages/uml-vscode-integration/extension/src/features/minimap/minimap.module';
import * as vscode from 'vscode';
import { TYPES } from './di.types';
import { outlineModule } from './features/outline/outline.module';
import { propertyPaletteModule } from './features/property-palette/property-palette.module';
import { textInputModule } from './features/text-input/text-input-palette.module';
import { themeModule } from './features/theme/theme.module';
import { IDEServer } from './glsp/ide-server';
import { IDESessionClient } from './glsp/ide-session-client';
import { UMLGLSPConnector } from './glsp/uml-glsp-connector';
import { UMLGLSPServer } from './glsp/uml-glsp-server';
import { GlspServerConfig, glspServerModule } from './server/glsp-server.launcher';
import { serverManagerModule } from './server/server.manager';
import { vscodeModule } from './vscode/vscode.module';

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

    const coreModule = new ContainerModule((bind, unbind, isBound, rebind) => {
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
        textInputModule,
        outlineModule,
        minimapModule
    );

    return container;
}
