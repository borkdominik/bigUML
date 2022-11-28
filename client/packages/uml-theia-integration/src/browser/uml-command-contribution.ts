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
import { MenuContribution, MenuModelRegistry } from "@theia/core";
import { CommonMenus, OpenerService, QuickInputService } from "@theia/core/lib/browser";
import { Command, CommandContribution, CommandRegistry, CommandService } from "@theia/core/lib/common/command";
import URI from "@theia/core/lib/common/uri";
import { FileService } from "@theia/filesystem/lib/browser/file-service";
import { FileNavigatorCommands, NavigatorContextMenu } from "@theia/navigator/lib/browser/navigator-contribution";
import { WorkspaceService } from "@theia/workspace/lib/browser";
import { inject, injectable } from "inversify";

import { UmlDiagramType, UmlModelServerClient } from "../common/uml-model-server-client";

export const NEW_UML_DIAGRAM_COMMAND: Command = {
    id: "file.newUmlDiagram",
    category: "File",
    label: "New UML Diagram",
    iconClass: "umlmodelfile"
};

@injectable()
export class UmlModelContribution
    implements CommandContribution, MenuContribution {
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
                let workspaceUri: URI = new URI();
                if (this.workspaceService.tryGetRoots().length) {
                    workspaceUri =
                        this.workspaceService.tryGetRoots()[0].resource;

                    this.showInput(
                        "Enter Name of UML Diagram",
                        "Diagram name"
                    ).then(nameOfUmlModel => {
                        if (nameOfUmlModel) {
                            this.showInput(
                                "Enter UML Diagram Type",
                                "class | communication"
                            ).then(diagramType => {
                                if (diagramType) {
                                    this.createUmlDiagram(
                                        nameOfUmlModel,
                                        workspaceUri,
                                        diagramType
                                    );
                                }
                            });
                        }
                    });
                }
            }
        });
    }

    protected async showInput(
        prefix: string,
        hint: string,
        inputCheck?: (input: string) => Promise<string | undefined>
    ): Promise<string | undefined> {
        return this.quickInputService.input({
            prompt: prefix,
            placeHolder: hint,
            ignoreFocusLost: true,
            validateInput: async input => {
                if (inputCheck) {
                    return inputCheck(input);
                }
                return !input
                    ? `Please enter a valid string for '${prefix}'`
                    : undefined;
            }
        });
    }

    protected createUmlDiagram(
        diagramName: string,
        workspaceUri: URI,
        diagramType: string
    ): void {
        if (diagramName) {
            this.modelServerClient
                .createUmlResource(
                    diagramName,
                    this.getUmlDiagramType(diagramType)
                )
                .then(() => {
                    this.quickInputService.hide();
                    const modelUri = new URI(
                        workspaceUri.path.toString() +
                        `/${diagramName}/model/${diagramName}.uml`
                    );
                    this.commandService.executeCommand(
                        FileNavigatorCommands.REFRESH_NAVIGATOR.id
                    );
                    this.openerService
                        .getOpener(modelUri)
                        .then(openHandler => {
                            openHandler.open(modelUri);
                            this.commandService.executeCommand(
                                FileNavigatorCommands.REVEAL_IN_NAVIGATOR.id
                            );
                        });
                });
        }
    }

    protected getUmlDiagramType(diagramType: string): UmlDiagramType {
        switch (diagramType.toLowerCase()) {
            case "class":
                return UmlDiagramType.CLASS;
            case "communication":
                return UmlDiagramType.COMMUNICATION;
        }
        /*
            case ("activity"): return UmlDiagramType.ACTIVITY;
            case ("component"): return UmlDiagramType.COMPONENT;
            case ("deployment"): return UmlDiagramType.DEPLOYMENT;
            case ("package"): return UmlDiagramType.PACKAGE;
            case ("sequence"): return UmlDiagramType.SEQUENCE;
            case ("statemachine"): return UmlDiagramType.STATEMACHINE;
            case ("usecase"): return UmlDiagramType.USECASE;
            case ("object"): return UmlDiagramType.OBJECT;
        */
        return UmlDiagramType.NONE;
    }

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(CommonMenus.FILE_NEW, {
            commandId: NEW_UML_DIAGRAM_COMMAND.id,
            label: NEW_UML_DIAGRAM_COMMAND.label,
            icon: NEW_UML_DIAGRAM_COMMAND.iconClass,
            order: "0"
        });

        menus.registerMenuAction(NavigatorContextMenu.NAVIGATION, {
            commandId: NEW_UML_DIAGRAM_COMMAND.id,
            label: NEW_UML_DIAGRAM_COMMAND.label,
            icon: NEW_UML_DIAGRAM_COMMAND.iconClass,
            order: "0"
        });
    }
}
