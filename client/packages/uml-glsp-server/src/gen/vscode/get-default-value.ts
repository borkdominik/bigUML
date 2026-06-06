// AUTO-GENERATED – DO NOT EDIT
/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

// @ts-nocheck

interface DefaultMappingEntry {
    property: string;
    propertyType: string;
    defaultValue?: any;
}

const defaultMapping: Record<string, DefaultMappingEntry[]> = {
    Diagram: [
        {
            property: 'diagram',
            propertyType: 'DiagramType'
        }
    ],
    UseCaseDiagram: [
        {
            property: 'diagramType',
            propertyType: '"USE_CASE"'
        },
        {
            property: 'entities',
            propertyType: 'UseCaseDiagramNodes'
        },
        {
            property: 'relations',
            propertyType: 'UseCaseDiagramEdges'
        }
    ],
    UseCase: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        }
    ],
    Element: [],
    ElementWithSizeAndPosition: [],
    Node: [],
    Edge: [],
    Unbounded: [],
    MetaInfo: [],
    Size: [
        {
            property: 'height',
            propertyType: 'number'
        },
        {
            property: 'width',
            propertyType: 'number'
        },
        {
            property: 'element',
            propertyType: 'ElementWithSizeAndPosition'
        }
    ],
    Position: [
        {
            property: 'x',
            propertyType: 'number'
        },
        {
            property: 'y',
            propertyType: 'number'
        },
        {
            property: 'element',
            propertyType: 'ElementWithSizeAndPosition'
        }
    ],
    Subject: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'useCases',
            propertyType: 'UseCase'
        }
    ],
    Include: [
        {
            property: 'source',
            propertyType: 'Node'
        },
        {
            property: 'target',
            propertyType: 'Node'
        }
    ],
    Relation: [
        {
            property: 'source',
            propertyType: 'Node'
        },
        {
            property: 'target',
            propertyType: 'Node'
        }
    ],
    Generalization: [
        {
            property: 'isSubstitutable',
            propertyType: 'boolean'
        },
        {
            property: 'source',
            propertyType: 'Node'
        },
        {
            property: 'target',
            propertyType: 'Node'
        }
    ],
    Extend: [
        {
            property: 'source',
            propertyType: 'Node'
        },
        {
            property: 'target',
            propertyType: 'Node'
        }
    ],
    Association: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'sourceMultiplicity',
            propertyType: 'string',
            defaultValue: '*'
        },
        {
            property: 'targetMultiplicity',
            propertyType: 'string',
            defaultValue: '*'
        },
        {
            property: 'sourceName',
            propertyType: 'string'
        },
        {
            property: 'targetName',
            propertyType: 'string'
        },
        {
            property: 'sourceAggregation',
            propertyType: 'AggregationType',
            defaultValue: 'NONE'
        },
        {
            property: 'targetAggregation',
            propertyType: 'AggregationType',
            defaultValue: 'NONE'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'source',
            propertyType: 'Node'
        },
        {
            property: 'target',
            propertyType: 'Node'
        }
    ],
    Property: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'isDerived',
            propertyType: 'boolean',
            defaultValue: false
        },
        {
            property: 'isOrdered',
            propertyType: 'boolean',
            defaultValue: false
        },
        {
            property: 'isStatic',
            propertyType: 'boolean',
            defaultValue: false
        },
        {
            property: 'isDerivedUnion',
            propertyType: 'boolean',
            defaultValue: false
        },
        {
            property: 'isReadOnly',
            propertyType: 'boolean',
            defaultValue: false
        },
        {
            property: 'isNavigable',
            propertyType: 'boolean',
            defaultValue: false
        },
        {
            property: 'isUnique',
            propertyType: 'boolean',
            defaultValue: false
        },
        {
            property: 'visibility',
            propertyType: 'Visibility',
            defaultValue: 'PUBLIC'
        }
    ],
    DataType: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'properties',
            propertyType: 'Property'
        },
        {
            property: 'operations',
            propertyType: 'Operation'
        },
        {
            property: 'isAbstract',
            propertyType: 'boolean'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        }
    ],
    PrimitiveType: [
        {
            property: 'name',
            propertyType: 'string'
        }
    ],
    Operation: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'isAbstract',
            propertyType: 'boolean'
        },
        {
            property: 'isStatic',
            propertyType: 'boolean'
        },
        {
            property: 'isQuery',
            propertyType: 'boolean'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'concurrency',
            propertyType: 'Concurrency'
        },
        {
            property: 'parameters',
            propertyType: 'Parameter'
        }
    ],
    Parameter: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'isException',
            propertyType: 'boolean'
        },
        {
            property: 'isStream',
            propertyType: 'boolean'
        },
        {
            property: 'isOrdered',
            propertyType: 'boolean'
        },
        {
            property: 'isUnique',
            propertyType: 'boolean'
        },
        {
            property: 'direction',
            propertyType: 'ParameterDirection'
        },
        {
            property: 'effect',
            propertyType: 'EffectType'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'parameterType',
            propertyType: 'DataTypeReference'
        },
        {
            property: 'multiplicity',
            propertyType: 'string'
        }
    ],
    Interface: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'properties',
            propertyType: 'Property'
        },
        {
            property: 'operations',
            propertyType: 'Operation'
        }
    ],
    Enumeration: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'isAbstract',
            propertyType: 'boolean',
            defaultValue: false
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'values',
            propertyType: 'EnumerationLiteral'
        }
    ],
    EnumerationLiteral: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'value',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        }
    ],
    Class: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'isAbstract',
            propertyType: 'boolean',
            defaultValue: false
        },
        {
            property: 'properties',
            propertyType: 'Property'
        },
        {
            property: 'operations',
            propertyType: 'Operation'
        },
        {
            property: 'isActive',
            propertyType: 'boolean'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        }
    ],
    Actor: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        }
    ],
    StateMachineDiagram: [
        {
            property: 'diagramType',
            propertyType: '"STATE_MACHINE"'
        },
        {
            property: 'entities',
            propertyType: 'StateMachineDiagramNodes'
        },
        {
            property: 'relations',
            propertyType: 'StateMachineDiagramEdges'
        }
    ],
    Transition: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'kind',
            propertyType: 'TransitionKind',
            defaultValue: 'EXTERNAL'
        },
        {
            property: 'source',
            propertyType: 'Node'
        },
        {
            property: 'target',
            propertyType: 'Node'
        }
    ],
    StateMachine: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'regions',
            propertyType: 'Region'
        }
    ],
    Region: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'subvertices',
            propertyType: 'Node'
        },
        {
            property: 'transitions',
            propertyType: 'Transition'
        }
    ],
    State: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'regions',
            propertyType: 'Region'
        }
    ],
    ShallowHistory: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        }
    ],
    Join: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        }
    ],
    InitialState: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        }
    ],
    Fork: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        }
    ],
    FinalState: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        }
    ],
    DeepHistory: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        }
    ],
    Choice: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        }
    ],
    PackageDiagram: [
        {
            property: 'diagramType',
            propertyType: '"PACKAGE"'
        },
        {
            property: 'entities',
            propertyType: 'PackageDiagramNodes'
        },
        {
            property: 'relations',
            propertyType: 'PackageDiagramEdges'
        }
    ],
    Usage: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'source',
            propertyType: 'Node'
        },
        {
            property: 'target',
            propertyType: 'Node'
        }
    ],
    PackageMerge: [
        {
            property: 'source',
            propertyType: 'Node'
        },
        {
            property: 'target',
            propertyType: 'Node'
        }
    ],
    PackageImport: [
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'source',
            propertyType: 'Node'
        },
        {
            property: 'target',
            propertyType: 'Node'
        }
    ],
    Package: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'uri',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'entities',
            propertyType: 'Node'
        }
    ],
    ElementImport: [
        {
            property: 'alias',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'source',
            propertyType: 'Node'
        },
        {
            property: 'target',
            propertyType: 'Node'
        }
    ],
    Dependency: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'source',
            propertyType: 'Node'
        },
        {
            property: 'target',
            propertyType: 'Node'
        }
    ],
    Abstraction: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'source',
            propertyType: 'Node'
        },
        {
            property: 'target',
            propertyType: 'Node'
        }
    ],
    InformationFlowDiagram: [
        {
            property: 'diagramType',
            propertyType: '"INFORMATION_FLOW"'
        },
        {
            property: 'entities',
            propertyType: 'InformationFlowDiagramNodes'
        },
        {
            property: 'relations',
            propertyType: 'InformationFlowDiagramEdges'
        }
    ],
    InformationFlow: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'source',
            propertyType: 'Actor'
        },
        {
            property: 'target',
            propertyType: 'Actor'
        }
    ],
    DeploymentDiagram: [
        {
            property: 'diagramType',
            propertyType: '"DEPLOYMENT"'
        },
        {
            property: 'entities',
            propertyType: 'DeploymentDiagramNodes'
        },
        {
            property: 'relations',
            propertyType: 'DeploymentDiagramEdges'
        }
    ],
    Manifestation: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'source',
            propertyType: 'Node'
        },
        {
            property: 'target',
            propertyType: 'Node'
        }
    ],
    ExecutionEnvironment: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'nestedEnvironments',
            propertyType: 'ExecutionEnvironment'
        },
        {
            property: 'artifacts',
            propertyType: 'Artifact'
        },
        {
            property: 'deploymentSpecifications',
            propertyType: 'DeploymentSpecification'
        }
    ],
    DeploymentSpecification: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'properties',
            propertyType: 'Property'
        },
        {
            property: 'operations',
            propertyType: 'Operation'
        }
    ],
    Artifact: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'properties',
            propertyType: 'Property'
        },
        {
            property: 'operations',
            propertyType: 'Operation'
        },
        {
            property: 'nestedArtifacts',
            propertyType: 'Artifact'
        }
    ],
    Device: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'nodes',
            propertyType: 'DeploymentNode'
        },
        {
            property: 'executionEnvironments',
            propertyType: 'ExecutionEnvironment'
        },
        {
            property: 'deploymentSpecifications',
            propertyType: 'DeploymentSpecification'
        }
    ],
    DeploymentNode: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'nestedNodes',
            propertyType: 'DeploymentNode'
        },
        {
            property: 'artifacts',
            propertyType: 'Artifact'
        },
        {
            property: 'devices',
            propertyType: 'Device'
        },
        {
            property: 'deploymentSpecifications',
            propertyType: 'DeploymentSpecification'
        },
        {
            property: 'executionEnvironments',
            propertyType: 'ExecutionEnvironment'
        }
    ],
    DeploymentPackage: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'uri',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'entities',
            propertyType: 'Node'
        }
    ],
    DeploymentModel: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'uri',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'entities',
            propertyType: 'Node'
        }
    ],
    Deployment: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'source',
            propertyType: 'Node'
        },
        {
            property: 'target',
            propertyType: 'Node'
        }
    ],
    CommunicationPath: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'source',
            propertyType: 'Node'
        },
        {
            property: 'target',
            propertyType: 'Node'
        }
    ],
    CommunicationDiagram: [
        {
            property: 'diagramType',
            propertyType: '"COMMUNICATION"'
        },
        {
            property: 'entities',
            propertyType: 'CommunicationDiagramNodes'
        },
        {
            property: 'relations',
            propertyType: 'CommunicationDiagramEdges'
        }
    ],
    Message: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'source',
            propertyType: 'Lifeline'
        },
        {
            property: 'target',
            propertyType: 'Lifeline'
        }
    ],
    Lifeline: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        }
    ],
    Interaction: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'lifelines',
            propertyType: 'Lifeline'
        },
        {
            property: 'messages',
            propertyType: 'Message'
        }
    ],
    ClassDiagram: [
        {
            property: 'diagramType',
            propertyType: '"CLASS"'
        },
        {
            property: 'entities',
            propertyType: 'ClassDiagramNodes'
        },
        {
            property: 'relations',
            propertyType: 'ClassDiagramEdges'
        }
    ],
    Substitution: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'source',
            propertyType: 'Node'
        },
        {
            property: 'target',
            propertyType: 'Node'
        }
    ],
    Slot: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'values',
            propertyType: 'LiteralSpecification',
            defaultValue: '[]'
        }
    ],
    LiteralSpecification: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'value',
            propertyType: 'string'
        }
    ],
    Realization: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'source',
            propertyType: 'Node'
        },
        {
            property: 'target',
            propertyType: 'Node'
        }
    ],
    InterfaceRealization: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'source',
            propertyType: 'Node'
        },
        {
            property: 'target',
            propertyType: 'Node'
        }
    ],
    InstanceSpecification: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'slots',
            propertyType: 'Slot'
        }
    ],
    AbstractClass: [
        {
            property: 'isAbstract',
            propertyType: 'boolean',
            defaultValue: true
        },
        {
            property: 'label',
            propertyType: 'string'
        },
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'properties',
            propertyType: 'Property'
        },
        {
            property: 'operations',
            propertyType: 'Operation'
        },
        {
            property: 'isActive',
            propertyType: 'boolean'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        }
    ],
    ActivityDiagram: [
        {
            property: 'diagramType',
            propertyType: '"ACTIVITY"'
        },
        {
            property: 'entities',
            propertyType: 'ActivityDiagramNodes'
        },
        {
            property: 'relations',
            propertyType: 'ActivityDiagramEdges'
        }
    ],
    SendSignalAction: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        }
    ],
    OutputPin: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        }
    ],
    OpaqueAction: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'inputPins',
            propertyType: 'InputPin'
        },
        {
            property: 'outputPins',
            propertyType: 'OutputPin'
        }
    ],
    InputPin: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        }
    ],
    MergeNode: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        }
    ],
    JoinNode: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        }
    ],
    InitialNode: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        }
    ],
    ForkNode: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        }
    ],
    FlowFinalNode: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        }
    ],
    DecisionNode: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        }
    ],
    ControlFlow: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'guard',
            propertyType: 'string'
        },
        {
            property: 'weight',
            propertyType: 'number'
        },
        {
            property: 'source',
            propertyType: 'Node'
        },
        {
            property: 'target',
            propertyType: 'Node'
        }
    ],
    CentralBufferNode: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        }
    ],
    ActivityPartition: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'subpartitions',
            propertyType: 'ActivityPartition'
        },
        {
            property: 'nodes',
            propertyType: 'Node'
        }
    ],
    ActivityParameterNode: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        }
    ],
    ActivityFinalNode: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        }
    ],
    Activity: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        },
        {
            property: 'partitions',
            propertyType: 'ActivityPartition'
        },
        {
            property: 'nodes',
            propertyType: 'Node'
        },
        {
            property: 'edges',
            propertyType: 'ControlFlow'
        }
    ],
    AcceptEventAction: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'visibility',
            propertyType: 'Visibility'
        }
    ]
};

export const noBoundsClasses = new Set<string>(['Property', 'Parameter', 'EnumerationLiteral', 'Slot', 'LiteralSpecification']);

export const astTypeMapping: Record<string, string> = {};

export function isNoBounds(typeId: string): boolean {
    return noBoundsClasses.has(stripPrefix(typeId));
}

export function getDefaultProperties(elementTypeId: string): DefaultMappingEntry[] {
    const parentType = elementTypeId.startsWith('edge')
        ? (() => {
              const s = getRelationTypeFromElementId(elementTypeId, true).toLowerCase();
              return s.charAt(0).toUpperCase() + s.slice(1);
          })()
        : stripPrefix(elementTypeId);
    const entries = defaultMapping[parentType] || [];
    return entries.reduce((acc, e) => {
        if (e.defaultValue !== undefined) {
            if (e.defaultValue === '[]') {
                acc.push({ ...e, defaultValue: [] });
            } else {
                acc.push(e);
            }
            return acc;
        }

        switch (e.propertyType) {
            case 'string':
                return acc;
            case 'boolean':
                acc.push({ ...e, defaultValue: false });
                return acc;
            case 'number':
                acc.push({ ...e, defaultValue: 0 });
                return acc;
            case 'Visibility':
                acc.push({ ...e, defaultValue: 'PUBLIC' });
                return acc;
            case 'Concurrency':
                acc.push({ ...e, defaultValue: 'SEQUENTIAL' });
                return acc;
            default:
                acc.push({ ...e, defaultValue: [] });
                return acc;
        }
    }, [] as DefaultMappingEntry[]);
}

function stripPrefix(name: string): string {
    return name.replace(/^.*?__/, '');
}

/**
 * Returns the UPPER_CASE relation type identifier when upperCase is true,
 * otherwise returns the AST edge type name for use in the model.
 */
export function getRelationTypeFromElementId(elementTypeId: string, upperCase: boolean): string {
    const withoutPrefix = elementTypeId.replace(/^.*?__/, '');
    const head = withoutPrefix.split('__')[0];

    if (upperCase) {
        const withUnderscore = head.replace(/([a-z])([A-Z])/g, '$1_$2');
        return withUnderscore.toUpperCase();
    } else {
        const candidate = head.charAt(0).toUpperCase() + head.slice(1);
        const lookup = candidate.toLowerCase();
        if (astTypeMapping[lookup]) {
            return astTypeMapping[lookup];
        }
        return candidate;
    }
}
