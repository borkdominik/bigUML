/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

// TODO: Add proper support for action handlers in VS Code
const WORKAROUND_TYPES = {
    IActionDispatcher: Symbol('IActionDispatcher'),
    IActionDispatcherProvider: Symbol('IActionDispatcherProvider'),
    ActionHandlerRegistryProvider: Symbol('ActionHandlerRegistryProvider'),
    ActionHandlerRegistration: Symbol('ActionHandlerRegistration')
};

export const TYPES = {
    ...WORKAROUND_TYPES,
    Command: Symbol('Command'),
    CommandManager: Symbol('CommandManager'),
    Connector: Symbol('Connector'),
    Disposable: Symbol('Disposable'),
    DisposableManager: Symbol('DisposableManager'),
    EditorProvider: Symbol('EditorProvider'),
    ExtensionContext: Symbol('ExtensionContext'),
    LanguageClient: Symbol('LanguageClient'),
    LanguageClientConfig: Symbol('LanguageClientConfig'),
    LanguageClientLauncher: Symbol('LanguageClientLauncher'),
    LanguageClientLaunchOptions: Symbol('LanguageClientLaunchOptions'),
    GlspServer: Symbol('GlspServer'),
    GlspServerConfig: Symbol('GlspServerConfig'),
    GlspServerLauncher: Symbol('GlspServerLauncher'),
    GlspServerLaunchOptions: Symbol('GlspServerLaunchOptions'),
    Outline: Symbol('Outline'),
    OutputChannel: Symbol('OutputChannel'),
    RootInitialization: Symbol('RootInitialization'),
    Theme: Symbol('Theme'),
    ServerLauncher: Symbol('ServerLauncher'),
    ServerManager: Symbol('ServerManager'),
    ServerManagerStateListener: Symbol('ServerManagerStateListener'),
    Settings: Symbol('Settings')
};
