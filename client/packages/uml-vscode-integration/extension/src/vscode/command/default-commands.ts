/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
// TODO: Problematic
import { EnableToolsAction, FocusDomAction } from '@borkdominik-biguml/uml-glsp';
import { CenterAction, FitToScreenAction, RequestExportSvgAction, SelectAllAction } from '@eclipse-glsp/protocol';
import { SetUIExtensionVisibilityAction } from '@eclipse-glsp/sprotty/node_modules/sprotty/src/base/ui-extensions/ui-extension-registry.js';
import * as vscode from 'vscode';
import { type UMLGLSPConnector } from '../../glsp/uml-glsp-connector.js';

export interface CommandContext {
    extensionContext: vscode.ExtensionContext;
    diagramPrefix: string;
    connector: UMLGLSPConnector;
}
export function configureDefaultCommands(context: CommandContext): void {
    // keep track of diagram specific element selection.
    const { extensionContext, diagramPrefix, connector } = context;

    let selectedElements: string[] = [];

    extensionContext.subscriptions.push(
        connector.onSelectionUpdate(_selectedElements => (selectedElements = _selectedElements.selectedElementsIDs))
    );

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
        }),
        vscode.commands.registerCommand(`${diagramPrefix}.editor.activateResizeMode`, () => {
            connector.sendActionToActiveClient(EnableToolsAction.create(['glsp.resize-tool']));
        }),
        vscode.commands.registerCommand(`${diagramPrefix}.editor.showSearch`, () => {
            connector.sendActionToActiveClient(
                SetUIExtensionVisibilityAction.create({
                    extensionId: 'search-autocomplete-palette',
                    visible: true
                })
            );
        }),
        vscode.commands.registerCommand(`${diagramPrefix}.editor.focusToolPalette`, () => {
            connector.sendActionToActiveClient(FocusDomAction.create('tool-palette'));
        }),
        vscode.commands.registerCommand(`${diagramPrefix}.editor.focusDiagram`, () => {
            connector.sendActionToActiveClient(FocusDomAction.create('graph'));
        }),
        vscode.commands.registerCommand(`${diagramPrefix}.editor.enablePrimaryElementNavigator`, () => {
            connector.sendActionToActiveClient(EnableToolsAction.create(['uml.primary-element-navigator-tool']));
        }),
        vscode.commands.registerCommand(`${diagramPrefix}.editor.enableSecondaryElementNavigator`, () => {
            connector.sendActionToActiveClient(EnableToolsAction.create(['uml.secondary-element-navigator-tool']));
        })
        /*
        vscode.commands.registerCommand(`${diagramPrefix}.layout`, () => {
            connector.sendActionToActiveClient(LayoutOperation.create([]));
        })
        */
    );

    extensionContext.subscriptions.push(
        connector.onSelectionUpdate(n => {
            selectedElements = n.selectedElementsIDs;
            vscode.commands.executeCommand('setContext', `${diagramPrefix}.editorSelectedElementsAmount`, selectedElements.length);
        })
    );
}
