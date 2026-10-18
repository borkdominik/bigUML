/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

export interface DummyToolInput {
    message: string;
}

export interface CompleteInterviewStepInput {
    stepNumber: number;
    summary?: string;
}

export type CommandType = 'interview' | 'modify' | 'explain' | 'plan' | 'default';

export interface ParsedCommand {
    type: CommandType;
    argument: string;
}

export type InterviewPhase = 'scope' | 'entities' | 'relationships' | 'details' | 'confirmation' | 'generation';

export type DiagramType = 'CLASS' | 'DEPLOYMENT' | 'ACTIVITY';

export interface InterviewRelationship {
    source: string;
    target: string;
    type?: string;
    multiplicity?: string;
}

export interface InterviewState {
    phase: InterviewPhase;
    filePath?: string;
    diagramType: DiagramType;
    scope?: string;
    entities: string[];
    relationships: InterviewRelationship[];
    details: string[];
    awaitingConfirmation: boolean;
    pendingProposal?: ProposeDiagramInput;
}

export type UmlNodeType = 'Class' | 'AbstractClass' | 'Interface' | 'Enumeration' | 'Package' | 'DataType' | 'PrimitiveType';

export type DeploymentNodeType =
    | 'Artifact'
    | 'Device'
    | 'ExecutionEnvironment'
    | 'DeploymentNode'
    | 'DeploymentSpecification'
    | 'DeploymentPackage'
    | 'DeploymentModel';

export type ActivityNodeType =
    | 'Activity'
    | 'ActivityPartition'
    | 'OpaqueAction'
    | 'AcceptEventAction'
    | 'SendSignalAction'
    | 'InitialNode'
    | 'DecisionNode'
    | 'MergeNode'
    | 'JoinNode'
    | 'ForkNode'
    | 'ActivityFinalNode'
    | 'FlowFinalNode'
    | 'CentralBufferNode'
    | 'ActivityParameterNode'
    | 'InputPin'
    | 'OutputPin';

export type UmlRelationType =
    | 'Association'
    | 'Aggregation'
    | 'Composition'
    | 'Abstraction'
    | 'Dependency'
    | 'Generalization'
    | 'InterfaceRealization'
    | 'PackageImport'
    | 'PackageMerge'
    | 'Realization'
    | 'Substitution'
    | 'Usage';

export type DeploymentRelationType = 'CommunicationPath' | 'Deployment' | 'Dependency' | 'Generalization' | 'Manifestation';

export type ActivityRelationType = 'ControlFlow';

export interface CreateUmlFileInput {
    filePath: string;
    diagramType: DiagramType;
}

export interface GenerateClassDiagramEntityInput {
    name: string;
    elementType: UmlNodeType;
    properties?: Array<{
        name: string;
        typeName?: string;
        multiplicity?: string;
        visibility?: UmlVisibility;
    }>;
    operations?: Array<{
        name: string;
        visibility?: UmlVisibility;
    }>;
}

export interface GenerateClassDiagramRelationshipInput {
    relationType: UmlRelationType;
    sourceName: string;
    targetName: string;
    name?: string;
    sourceMultiplicity?: string;
    targetMultiplicity?: string;
}

export interface GenerateClassDiagramInput {
    filePath: string;
    diagramType: 'CLASS';
    entities: GenerateClassDiagramEntityInput[];
    relationships?: GenerateClassDiagramRelationshipInput[];
}

export interface GenerateDeploymentDiagramEntityInput {
    name: string;
    elementType: DeploymentNodeType;
}

export interface GenerateDeploymentDiagramRelationshipInput {
    relationType: DeploymentRelationType;
    sourceName: string;
    targetName: string;
}

export interface GenerateDeploymentDiagramInput {
    filePath: string;
    diagramType: 'DEPLOYMENT';
    entities: GenerateDeploymentDiagramEntityInput[];
    relationships?: GenerateDeploymentDiagramRelationshipInput[];
}

export interface GenerateActivityDiagramEntityInput {
    name: string;
    elementType: ActivityNodeType;
}

export interface GenerateActivityDiagramRelationshipInput {
    relationType: ActivityRelationType;
    sourceName: string;
    targetName: string;
    name?: string;
    guard?: string;
    weight?: number;
}

export interface GenerateActivityDiagramInput {
    filePath: string;
    diagramType: 'ACTIVITY';
    entities: GenerateActivityDiagramEntityInput[];
    relationships?: GenerateActivityDiagramRelationshipInput[];
}

export type ProposeDiagramInput = GenerateClassDiagramInput | GenerateDeploymentDiagramInput | GenerateActivityDiagramInput;

export type ConfirmGenerationInput = Record<string, never>;

export interface ReadUmlFileInput {
    filePath: string;
}

export interface AddNodeInput {
    filePath: string;
    elementType: UmlNodeType;
    name: string;
    properties?: Record<string, unknown>;
}

export type UmlClassMemberKind = 'Property' | 'Operation';
export type UmlVisibility = 'PUBLIC' | 'PRIVATE' | 'PROTECTED' | 'PACKAGE';

export interface AddClassMemberInput {
    filePath: string;
    ownerName: string;
    memberKind: UmlClassMemberKind;
    name: string;
    typeName?: string;
    multiplicity?: string;
    visibility?: UmlVisibility;
}

export interface RemoveNodeInput {
    filePath: string;
    elementName: string;
}

export interface AddRelationInput {
    filePath: string;
    relationType: UmlRelationType;
    sourceName: string;
    targetName: string;
    name?: string;
    sourceMultiplicity?: string;
    targetMultiplicity?: string;
}

export interface RemoveRelationInput {
    filePath: string;
    sourceName: string;
    targetName: string;
    relationType?: UmlRelationType;
}
