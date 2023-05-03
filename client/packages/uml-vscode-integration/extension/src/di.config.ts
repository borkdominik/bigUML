/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
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

import { ModelServerConfig } from '@borkdominik-biguml/uml-modelserver';
import { Container, ContainerModule } from 'inversify';
import * as vscode from 'vscode';
import { FEATURE_TYPES, TYPES, VSCODE_TYPES } from './di.types';
import { ThemeIntegration } from './features/theme/theme-integration';
import { UVGlspConnector } from './glsp/uv-glsp-connector';
import { UVGlspServer } from './glsp/uv-glsp-server';
import { UVModelServerClient } from './modelserver/uv-modelserver.client';
import { GlspServerConfig, glspServerModule } from './server/glsp-server.launcher';
import { modelServerModule } from './server/modelserver.launcher';
import { serverManager } from './server/server.manager';
import { CommandManager } from './vscode/command/command.manager';
import { DisposableManager } from './vscode/disposable/disposable.manager';
import { EditorProvider } from './vscode/editor/editor.provider';
import { NewFileCommand } from './vscode/new-file/new-file.command';
import { NewFileCreator } from './vscode/new-file/new-file.creator';
import { OutputChannel } from './vscode/output/output.channel';
import { Settings } from './vscode/settings/settings';
import { WorkspaceWatcher } from './vscode/workspace/workspace.watcher';

export function createContainer(
    context: vscode.ExtensionContext,
    options: {
        glspServerConfig: GlspServerConfig;
        modelServerConfig: ModelServerConfig;
    }
): Container {
    const container = new Container({
        skipBaseClassChecks: true
    });

    container.bind(VSCODE_TYPES.ExtensionContext).toConstantValue(context);

    const coreModule = new ContainerModule(bind => {
        bind(TYPES.GlspServerConfig).toConstantValue(options.glspServerConfig);
        bind(TYPES.ModelServerConfig).toConstantValue(options.modelServerConfig);

        bind(UVGlspServer).toSelf().inSingletonScope();
        bind(TYPES.GlspServer).toService(UVGlspServer);
        bind(VSCODE_TYPES.Disposable).toService(UVGlspServer);

        bind(UVGlspConnector).toSelf().inSingletonScope();
        bind(TYPES.Connector).toService(UVGlspConnector);
        bind(VSCODE_TYPES.Disposable).toService(UVGlspConnector);

        bind(UVModelServerClient).toSelf().inSingletonScope();
        bind(TYPES.ModelServerClient).toService(UVModelServerClient);
        bind(VSCODE_TYPES.Disposable).toService(UVModelServerClient);

        bind(TYPES.ServerManagerStateListener).toService(UVModelServerClient);
    });

    const vscodeModule = new ContainerModule(bind => {
        bind(CommandManager).toSelf().inSingletonScope();
        bind(VSCODE_TYPES.CommandManager).toService(CommandManager);
        bind(VSCODE_TYPES.RootInitialization).toService(CommandManager);

        bind(NewFileCreator).toSelf().inSingletonScope();
        bind(VSCODE_TYPES.Command).to(NewFileCommand);

        bind(DisposableManager).toSelf().inSingletonScope();
        bind(VSCODE_TYPES.DisposableManager).toService(DisposableManager);
        bind(VSCODE_TYPES.RootInitialization).toService(DisposableManager);

        bind(EditorProvider).toSelf().inSingletonScope();
        bind(VSCODE_TYPES.EditorProvider).toService(EditorProvider);
        bind(VSCODE_TYPES.RootInitialization).toService(EditorProvider);

        bind(OutputChannel).toSelf().inSingletonScope();
        bind(VSCODE_TYPES.OutputChannel).toService(OutputChannel);

        bind(Settings).toSelf().inSingletonScope();
        bind(VSCODE_TYPES.Settings).toService(Settings);
        bind(VSCODE_TYPES.RootInitialization).toService(Settings);

        bind(WorkspaceWatcher).toSelf().inSingletonScope();
        bind(VSCODE_TYPES.RootInitialization).toService(WorkspaceWatcher);
    });

    const featureModule = new ContainerModule(bind => {
        bind(ThemeIntegration).toSelf().inSingletonScope();
        bind(FEATURE_TYPES.Theme).toService(ThemeIntegration);
        bind(VSCODE_TYPES.Disposable).toService(ThemeIntegration);
        bind(VSCODE_TYPES.RootInitialization).toService(ThemeIntegration);
    });

    container.load(
        coreModule,
        vscodeModule,
        featureModule,
        modelServerModule(options.modelServerConfig),
        glspServerModule(options.glspServerConfig),
        serverManager
    );

    return container;
}
