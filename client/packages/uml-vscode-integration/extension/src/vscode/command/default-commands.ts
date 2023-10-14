/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { CenterAction, FitToScreenAction, RequestExportSvgAction, SelectAllAction } from '@eclipse-glsp/protocol';
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
        }),
        vscode.commands.registerCommand(`${diagramPrefix}.show.umlPanel`, () => {
            vscode.commands.executeCommand('bigUML.panel.property-palette.focus');
        }),
        vscode.commands.registerCommand(`${diagramPrefix}.exportAsSVG`, () => {
            connector.sendActionToActiveClient(RequestExportSvgAction.create());
        })
        /*
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
