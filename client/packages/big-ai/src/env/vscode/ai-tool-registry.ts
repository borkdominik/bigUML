/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import type { OnActivate, OnDispose } from '@borkdominik-biguml/big-vscode/vscode';
import { inject, injectable } from 'inversify';
import * as vscode from 'vscode';
import { UML_TOOL_NAMES } from '../common/index.js';
import {
    CompleteInterviewStepTool,
    AddClassMemberTool,
    AddNodeTool,
    AddRelationTool,
    ConfirmGenerationTool,
    CreateUmlFileTool,
    DummyTool,
    GenerateActivityDiagramTool,
    GenerateClassDiagramTool,
    ProposeDiagramTool,
    GenerateDeploymentDiagramTool,
    ReadUmlFileTool,
    RemoveNodeTool,
    RemoveRelationTool
} from './tools/index.js';

@injectable()
export class AiToolRegistry implements OnActivate, OnDispose {
    protected readonly toDispose: vscode.Disposable[] = [];

    constructor(
        @inject(DummyTool) protected readonly dummyTool: DummyTool,
        @inject(CompleteInterviewStepTool) protected readonly completeInterviewStepTool: CompleteInterviewStepTool,
        @inject(GenerateClassDiagramTool) protected readonly generateClassDiagramTool: GenerateClassDiagramTool,
        @inject(GenerateActivityDiagramTool) protected readonly generateActivityDiagramTool: GenerateActivityDiagramTool,
        @inject(GenerateDeploymentDiagramTool) protected readonly generateDeploymentDiagramTool: GenerateDeploymentDiagramTool,
        @inject(ProposeDiagramTool) protected readonly proposeDiagramTool: ProposeDiagramTool,
        @inject(ConfirmGenerationTool) protected readonly confirmGenerationTool: ConfirmGenerationTool,
        @inject(CreateUmlFileTool) protected readonly createUmlFileTool: CreateUmlFileTool,
        @inject(ReadUmlFileTool) protected readonly readUmlFileTool: ReadUmlFileTool,
        @inject(AddNodeTool) protected readonly addNodeTool: AddNodeTool,
        @inject(AddClassMemberTool) protected readonly addClassMemberTool: AddClassMemberTool,
        @inject(RemoveNodeTool) protected readonly removeNodeTool: RemoveNodeTool,
        @inject(AddRelationTool) protected readonly addRelationTool: AddRelationTool,
        @inject(RemoveRelationTool) protected readonly removeRelationTool: RemoveRelationTool
    ) {}

    onActivate(): void {
        if (!vscode.lm?.registerTool) {
            return;
        }

        this.toDispose.push(
            vscode.lm.registerTool(UML_TOOL_NAMES.dummy, this.dummyTool),
            vscode.lm.registerTool(UML_TOOL_NAMES.completeInterviewStep, this.completeInterviewStepTool),
            vscode.lm.registerTool(UML_TOOL_NAMES.generateClassDiagram, this.generateClassDiagramTool),
            vscode.lm.registerTool(UML_TOOL_NAMES.generateActivityDiagram, this.generateActivityDiagramTool),
            vscode.lm.registerTool(UML_TOOL_NAMES.proposeDiagram, this.proposeDiagramTool),
            vscode.lm.registerTool(UML_TOOL_NAMES.confirmGeneration, this.confirmGenerationTool),
            vscode.lm.registerTool(UML_TOOL_NAMES.generateDeploymentDiagram, this.generateDeploymentDiagramTool),
            vscode.lm.registerTool(UML_TOOL_NAMES.createUmlFile, this.createUmlFileTool),
            vscode.lm.registerTool(UML_TOOL_NAMES.readUmlFile, this.readUmlFileTool),
            vscode.lm.registerTool(UML_TOOL_NAMES.addNode, this.addNodeTool),
            vscode.lm.registerTool(UML_TOOL_NAMES.addClassMember, this.addClassMemberTool),
            vscode.lm.registerTool(UML_TOOL_NAMES.removeNode, this.removeNodeTool),
            vscode.lm.registerTool(UML_TOOL_NAMES.addRelation, this.addRelationTool),
            vscode.lm.registerTool(UML_TOOL_NAMES.removeRelation, this.removeRelationTool)
        );
    }

    dispose(): void {
        this.toDispose.forEach(disposable => disposable.dispose());
        this.toDispose.length = 0;
    }
}
