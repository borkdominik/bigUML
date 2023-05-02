/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
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

import { CenterAction, FitToScreenAction, SelectAllAction } from '@eclipse-glsp/protocol';
import * as vscode from 'vscode';
import { UVGlspConnector } from '../../glsp/uv-glsp-connector';

export interface CommandContext {
    extensionContext: vscode.ExtensionContext;
    diagramPrefix: string;
    connector: UVGlspConnector;
}
export function configureDefaultCommands(context: CommandContext): void {
    // keep track of diagram specific element selection.
    const { extensionContext, diagramPrefix, connector } = context;

    let selectedElements: string[] = [];

    extensionContext.subscriptions.push(connector.onSelectionUpdate(_selectedElements => (selectedElements = _selectedElements)));

    extensionContext.subscriptions.push(
        vscode.commands.registerCommand(`${diagramPrefix}.fit`, () => {
            connector.sendActionToActiveClient(FitToScreenAction.create(selectedElements));
        }),
        vscode.commands.registerCommand(`${diagramPrefix}.center`, () => {
            connector.sendActionToActiveClient(CenterAction.create(selectedElements));
        }),
        vscode.commands.registerCommand(`${diagramPrefix}.selectAll`, () => {
            connector.sendActionToActiveClient(SelectAllAction.create());
        })
        /*
        vscode.commands.registerCommand(`${diagramPrefix}.exportAsSVG`, () => {
            connector.sendActionToActiveClient(RequestExportSvgAction.create());
        }),
        vscode.commands.registerCommand(`${diagramPrefix}.layout`, () => {
            connector.sendActionToActiveClient(LayoutOperation.create([]));
        })
        */
    );

    extensionContext.subscriptions.push(
        connector.onSelectionUpdate(n => {
            selectedElements = n;
            vscode.commands.executeCommand('setContext', `${diagramPrefix}.editorSelectedElementsAmount`, n.length);
        })
    );
}
