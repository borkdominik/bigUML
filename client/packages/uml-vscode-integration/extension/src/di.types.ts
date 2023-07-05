/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { TYPES as GLSP_TYPES } from '@eclipse-glsp/client';

// TODO: Add proper support for action handlers in VS Code
const WORKAROUND_TYPES = {
    IActionDispatcher: GLSP_TYPES.IActionDispatcher,
    IActionDispatcherProvider: GLSP_TYPES.IActionDispatcherProvider,
    ActionHandlerRegistryProvider: GLSP_TYPES.ActionHandlerRegistryProvider,
    ActionHandlerRegistration: GLSP_TYPES.ActionHandlerRegistration
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
    GlspServer: Symbol('GlspServer'),
    GlspServerConfig: Symbol('GlspServerConfig'),
    GlspServerLauncher: Symbol('GlspServerLauncher'),
    GlspServerLaunchOptions: Symbol('GlspServerLaunchOptions'),
    ModelServerClient: Symbol('ModelServerClient'),
    ModelServerConfig: Symbol('ModelServerConfig'),
    ModelServerLauncher: Symbol('ModelServerLauncher'),
    ModelServerLaunchOptions: Symbol('ModelServerLaunchOptions'),
    Outline: Symbol('Outline'),
    OutputChannel: Symbol('OutputChannel'),
    RootInitialization: Symbol('RootInitialization'),
    Theme: Symbol('Theme'),
    ServerLauncher: Symbol('ServerLauncher'),
    ServerManager: Symbol('ServerManager'),
    ServerManagerStateListener: Symbol('ServerManagerStateListener'),
    Settings: Symbol('Settings')
};
