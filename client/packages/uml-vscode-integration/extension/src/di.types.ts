/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

export const TYPES = {
    Command: Symbol('Command'),
    CommandManager: Symbol('CommandManager'),
    Connector: Symbol('Connector'),
    Disposable: Symbol('Disposable'),
    DisposableManager: Symbol('DisposableManager'),
    EditorProvider: Symbol('EditorProvider'),
    ExtensionContext: Symbol('ExtensionContext'),
    GlspServer: Symbol('GlspServer'),
    GlspServerConfig: Symbol('GlspServerConfig'),
    GlspServerLauncher: Symbol('GlspServerLauncher'),
    GlspServerLaunchOptions: Symbol('GlspServerLaunchOptions'),
    IDEServer: Symbol('IDEServer'),
    IDESessionClient: Symbol('IDESessionClient'),
    Outline: Symbol('Outline'),
    OutputChannel: Symbol('OutputChannel'),
    // Will be initialized directly
    RootInitialization: Symbol('RootInitialization'),
    Theme: Symbol('Theme'),
    ServerLauncher: Symbol('ServerLauncher'),
    ServerManager: Symbol('ServerManager'),
    ServerManagerStateListener: Symbol('ServerManagerStateListener'),
    Settings: Symbol('Settings')
};
