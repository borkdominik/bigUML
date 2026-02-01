/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { TYPES, type BIGGLSPVSCodeConnector, type GLSPDiagramSettings } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { EnableToolsAction, FocusDomAction } from '@borkdominik-biguml/uml-protocol';
import { CenterAction, FitToScreenAction, RequestExportSvgAction, SelectAllAction } from '@eclipse-glsp/protocol';
import { inject, injectable, postConstruct } from 'inversify';
import { SetUIExtensionVisibilityAction } from 'sprotty/lib/base/ui-extensions/ui-extension-registry.js';
import * as vscode from 'vscode';

@injectable()
export class DefaultCommandsProvider {
    constructor(
        @inject(TYPES.ExtensionContext) protected readonly extensionContext: vscode.ExtensionContext,
        @inject(TYPES.GLSPDiagramSettings) protected readonly diagramSettings: GLSPDiagramSettings,
        @inject(TYPES.GLSPVSCodeConnector) protected readonly connector: BIGGLSPVSCodeConnector
    ) {}

    @postConstruct()
    protected init(): void {
        let selectedElements: string[] = [];

        this.extensionContext.subscriptions.push(
            this.connector.onSelectionUpdate(_selectedElements => (selectedElements = _selectedElements.selectedElementsIDs))
        );

        this.extensionContext.subscriptions.push(
            vscode.commands.registerCommand(`${this.diagramSettings.name}.fit`, () => {
                this.connector.sendActionToActiveClient(FitToScreenAction.create(selectedElements));
            }),
            vscode.commands.registerCommand(`${this.diagramSettings.name}.center`, () => {
                this.connector.sendActionToActiveClient(CenterAction.create(selectedElements));
            }),
            vscode.commands.registerCommand(`${this.diagramSettings.name}.selectAll`, () => {
                this.connector.sendActionToActiveClient(SelectAllAction.create());
            }),
            vscode.commands.registerCommand(`${this.diagramSettings.name}.show.umlPanel`, () => {
                vscode.commands.executeCommand('bigUML.panel.property-palette.focus');
            }),
            vscode.commands.registerCommand(`${this.diagramSettings.name}.exportAsSVG`, () => {
                this.connector.sendActionToActiveClient(RequestExportSvgAction.create());
            }),
            vscode.commands.registerCommand(`${this.diagramSettings.name}.editor.activateResizeMode`, () => {
                this.connector.sendActionToActiveClient(EnableToolsAction.create(['glsp.resize-tool']));
            }),
            vscode.commands.registerCommand(`${this.diagramSettings.name}.editor.showSearch`, () => {
                this.connector.sendActionToActiveClient(
                    SetUIExtensionVisibilityAction.create({
                        extensionId: 'search-autocomplete-palette',
                        visible: true
                    })
                );
            }),
            vscode.commands.registerCommand(`${this.diagramSettings.name}.editor.focusToolPalette`, () => {
                this.connector.sendActionToActiveClient(FocusDomAction.create('tool-palette'));
            }),
            vscode.commands.registerCommand(`${this.diagramSettings.name}.editor.focusDiagram`, () => {
                this.connector.sendActionToActiveClient(FocusDomAction.create('graph'));
            }),
            vscode.commands.registerCommand(`${this.diagramSettings.name}.editor.enablePrimaryElementNavigator`, () => {
                this.connector.sendActionToActiveClient(EnableToolsAction.create(['uml.primary-element-navigator-tool']));
            }),
            vscode.commands.registerCommand(`${this.diagramSettings.name}.editor.enableSecondaryElementNavigator`, () => {
                this.connector.sendActionToActiveClient(EnableToolsAction.create(['uml.secondary-element-navigator-tool']));
            })
            /*
        vscode.commands.registerCommand(`${this.diagramSettings.name}.layout`, () => {
            this.connector.sendActionToActiveClient(LayoutOperation.create([]));
        })
        */
        );

        this.extensionContext.subscriptions.push(
            this.connector.onSelectionUpdate(n => {
                selectedElements = n.selectedElementsIDs;
                vscode.commands.executeCommand(
                    'setContext',
                    `${this.diagramSettings.name}.editorSelectedElementsAmount`,
                    selectedElements.length
                );
            })
        );
    }
}
