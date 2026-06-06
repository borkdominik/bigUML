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

const mapping: Record<string, Array<{ property: string; allowedChildTypes?: string[] }>> = {
    Diagram: [
        {
            property: 'metaInfos',
            allowedChildTypes: ['Size', 'Position']
        }
    ],
    UseCaseDiagram: [
        {
            property: 'entities',
            allowedChildTypes: ['UseCaseDiagramNodes']
        },
        {
            property: 'relations',
            allowedChildTypes: ['UseCaseDiagramEdges']
        }
    ],
    Subject: [
        {
            property: 'useCases',
            allowedChildTypes: ['UseCase']
        }
    ],
    DataType: [
        {
            property: 'properties',
            allowedChildTypes: ['Property']
        },
        {
            property: 'operations',
            allowedChildTypes: ['Operation']
        }
    ],
    Operation: [
        {
            property: 'parameters',
            allowedChildTypes: ['Parameter']
        }
    ],
    Interface: [
        {
            property: 'properties',
            allowedChildTypes: ['Property']
        },
        {
            property: 'operations',
            allowedChildTypes: ['Operation']
        }
    ],
    Enumeration: [
        {
            property: 'values',
            allowedChildTypes: ['EnumerationLiteral']
        }
    ],
    Class: [
        {
            property: 'properties',
            allowedChildTypes: ['Property']
        },
        {
            property: 'operations',
            allowedChildTypes: ['Operation']
        }
    ],
    StateMachineDiagram: [
        {
            property: 'entities',
            allowedChildTypes: ['StateMachineDiagramNodes']
        },
        {
            property: 'relations',
            allowedChildTypes: ['StateMachineDiagramEdges']
        }
    ],
    StateMachine: [
        {
            property: 'regions',
            allowedChildTypes: ['Region']
        }
    ],
    Region: [
        {
            property: 'subvertices',
            allowedChildTypes: [
                'UseCase',
                'Subject',
                'DataType',
                'PrimitiveType',
                'Operation',
                'Interface',
                'Enumeration',
                'Class',
                'Actor',
                'StateMachine',
                'Region',
                'State',
                'ShallowHistory',
                'Join',
                'InitialState',
                'Fork',
                'FinalState',
                'DeepHistory',
                'Choice',
                'Package',
                'ExecutionEnvironment',
                'DeploymentSpecification',
                'Artifact',
                'Device',
                'DeploymentNode',
                'DeploymentPackage',
                'DeploymentModel',
                'Lifeline',
                'Interaction',
                'InstanceSpecification',
                'SendSignalAction',
                'OutputPin',
                'OpaqueAction',
                'InputPin',
                'MergeNode',
                'JoinNode',
                'InitialNode',
                'ForkNode',
                'FlowFinalNode',
                'DecisionNode',
                'CentralBufferNode',
                'ActivityPartition',
                'ActivityParameterNode',
                'ActivityFinalNode',
                'Activity',
                'AcceptEventAction'
            ]
        },
        {
            property: 'transitions',
            allowedChildTypes: ['Transition']
        }
    ],
    State: [
        {
            property: 'regions',
            allowedChildTypes: ['Region']
        }
    ],
    PackageDiagram: [
        {
            property: 'entities',
            allowedChildTypes: ['PackageDiagramNodes']
        },
        {
            property: 'relations',
            allowedChildTypes: ['PackageDiagramEdges']
        }
    ],
    Package: [
        {
            property: 'entities',
            allowedChildTypes: [
                'UseCase',
                'Subject',
                'DataType',
                'PrimitiveType',
                'Operation',
                'Interface',
                'Enumeration',
                'Class',
                'Actor',
                'StateMachine',
                'Region',
                'State',
                'ShallowHistory',
                'Join',
                'InitialState',
                'Fork',
                'FinalState',
                'DeepHistory',
                'Choice',
                'Package',
                'ExecutionEnvironment',
                'DeploymentSpecification',
                'Artifact',
                'Device',
                'DeploymentNode',
                'DeploymentPackage',
                'DeploymentModel',
                'Lifeline',
                'Interaction',
                'InstanceSpecification',
                'SendSignalAction',
                'OutputPin',
                'OpaqueAction',
                'InputPin',
                'MergeNode',
                'JoinNode',
                'InitialNode',
                'ForkNode',
                'FlowFinalNode',
                'DecisionNode',
                'CentralBufferNode',
                'ActivityPartition',
                'ActivityParameterNode',
                'ActivityFinalNode',
                'Activity',
                'AcceptEventAction'
            ]
        }
    ],
    InformationFlowDiagram: [
        {
            property: 'entities',
            allowedChildTypes: ['InformationFlowDiagramNodes']
        },
        {
            property: 'relations',
            allowedChildTypes: ['InformationFlowDiagramEdges']
        }
    ],
    DeploymentDiagram: [
        {
            property: 'entities',
            allowedChildTypes: ['DeploymentDiagramNodes']
        },
        {
            property: 'relations',
            allowedChildTypes: ['DeploymentDiagramEdges']
        }
    ],
    ExecutionEnvironment: [
        {
            property: 'nestedEnvironments',
            allowedChildTypes: ['ExecutionEnvironment']
        },
        {
            property: 'artifacts',
            allowedChildTypes: ['Artifact']
        },
        {
            property: 'deploymentSpecifications',
            allowedChildTypes: ['DeploymentSpecification']
        }
    ],
    DeploymentSpecification: [
        {
            property: 'properties',
            allowedChildTypes: ['Property']
        },
        {
            property: 'operations',
            allowedChildTypes: ['Operation']
        }
    ],
    Artifact: [
        {
            property: 'properties',
            allowedChildTypes: ['Property']
        },
        {
            property: 'operations',
            allowedChildTypes: ['Operation']
        },
        {
            property: 'nestedArtifacts',
            allowedChildTypes: ['Artifact']
        }
    ],
    Device: [
        {
            property: 'nodes',
            allowedChildTypes: ['DeploymentNode']
        },
        {
            property: 'executionEnvironments',
            allowedChildTypes: ['ExecutionEnvironment']
        },
        {
            property: 'deploymentSpecifications',
            allowedChildTypes: ['DeploymentSpecification']
        }
    ],
    DeploymentNode: [
        {
            property: 'nestedNodes',
            allowedChildTypes: ['DeploymentNode']
        },
        {
            property: 'artifacts',
            allowedChildTypes: ['Artifact']
        },
        {
            property: 'devices',
            allowedChildTypes: ['Device']
        },
        {
            property: 'deploymentSpecifications',
            allowedChildTypes: ['DeploymentSpecification']
        },
        {
            property: 'executionEnvironments',
            allowedChildTypes: ['ExecutionEnvironment']
        }
    ],
    DeploymentPackage: [
        {
            property: 'entities',
            allowedChildTypes: [
                'UseCase',
                'Subject',
                'DataType',
                'PrimitiveType',
                'Operation',
                'Interface',
                'Enumeration',
                'Class',
                'Actor',
                'StateMachine',
                'Region',
                'State',
                'ShallowHistory',
                'Join',
                'InitialState',
                'Fork',
                'FinalState',
                'DeepHistory',
                'Choice',
                'Package',
                'ExecutionEnvironment',
                'DeploymentSpecification',
                'Artifact',
                'Device',
                'DeploymentNode',
                'DeploymentPackage',
                'DeploymentModel',
                'Lifeline',
                'Interaction',
                'InstanceSpecification',
                'SendSignalAction',
                'OutputPin',
                'OpaqueAction',
                'InputPin',
                'MergeNode',
                'JoinNode',
                'InitialNode',
                'ForkNode',
                'FlowFinalNode',
                'DecisionNode',
                'CentralBufferNode',
                'ActivityPartition',
                'ActivityParameterNode',
                'ActivityFinalNode',
                'Activity',
                'AcceptEventAction'
            ]
        }
    ],
    DeploymentModel: [
        {
            property: 'entities',
            allowedChildTypes: [
                'UseCase',
                'Subject',
                'DataType',
                'PrimitiveType',
                'Operation',
                'Interface',
                'Enumeration',
                'Class',
                'Actor',
                'StateMachine',
                'Region',
                'State',
                'ShallowHistory',
                'Join',
                'InitialState',
                'Fork',
                'FinalState',
                'DeepHistory',
                'Choice',
                'Package',
                'ExecutionEnvironment',
                'DeploymentSpecification',
                'Artifact',
                'Device',
                'DeploymentNode',
                'DeploymentPackage',
                'DeploymentModel',
                'Lifeline',
                'Interaction',
                'InstanceSpecification',
                'SendSignalAction',
                'OutputPin',
                'OpaqueAction',
                'InputPin',
                'MergeNode',
                'JoinNode',
                'InitialNode',
                'ForkNode',
                'FlowFinalNode',
                'DecisionNode',
                'CentralBufferNode',
                'ActivityPartition',
                'ActivityParameterNode',
                'ActivityFinalNode',
                'Activity',
                'AcceptEventAction'
            ]
        }
    ],
    CommunicationDiagram: [
        {
            property: 'entities',
            allowedChildTypes: ['CommunicationDiagramNodes']
        },
        {
            property: 'relations',
            allowedChildTypes: ['CommunicationDiagramEdges']
        }
    ],
    Interaction: [
        {
            property: 'lifelines',
            allowedChildTypes: ['Lifeline']
        },
        {
            property: 'messages',
            allowedChildTypes: ['Message']
        }
    ],
    ClassDiagram: [
        {
            property: 'entities',
            allowedChildTypes: ['ClassDiagramNodes']
        },
        {
            property: 'relations',
            allowedChildTypes: ['ClassDiagramEdges']
        }
    ],
    Slot: [
        {
            property: 'values',
            allowedChildTypes: ['LiteralSpecification']
        }
    ],
    InstanceSpecification: [
        {
            property: 'slots',
            allowedChildTypes: ['Slot']
        }
    ],
    AbstractClass: [
        {
            property: 'properties',
            allowedChildTypes: ['Property']
        },
        {
            property: 'operations',
            allowedChildTypes: ['Operation']
        }
    ],
    ActivityDiagram: [
        {
            property: 'entities',
            allowedChildTypes: ['ActivityDiagramNodes']
        },
        {
            property: 'relations',
            allowedChildTypes: ['ActivityDiagramEdges']
        }
    ],
    OpaqueAction: [
        {
            property: 'inputPins',
            allowedChildTypes: ['InputPin']
        },
        {
            property: 'outputPins',
            allowedChildTypes: ['OutputPin']
        }
    ],
    ActivityPartition: [
        {
            property: 'subpartitions',
            allowedChildTypes: ['ActivityPartition']
        },
        {
            property: 'nodes',
            allowedChildTypes: [
                'UseCase',
                'Subject',
                'DataType',
                'PrimitiveType',
                'Operation',
                'Interface',
                'Enumeration',
                'Class',
                'Actor',
                'StateMachine',
                'Region',
                'State',
                'ShallowHistory',
                'Join',
                'InitialState',
                'Fork',
                'FinalState',
                'DeepHistory',
                'Choice',
                'Package',
                'ExecutionEnvironment',
                'DeploymentSpecification',
                'Artifact',
                'Device',
                'DeploymentNode',
                'DeploymentPackage',
                'DeploymentModel',
                'Lifeline',
                'Interaction',
                'InstanceSpecification',
                'SendSignalAction',
                'OutputPin',
                'OpaqueAction',
                'InputPin',
                'MergeNode',
                'JoinNode',
                'InitialNode',
                'ForkNode',
                'FlowFinalNode',
                'DecisionNode',
                'CentralBufferNode',
                'ActivityPartition',
                'ActivityParameterNode',
                'ActivityFinalNode',
                'Activity',
                'AcceptEventAction'
            ]
        }
    ],
    Activity: [
        {
            property: 'partitions',
            allowedChildTypes: ['ActivityPartition']
        },
        {
            property: 'nodes',
            allowedChildTypes: [
                'UseCase',
                'Subject',
                'DataType',
                'PrimitiveType',
                'Operation',
                'Interface',
                'Enumeration',
                'Class',
                'Actor',
                'StateMachine',
                'Region',
                'State',
                'ShallowHistory',
                'Join',
                'InitialState',
                'Fork',
                'FinalState',
                'DeepHistory',
                'Choice',
                'Package',
                'ExecutionEnvironment',
                'DeploymentSpecification',
                'Artifact',
                'Device',
                'DeploymentNode',
                'DeploymentPackage',
                'DeploymentModel',
                'Lifeline',
                'Interaction',
                'InstanceSpecification',
                'SendSignalAction',
                'OutputPin',
                'OpaqueAction',
                'InputPin',
                'MergeNode',
                'JoinNode',
                'InitialNode',
                'ForkNode',
                'FlowFinalNode',
                'DecisionNode',
                'CentralBufferNode',
                'ActivityPartition',
                'ActivityParameterNode',
                'ActivityFinalNode',
                'Activity',
                'AcceptEventAction'
            ]
        },
        {
            property: 'edges',
            allowedChildTypes: ['ControlFlow']
        }
    ]
};

function stripPrefix(name: string): string {
    return name.replace(/^.*?__/, '');
}

export function getCreationPath(parentType: string, childType: string): string | undefined {
    const parentKey = stripPrefix(parentType);
    const childKey = stripPrefix(childType);

    if (mapping[parentKey]) {
        for (const entry of mapping[parentKey]) {
            if (entry.allowedChildTypes && entry.allowedChildTypes.includes(childKey)) {
                return entry.property;
            }
        }
    }
    return undefined;
}
