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
    DisposableManager: Symbol('DisposableManager'),
    ExtensionContext: Symbol('ExtensionContext'),
    Outline: Symbol('Outline'),
    OutputChannel: Symbol('OutputChannel'),
    OnActivate: Symbol('OnActivate'),
    OnDispose: Symbol('OnDispose'),
    Theme: Symbol('Theme'),
    Settings: Symbol('Settings'),

    // GLSP
    GlspDiagramSettings: Symbol('GlspDiagramSettings'),
    GlspVSCodeConnector: Symbol('GlspVSCodeConnector'),
    GlspModelState: Symbol('GlspModelState'),
    ConnectionManager: Symbol('ConnectionManager'),
    SelectionService: Symbol('SelectionService'),

    // GLSP Server
    GlspServer: Symbol('GlspServer'),
    GlspServerConfig: Symbol('GlspServerConfig'),
    IdeServer: Symbol('IdeServer'),
    IdeSessionClient: Symbol('IdeSessionClient'),

    // Server
    ServerLauncher: Symbol('ServerLauncher'),
    ServerManager: Symbol('ServerManager'),
    ServerManagerStateListener: Symbol('ServerManagerStateListener'),

    // Webview
    WebviewMessenger: Symbol('WebviewMessenger'),
    ActionWebviewMessenger: Symbol('ActionWebviewMessenger'),

    // Webview Editor
    WebviewEditorOptions: Symbol('WebviewEditorOptions'),
    WebviewEditorFactory: Symbol('WebviewEditorProvider'),
    WebviewEditorManager: Symbol('WebviewEditorManager'),

    // Webview View
    WebviewViewOptions: Symbol('WebviewViewOptions'),
    WebviewViewFactory: Symbol('WebviewViewFactory'),
    WebviewViewManager: Symbol('WebviewViewManager')
};
