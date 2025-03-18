/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

export const TYPES = {
    ActionDispatcher: Symbol('ActionDispatcher'),
    ActionListener: Symbol('ActionListener'),
    Command: Symbol('Command'),
    CommandManager: Symbol('CommandManager'),
    Disposable: Symbol('Disposable'),
    DisposableManager: Symbol('DisposableManager'),
    EditorProvider: Symbol('EditorProvider'),
    ExtensionContext: Symbol('ExtensionContext'),
    Outline: Symbol('Outline'),
    OutputChannel: Symbol('OutputChannel'),
    RootInitialization: Symbol('RootInitialization'),
    Theme: Symbol('Theme'),
    Settings: Symbol('Settings'),

    // GLSP
    GLSPDiagramSettings: Symbol('GLSPDiagramSettings'),
    GLSPVSCodeConnector: Symbol('GLSPVSCodeConnector'),
    ConnectionManager: Symbol('ConnectionManager'),
    SelectionService: Symbol('SelectionService'),
    WebviewViewConnector: Symbol('WebviewViewConnector'),

    // GLSP Server
    GLSPServer: Symbol('GLSPServer'),
    GLSPServerConfig: Symbol('GLSPServerConfig'),
    GLSPServerLauncher: Symbol('GLSPServerLauncher'),
    GLSPServerLaunchOptions: Symbol('GLSPServerLaunchOptions'),
    IDEServer: Symbol('IDEServer'),
    IDESessionClient: Symbol('IDESessionClient'),

    // Server
    ServerLauncher: Symbol('ServerLauncher'),
    ServerManager: Symbol('ServerManager'),
    ServerManagerStateListener: Symbol('ServerManagerStateListener')
};

export const EXPERIMENTAL_TYPES = {
    GLSPServerModelState: Symbol('GLSPServerModelState')
};
