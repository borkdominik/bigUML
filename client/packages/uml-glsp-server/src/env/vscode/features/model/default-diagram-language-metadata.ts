/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import {
    ActivityDiagramLanguageMetadata,
    ClassDiagramLanguageMetadata,
    CommunicationDiagramLanguageMetadata,
    DeploymentDiagramLanguageMetadata,
    InformationFlowDiagramLanguageMetadata,
    PackageDiagramLanguageMetadata,
    StateMachineDiagramLanguageMetadata,
    UseCaseDiagramLanguageMetadata
} from '@borkdominik-biguml/uml-glsp-server/gen/vscode';
import { inject, injectable } from 'inversify';
import { type DiagramLanguageMetadata } from './diagram-language-metadata.js';
import { DiagramModelState } from './diagram-model-state.js';

/**
 * Default implementation of {@link DiagramLanguageMetadata} that delegates all calls
 * to the concrete metadata for the diagram type currently loaded in the model state.
 */
@injectable()
export class DefaultDiagramLanguageMetadata implements DiagramLanguageMetadata {
    @inject(DiagramModelState)
    protected readonly modelState: DiagramModelState;

    @inject(ActivityDiagramLanguageMetadata)
    protected readonly activityMetadata: ActivityDiagramLanguageMetadata;

    @inject(ClassDiagramLanguageMetadata)
    protected readonly classMetadata: ClassDiagramLanguageMetadata;

    @inject(CommunicationDiagramLanguageMetadata)
    protected readonly communicationMetadata: CommunicationDiagramLanguageMetadata;

    @inject(DeploymentDiagramLanguageMetadata)
    protected readonly deploymentMetadata: DeploymentDiagramLanguageMetadata;

    @inject(InformationFlowDiagramLanguageMetadata)
    protected readonly informationFlowMetadata: InformationFlowDiagramLanguageMetadata;

    @inject(PackageDiagramLanguageMetadata)
    protected readonly packageMetadata: PackageDiagramLanguageMetadata;

    @inject(StateMachineDiagramLanguageMetadata)
    protected readonly stateMachineMetadata: StateMachineDiagramLanguageMetadata;

    @inject(UseCaseDiagramLanguageMetadata)
    protected readonly useCaseMetadata: UseCaseDiagramLanguageMetadata;

    protected get current(): DiagramLanguageMetadata | undefined {
        switch (this.modelState.diagramType) {
            case 'ACTIVITY':
                return this.activityMetadata;
            case 'CLASS':
                return this.classMetadata;
            case 'COMMUNICATION':
                return this.communicationMetadata;
            case 'DEPLOYMENT':
                return this.deploymentMetadata;
            case 'INFORMATION_FLOW':
                return this.informationFlowMetadata;
            case 'PACKAGE':
                return this.packageMetadata;
            case 'STATE_MACHINE':
                return this.stateMachineMetadata;
            case 'USE_CASE':
                return this.useCaseMetadata;
            default:
                return undefined;
        }
    }

    get nodeTypeIds(): string[] {
        return this.current?.nodeTypeIds ?? [];
    }

    get edgeTypeIds(): string[] {
        return this.current?.edgeTypeIds ?? [];
    }

    convertToAst(elementTypeId: string): string {
        if (!this.current) {
            throw new Error('No diagram type loaded, cannot convert element type id to AST type');
        }

        return this.current.convertToAst(elementTypeId);
    }

    convertToElementType(astType: string): string {
        if (!this.current) {
            throw new Error('No diagram type loaded, cannot convert AST type to element type id');
        }

        return this.current.convertToElementType(astType);
    }
}
