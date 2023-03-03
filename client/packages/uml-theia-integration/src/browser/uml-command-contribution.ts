/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
import { UmlDiagramType } from '@eclipsesource/uml-common';
import { MenuContribution, MenuModelRegistry } from '@theia/core';
import { CommonMenus, OpenerService, QuickInputService } from '@theia/core/lib/browser';
import { Command, CommandContribution, CommandRegistry, CommandService } from '@theia/core/lib/common/command';
import { URI as TheiaURI } from '@theia/core/lib/common/uri';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { FileNavigatorCommands, NavigatorContextMenu } from '@theia/navigator/lib/browser/navigator-contribution';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { inject, injectable } from 'inversify';
import URI from 'urijs';

import { UmlLanguageTheiaEnvironment } from '../common/uml-language';
import { UmlModelServerClient } from '../common/uml-modelserver.client';

export const NEW_UML_DIAGRAM_COMMAND: Command = {
    id: 'file.newUmlDiagram',
    category: 'File',
    label: 'New UML Diagram',
    iconClass: 'umlmodelfile'
};

@injectable()
export class UmlModelContribution implements CommandContribution, MenuContribution {
    @inject(FileService) protected readonly fileService: FileService;
    @inject(CommandService) protected readonly commandService: CommandService;
    @inject(OpenerService) protected readonly openerService: OpenerService;
    @inject(QuickInputService)
    protected readonly quickInputService: QuickInputService;
    @inject(WorkspaceService)
    protected readonly workspaceService: WorkspaceService;
    @inject(UmlModelServerClient)
    protected readonly modelServerClient: UmlModelServerClient;

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(NEW_UML_DIAGRAM_COMMAND, {
            execute: async () => {
                if (this.workspaceService.tryGetRoots().length) {
                    const workspaceUri = this.workspaceService.tryGetRoots()[0].resource;

                    const diagramName = await this.showInput('Diagram name', 'Enter name of UML diagram', async input =>
                        input ? undefined : 'Diagram name can not be empty'
                    );

                    if (diagramName !== undefined) {
                        const diagramType = await this.showInput(
                            UmlLanguageTheiaEnvironment.supportedTypes.map(t => t.toLowerCase()).join(' | '),
                            'Enter UML diagram type',
                            async input =>
                                UmlLanguageTheiaEnvironment.supportedTypes.includes(UmlDiagramType.parseString(input))
                                    ? undefined
                                    : `${input} is not a valid value`
                        );

                        if (diagramType !== undefined) {
                            this.createUmlDiagram(diagramName, workspaceUri.path.toString(), diagramType);
                        }
                    }
                }
            }
        });
    }

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(CommonMenus.FILE_NEW, {
            commandId: NEW_UML_DIAGRAM_COMMAND.id,
            label: NEW_UML_DIAGRAM_COMMAND.label,
            icon: NEW_UML_DIAGRAM_COMMAND.iconClass,
            order: '0'
        });

        menus.registerMenuAction(NavigatorContextMenu.NAVIGATION, {
            commandId: NEW_UML_DIAGRAM_COMMAND.id,
            label: NEW_UML_DIAGRAM_COMMAND.label,
            icon: NEW_UML_DIAGRAM_COMMAND.iconClass,
            order: '0'
        });
    }

    protected async showInput(
        placeHolder: string,
        hint: string,
        inputCheck?: (input: string) => Promise<string | undefined>
    ): Promise<string | undefined> {
        return this.quickInputService.input({
            prompt: hint,
            placeHolder: placeHolder,
            validateInput: async input => {
                if (inputCheck) {
                    return inputCheck(input);
                }
                return !input ? 'Please enter a valid string' : undefined;
            }
        });
    }

    protected createUmlDiagram(diagramName: string, workspaceUri: string, diagramType: string): void {
        const uri = workspaceUri + `/${diagramName}/model/${diagramName}.uml`;
        const theiaUri = new TheiaURI(uri);
        const uriJs = new URI(uri);

        this.modelServerClient
            .create(
                uriJs,
                {
                    data: {
                        $type: 'com.eclipsesource.uml.modelserver.model.impl.NewDiagramRequestImpl',
                        diagramType
                    }
                },
                undefined as any,
                'raw-json'
            )
            .then(async () => {
                this.quickInputService.hide();
                this.commandService.executeCommand(FileNavigatorCommands.REFRESH_NAVIGATOR.id);
                const openHandler = await this.openerService.getOpener(theiaUri);
                openHandler.open(theiaUri);
                this.commandService.executeCommand(FileNavigatorCommands.REVEAL_IN_NAVIGATOR.id);
            });
    }
}
