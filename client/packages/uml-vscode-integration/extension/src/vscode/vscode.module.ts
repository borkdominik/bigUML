/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { ContainerModule } from 'inversify';
import { TYPES } from '../di.types';
import { CommandManager } from './command/command.manager';
import { DisposableManager } from './disposable/disposable.manager';
import { UMLDiagramEditorProvider } from './editor/editor.provider';
import { NewFileCommand } from './new-file/new-file.command';
import { NewFileCreator } from './new-file/new-file.creator';
import { OutputChannel } from './output/output.channel';
import { Settings } from './settings/settings';
import { UMLWebviewExtensionHostConnection, UMLWebviewViewConnection } from './webview/webview-connection';
import { WorkspaceWatcher } from './workspace/workspace.watcher';

export const vscodeModule = new ContainerModule(bind => {
    bind(CommandManager).toSelf().inSingletonScope();
    bind(TYPES.CommandManager).toService(CommandManager);
    bind(TYPES.RootInitialization).toService(CommandManager);

    bind(DisposableManager).toSelf().inSingletonScope();
    bind(TYPES.DisposableManager).toService(DisposableManager);
    bind(TYPES.RootInitialization).toService(DisposableManager);

    bind(NewFileCreator).toSelf().inSingletonScope();
    bind(TYPES.Command).to(NewFileCommand);

    bind(UMLDiagramEditorProvider).toSelf().inSingletonScope();
    bind(TYPES.EditorProvider).toService(UMLDiagramEditorProvider);
    bind(TYPES.RootInitialization).toService(UMLDiagramEditorProvider);
    bind(TYPES.ServerManagerStateListener).toService(UMLDiagramEditorProvider);

    bind(OutputChannel).toSelf().inSingletonScope();
    bind(TYPES.OutputChannel).toService(OutputChannel);

    bind(Settings).toSelf().inSingletonScope();
    bind(TYPES.Settings).toService(Settings);
    bind(TYPES.RootInitialization).toService(Settings);

    bind(WorkspaceWatcher).toSelf().inSingletonScope();
    bind(TYPES.RootInitialization).toService(WorkspaceWatcher);

    bind(UMLWebviewExtensionHostConnection).toSelf();
    bind(UMLWebviewViewConnection).toSelf();
});
