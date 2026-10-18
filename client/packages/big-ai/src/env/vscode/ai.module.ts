/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { bindLifecycle, VscodeFeatureModule } from '@borkdominik-biguml/big-vscode/vscode';
import { AiToolRegistry } from './ai-tool-registry.js';
import { InterviewAgentParticipant } from './interview-agent.participant.js';
import { ModelServerClient } from './model-server-client.js';
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

export function aiModule() {
    return new VscodeFeatureModule(context => {
        context.bind(ModelServerClient).toSelf().inSingletonScope();
        context.bind(DummyTool).toSelf().inSingletonScope();
        context.bind(CompleteInterviewStepTool).toSelf().inSingletonScope();
        context.bind(GenerateClassDiagramTool).toSelf().inSingletonScope();
        context.bind(GenerateActivityDiagramTool).toSelf().inSingletonScope();
        context.bind(GenerateDeploymentDiagramTool).toSelf().inSingletonScope();
        context.bind(ProposeDiagramTool).toSelf().inSingletonScope();
        context.bind(ConfirmGenerationTool).toSelf().inSingletonScope();
        context.bind(CreateUmlFileTool).toSelf().inSingletonScope();
        context.bind(ReadUmlFileTool).toSelf().inSingletonScope();
        context.bind(AddNodeTool).toSelf().inSingletonScope();
        context.bind(AddClassMemberTool).toSelf().inSingletonScope();
        context.bind(RemoveNodeTool).toSelf().inSingletonScope();
        context.bind(AddRelationTool).toSelf().inSingletonScope();
        context.bind(RemoveRelationTool).toSelf().inSingletonScope();

        bindLifecycle(context, InterviewAgentParticipant);
        bindLifecycle(context, AiToolRegistry);
    });
}
