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

import { Container, ContainerModule } from 'inversify';
import * as vscode from 'vscode';
import { TYPES, VSCODE_TYPES } from './di.types';
import { UmlGlspConnector } from './glsp/connection/uml-glsp-connector';
import { UmlGlspServer } from './glsp/connection/uml-glsp-server';
import { VSCodeModelServerClient } from './modelserver/modelserver.client';
import { CommandManager } from './vscode/command/command.manager';
import { NewDiagramCommand } from './vscode/command/new-diagram.command';
import { DisposableManager } from './vscode/disposable/disposable.manager';
import UmlEditorProvider from './vscode/editor/uml-editor-provider';
import { NewDiagramFileCreator } from './vscode/new-file/new-diagram-file.creator';

export function createContainer(context: vscode.ExtensionContext): Container {
    const vscodeModule = new ContainerModule((bind, unbind, isBound, rebind) => {
        bind(TYPES.GlspServer).to(UmlGlspServer).inSingletonScope();
        bind(TYPES.Connector).to(UmlGlspConnector).inSingletonScope();

        bind(VSCODE_TYPES.CommandManager).to(CommandManager).inSingletonScope();
        bind(VSCODE_TYPES.Command).to(NewDiagramCommand);

        bind(TYPES.ModelServerClient).to(VSCodeModelServerClient).inSingletonScope();

        bind(NewDiagramFileCreator).toSelf().inSingletonScope();

        bind(VSCODE_TYPES.DisposableManager).to(DisposableManager).inSingletonScope();
        bind(VSCODE_TYPES.Disposable).toService(TYPES.GlspServer);
        bind(VSCODE_TYPES.Disposable).toService(TYPES.Connector);

        bind(VSCODE_TYPES.EditorProvider).to(UmlEditorProvider).inSingletonScope();
    });

    const container = new Container({
        skipBaseClassChecks: true
    });

    container.bind(VSCODE_TYPES.ExtensionContext).toConstantValue(context);
    container.load(vscodeModule);

    return container;
}
