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

export const TYPES = {
    Connector: Symbol('Connector'),
    GlspServer: Symbol('GlspServer'),
    GlspServerConfig: Symbol('GlspServerConfig'),
    GlspServerLauncher: Symbol('GlspServerLauncher'),
    GlspServerLaunchOptions: Symbol('GlspServerLaunchOptions'),
    ModelServerClient: Symbol('ModelServerClient'),
    ModelServerConfig: Symbol('ModelServerConfig'),
    ModelServerLauncher: Symbol('ModelServerLauncher'),
    ModelServerLaunchOptions: Symbol('ModelServerLaunchOptions'),
    ServerLauncher: Symbol('ServerLauncher'),
    ServerManager: Symbol('ServerManager'),
    ServerManagerStateListener: Symbol('ServerManagerStateListener')
};

export const VSCODE_TYPES = {
    Command: Symbol('Command'),
    CommandManager: Symbol('CommandManager'),
    Disposable: Symbol('Disposable'),
    DisposableManager: Symbol('DisposableManager'),
    EditorProvider: Symbol('EditorProvider'),
    ExtensionContext: Symbol('ExtensionContext'),
    OutputChannel: Symbol('OutputChannel'),
    Settings: Symbol('Settings'),
    RootInitialization: Symbol('RootInitialization')
};

export const FEATURE_TYPES = {
    Theme: Symbol('Theme')
};
