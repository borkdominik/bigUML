/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { type Args, type MaybePromise, type PaletteItem, ToolPaletteItemProvider } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import {
    ActivityDiagramToolPaletteItemProvider,
    ClassDiagramToolPaletteItemProvider,
    CommunicationDiagramToolPaletteItemProvider,
    DeploymentDiagramToolPaletteItemProvider,
    InformationFlowDiagramToolPaletteItemProvider,
    PackageDiagramToolPaletteItemProvider,
    StateMachineDiagramToolPaletteItemProvider,
    UseCaseDiagramToolPaletteItemProvider
} from '../../../../gen/vscode/index.js';
import { DiagramModelState } from '../../features/index.js';

@injectable()
export class UmlDiagramToolPaletteItemProvider extends ToolPaletteItemProvider {
    @inject(DiagramModelState)
    protected readonly modelState: DiagramModelState;

    @inject(ActivityDiagramToolPaletteItemProvider)
    protected readonly activityDiagramToolPaletteItemProvider: ActivityDiagramToolPaletteItemProvider;

    @inject(ClassDiagramToolPaletteItemProvider)
    protected readonly classDiagramToolPaletteItemProvider: ClassDiagramToolPaletteItemProvider;

    @inject(CommunicationDiagramToolPaletteItemProvider)
    protected readonly communicationDiagramToolPaletteItemProvider: CommunicationDiagramToolPaletteItemProvider;

    @inject(DeploymentDiagramToolPaletteItemProvider)
    protected readonly deploymentDiagramToolPaletteItemProvider: DeploymentDiagramToolPaletteItemProvider;

    @inject(InformationFlowDiagramToolPaletteItemProvider)
    protected readonly informationFlowDiagramToolPaletteItemProvider: InformationFlowDiagramToolPaletteItemProvider;

    @inject(PackageDiagramToolPaletteItemProvider)
    protected readonly packageDiagramToolPaletteItemProvider: PackageDiagramToolPaletteItemProvider;

    @inject(StateMachineDiagramToolPaletteItemProvider)
    protected readonly stateMachineDiagramToolPaletteItemProvider: StateMachineDiagramToolPaletteItemProvider;

    @inject(UseCaseDiagramToolPaletteItemProvider)
    protected readonly useCaseDiagramToolPaletteItemProvider: UseCaseDiagramToolPaletteItemProvider;

    override getItems(args?: Args): MaybePromise<PaletteItem[]> {
        const diagramType = this.modelState.diagramType;

        switch (diagramType) {
            case 'ACTIVITY':
                return this.activityDiagramToolPaletteItemProvider.getItems(args);
            case 'CLASS':
                return this.classDiagramToolPaletteItemProvider.getItems(args);
            case 'COMMUNICATION':
                return this.communicationDiagramToolPaletteItemProvider.getItems(args);
            case 'DEPLOYMENT':
                return this.deploymentDiagramToolPaletteItemProvider.getItems(args);
            case 'INFORMATION_FLOW':
                return this.informationFlowDiagramToolPaletteItemProvider.getItems(args);
            case 'PACKAGE':
                return this.packageDiagramToolPaletteItemProvider.getItems(args);
            case 'STATE_MACHINE':
                return this.stateMachineDiagramToolPaletteItemProvider.getItems(args);
            case 'USE_CASE':
                return this.useCaseDiagramToolPaletteItemProvider.getItems(args);
            default:
                return [];
        }
    }
}
