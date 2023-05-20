/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { ModelServerConfig } from '@borkdominik-biguml/uml-modelserver';
import { Container, ContainerModule } from 'inversify';
import * as vscode from 'vscode';
import { TYPES } from './di.types';
import { ThemeIntegration } from './features/theme/theme-integration';
import { UVGlspConnector } from './glsp/uv-glsp-connector';
import { UVGlspServer } from './glsp/uv-glsp-server';
import { UVModelServerClient } from './modelserver/uv-modelserver.client';
import { GlspServerConfig, glspServerModule } from './server/glsp-server.launcher';
import { modelServerModule } from './server/modelserver.launcher';
import { serverManagerModule } from './server/server.manager';
import { CommandManager } from './vscode/command/command.manager';
import { DisposableManager } from './vscode/disposable/disposable.manager';
import { UmlDiagramEditorProvider } from './vscode/editor/editor.provider';
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

    container.bind(TYPES.ExtensionContext).toConstantValue(context);

    const coreModule = new ContainerModule(bind => {
        bind(TYPES.GlspServerConfig).toConstantValue(options.glspServerConfig);
        bind(TYPES.ModelServerConfig).toConstantValue(options.modelServerConfig);

        bind(CommandManager).toSelf().inSingletonScope();
        bind(TYPES.CommandManager).toService(CommandManager);
        bind(TYPES.RootInitialization).toService(CommandManager);

        bind(DisposableManager).toSelf().inSingletonScope();
        bind(TYPES.DisposableManager).toService(DisposableManager);
        bind(TYPES.RootInitialization).toService(DisposableManager);

        bind(UVGlspServer).toSelf().inSingletonScope();
        bind(TYPES.GlspServer).toService(UVGlspServer);
        bind(TYPES.Disposable).toService(UVGlspServer);

        bind(UVGlspConnector).toSelf().inSingletonScope();
        bind(TYPES.Connector).toService(UVGlspConnector);
        bind(TYPES.Disposable).toService(UVGlspConnector);

        bind(UVModelServerClient).toSelf().inSingletonScope();
        bind(TYPES.ModelServerClient).toService(UVModelServerClient);
        bind(TYPES.Disposable).toService(UVModelServerClient);
        bind(TYPES.ServerManagerStateListener).toService(UVModelServerClient);

        bind(NewFileCreator).toSelf().inSingletonScope();
        bind(TYPES.Command).to(NewFileCommand);

        bind(UmlDiagramEditorProvider).toSelf().inSingletonScope();
        bind(TYPES.EditorProvider).toService(UmlDiagramEditorProvider);
        bind(TYPES.RootInitialization).toService(UmlDiagramEditorProvider);
        bind(TYPES.ServerManagerStateListener).toService(UmlDiagramEditorProvider);

        bind(OutputChannel).toSelf().inSingletonScope();
        bind(TYPES.OutputChannel).toService(OutputChannel);

        bind(Settings).toSelf().inSingletonScope();
        bind(TYPES.Settings).toService(Settings);
        bind(TYPES.RootInitialization).toService(Settings);

        bind(WorkspaceWatcher).toSelf().inSingletonScope();
        bind(TYPES.RootInitialization).toService(WorkspaceWatcher);

        bind(ThemeIntegration).toSelf().inSingletonScope();
        bind(TYPES.Theme).toService(ThemeIntegration);
        bind(TYPES.Disposable).toService(ThemeIntegration);
        bind(TYPES.RootInitialization).toService(ThemeIntegration);
    });

    container.load(
        coreModule,
        modelServerModule(options.modelServerConfig),
        glspServerModule(options.glspServerConfig),
        serverManagerModule
    );

    return container;
}
