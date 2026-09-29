// AUTO-GENERATED – DO NOT EDIT
/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

/**
 * Everything the GLSP server knows about an element type, declared on the element definition through
 * the `@Glsp.*` decorators and rendered here. The generic handlers, the diagram configuration and the
 * gmodel factory read this rather than keeping lists of element names of their own.
 */

/** A containment property of an element and the concrete AST types it may hold. */
export interface ElementContainment {
    property: string;
    childTypes: string[];
}

export interface ElementSize {
    width: number;
    height: number;
}

export interface ElementShapeOptions {
    repositionable: boolean;
    resizable: boolean;
    deletable: boolean;
}

export interface ElementMetadata {
    /** The AST type the element is stored as - its own name, unless it is an alias of another type. */
    astType: string;
    /** Whether the element is drawn as a node, an edge, or is placed by its owner (`unbounded`). */
    kind: 'node' | 'edge' | 'unbounded';
    /** Whether the element stores no `bounds` of its own. */
    noBounds: boolean;
    /** Whether UML only lets the element exist inside an owner. Every `noBounds` element is owned. */
    owned: boolean;
    /** Whether the element is never written inside another element, wherever it is dropped. */
    floating: boolean;
    /** The size a newly created node opens at, where the element declares one. */
    defaultSize?: ElementSize;
    /** Children a node is created with, written into `property` by the patch that creates it. */
    opensWith?: { property: string; count: number };
    /** The shape type hint the client is given for the node. */
    shape: ElementShapeOptions;
    /** The containment properties of the element. */
    contains: ElementContainment[];
    /** Whether the element's name may be cleared - the grammar writes it as optional. */
    optionalName: boolean;
    /** Whether the element has no name at all - a note, which is the text it holds. */
    unnamed: boolean;
    /** The values a new element is created with. */
    defaults: ElementDefault[];
}

/** A value a new element of a type is created with. */
export interface ElementDefault {
    property: string;
    defaultValue: unknown;
}

/** What a node opens at when its element declares no size of its own. */
export const DEFAULT_NODE_SIZE: ElementSize = { width: 80, height: 30 };

export const elementMetadata: Record<string, ElementMetadata> = {
    EdgeAnchor: {
        astType: 'EdgeAnchor',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: true,
        defaultSize: {
            width: 1,
            height: 1
        },
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: false,
        unnamed: true,
        defaults: []
    },
    GenericEdge: {
        astType: 'GenericEdge',
        kind: 'edge',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'sourceMarker',
                defaultValue: 'NONE'
            },
            {
                property: 'targetMarker',
                defaultValue: 'OPEN_ARROW'
            },
            {
                property: 'lineStyle',
                defaultValue: 'SOLID'
            }
        ]
    },
    Transition: {
        astType: 'Transition',
        kind: 'edge',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            },
            {
                property: 'kind',
                defaultValue: 'EXTERNAL'
            }
        ]
    },
    Relation: {
        astType: 'Relation',
        kind: 'edge',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: false,
        unnamed: true,
        defaults: []
    },
    UseCase: {
        astType: 'UseCase',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        defaultSize: {
            width: 140,
            height: 85
        },
        shape: {
            repositionable: true,
            resizable: false,
            deletable: true
        },
        contains: [],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    Subject: {
        astType: 'Subject',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        defaultSize: {
            width: 400,
            height: 600
        },
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [
            {
                property: 'useCases',
                childTypes: ['UseCase']
            }
        ],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            },
            {
                property: 'useCases',
                defaultValue: []
            }
        ]
    },
    TextLabel: {
        astType: 'TextLabel',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: true,
        defaultSize: {
            width: 160,
            height: 34
        },
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: false,
        unnamed: true,
        defaults: [
            {
                property: 'body',
                defaultValue: 'Label'
            }
        ]
    },
    Note: {
        astType: 'Note',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: true,
        defaultSize: {
            width: 180,
            height: 90
        },
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: false,
        unnamed: true,
        defaults: [
            {
                property: 'body',
                defaultValue: 'Note'
            }
        ]
    },
    Include: {
        astType: 'Include',
        kind: 'edge',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: false,
        unnamed: true,
        defaults: []
    },
    Generalization: {
        astType: 'Generalization',
        kind: 'edge',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: false,
        unnamed: true,
        defaults: [
            {
                property: 'isSubstitutable',
                defaultValue: false
            }
        ]
    },
    Extend: {
        astType: 'Extend',
        kind: 'edge',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: false,
        unnamed: true,
        defaults: []
    },
    Association: {
        astType: 'Association',
        kind: 'edge',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'sourceAggregation',
                defaultValue: 'NONE'
            },
            {
                property: 'targetAggregation',
                defaultValue: 'NONE'
            },
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    Property: {
        astType: 'Property',
        kind: 'unbounded',
        noBounds: true,
        owned: true,
        floating: false,
        shape: {
            repositionable: false,
            resizable: false,
            deletable: true
        },
        contains: [],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'isDerived',
                defaultValue: false
            },
            {
                property: 'isOrdered',
                defaultValue: false
            },
            {
                property: 'isStatic',
                defaultValue: false
            },
            {
                property: 'isDerivedUnion',
                defaultValue: false
            },
            {
                property: 'isReadOnly',
                defaultValue: false
            },
            {
                property: 'isNavigable',
                defaultValue: false
            },
            {
                property: 'isUnique',
                defaultValue: false
            },
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    PrimitiveType: {
        astType: 'PrimitiveType',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: false,
        unnamed: false,
        defaults: []
    },
    Interface: {
        astType: 'Interface',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [
            {
                property: 'properties',
                childTypes: ['Property']
            },
            {
                property: 'operations',
                childTypes: ['Operation']
            }
        ],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'properties',
                defaultValue: []
            },
            {
                property: 'operations',
                defaultValue: []
            }
        ]
    },
    Operation: {
        astType: 'Operation',
        kind: 'node',
        noBounds: false,
        owned: true,
        floating: false,
        shape: {
            repositionable: false,
            resizable: false,
            deletable: true
        },
        contains: [
            {
                property: 'parameters',
                childTypes: ['Parameter']
            }
        ],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'isAbstract',
                defaultValue: false
            },
            {
                property: 'isStatic',
                defaultValue: false
            },
            {
                property: 'isQuery',
                defaultValue: false
            },
            {
                property: 'visibility',
                defaultValue: 'NONE'
            },
            {
                property: 'concurrency',
                defaultValue: 'SEQUENTIAL'
            },
            {
                property: 'parameters',
                defaultValue: []
            }
        ]
    },
    Parameter: {
        astType: 'Parameter',
        kind: 'unbounded',
        noBounds: true,
        owned: true,
        floating: false,
        shape: {
            repositionable: false,
            resizable: false,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'isException',
                defaultValue: false
            },
            {
                property: 'isStream',
                defaultValue: false
            },
            {
                property: 'isOrdered',
                defaultValue: false
            },
            {
                property: 'isUnique',
                defaultValue: false
            },
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    Enumeration: {
        astType: 'Enumeration',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [
            {
                property: 'values',
                childTypes: ['EnumerationLiteral']
            }
        ],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'isAbstract',
                defaultValue: false
            },
            {
                property: 'visibility',
                defaultValue: 'NONE'
            },
            {
                property: 'values',
                defaultValue: []
            }
        ]
    },
    EnumerationLiteral: {
        astType: 'EnumerationLiteral',
        kind: 'unbounded',
        noBounds: true,
        owned: true,
        floating: false,
        shape: {
            repositionable: false,
            resizable: false,
            deletable: true
        },
        contains: [],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    DataType: {
        astType: 'DataType',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [
            {
                property: 'properties',
                childTypes: ['Property']
            },
            {
                property: 'operations',
                childTypes: ['Operation']
            }
        ],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'properties',
                defaultValue: []
            },
            {
                property: 'operations',
                defaultValue: []
            },
            {
                property: 'isAbstract',
                defaultValue: false
            },
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    Class: {
        astType: 'Class',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [
            {
                property: 'properties',
                childTypes: ['Property']
            },
            {
                property: 'operations',
                childTypes: ['Operation']
            }
        ],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'isAbstract',
                defaultValue: false
            },
            {
                property: 'properties',
                defaultValue: []
            },
            {
                property: 'operations',
                defaultValue: []
            },
            {
                property: 'isActive',
                defaultValue: false
            },
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    Actor: {
        astType: 'Actor',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: false,
            deletable: true
        },
        contains: [],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    Terminate: {
        astType: 'Terminate',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        defaultSize: {
            width: 30,
            height: 30
        },
        shape: {
            repositionable: true,
            resizable: false,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    StatePart: {
        astType: 'StatePart',
        kind: 'unbounded',
        noBounds: true,
        owned: true,
        floating: false,
        shape: {
            repositionable: false,
            resizable: false,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: []
    },
    StateMachine: {
        astType: 'StateMachine',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        defaultSize: {
            width: 800,
            height: 600
        },
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [
            {
                property: 'regions',
                childTypes: ['Region']
            }
        ],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            },
            {
                property: 'regions',
                defaultValue: []
            }
        ]
    },
    Region: {
        astType: 'Region',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        defaultSize: {
            width: 600,
            height: 240
        },
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [
            {
                property: 'subvertices',
                childTypes: [
                    'EdgeAnchor',
                    'UseCase',
                    'Subject',
                    'TextLabel',
                    'Note',
                    'PrimitiveType',
                    'Interface',
                    'Operation',
                    'Enumeration',
                    'DataType',
                    'Class',
                    'Actor',
                    'Terminate',
                    'StateMachine',
                    'Region',
                    'State',
                    'ShallowHistory',
                    'Join',
                    'InitialState',
                    'Fork',
                    'FinalState',
                    'ExitPoint',
                    'EntryPoint',
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
                    'NaryAssociation',
                    'InstanceSpecification',
                    'SendSignalAction',
                    'OpaqueAction',
                    'MergeNode',
                    'JoinNode',
                    'InitialNode',
                    'ForkNode',
                    'FlowFinalNode',
                    'DecisionNode',
                    'CentralBufferNode',
                    'ActivityPartition',
                    'ActivityFinalNode',
                    'AcceptEventAction',
                    'ActivityParameterNode',
                    'Activity'
                ]
            },
            {
                property: 'transitions',
                childTypes: ['Transition']
            }
        ],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            },
            {
                property: 'subvertices',
                defaultValue: []
            },
            {
                property: 'transitions',
                defaultValue: []
            }
        ]
    },
    State: {
        astType: 'State',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        defaultSize: {
            width: 160,
            height: 70
        },
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [
            {
                property: 'parts',
                childTypes: ['StatePart']
            },
            {
                property: 'regions',
                childTypes: ['Region']
            }
        ],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'parts',
                defaultValue: []
            },
            {
                property: 'partsHeight',
                defaultValue: 0
            },
            {
                property: 'visibility',
                defaultValue: 'NONE'
            },
            {
                property: 'regions',
                defaultValue: []
            },
            {
                property: 'regionHeight',
                defaultValue: 0
            }
        ]
    },
    ShallowHistory: {
        astType: 'ShallowHistory',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        defaultSize: {
            width: 30,
            height: 30
        },
        shape: {
            repositionable: true,
            resizable: false,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    Join: {
        astType: 'Join',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        defaultSize: {
            width: 120,
            height: 10
        },
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    InitialState: {
        astType: 'InitialState',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        defaultSize: {
            width: 30,
            height: 30
        },
        shape: {
            repositionable: true,
            resizable: false,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    Fork: {
        astType: 'Fork',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        defaultSize: {
            width: 120,
            height: 10
        },
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    FinalState: {
        astType: 'FinalState',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        defaultSize: {
            width: 30,
            height: 30
        },
        shape: {
            repositionable: true,
            resizable: false,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    ExitPoint: {
        astType: 'ExitPoint',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        defaultSize: {
            width: 30,
            height: 30
        },
        shape: {
            repositionable: true,
            resizable: false,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    EntryPoint: {
        astType: 'EntryPoint',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        defaultSize: {
            width: 30,
            height: 30
        },
        shape: {
            repositionable: true,
            resizable: false,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    DeepHistory: {
        astType: 'DeepHistory',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        defaultSize: {
            width: 30,
            height: 30
        },
        shape: {
            repositionable: true,
            resizable: false,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    Choice: {
        astType: 'Choice',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        defaultSize: {
            width: 40,
            height: 40
        },
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    Usage: {
        astType: 'Usage',
        kind: 'edge',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    PackageMerge: {
        astType: 'PackageMerge',
        kind: 'edge',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: false,
        unnamed: true,
        defaults: []
    },
    PackageImport: {
        astType: 'PackageImport',
        kind: 'edge',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: false,
        unnamed: true,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    Package: {
        astType: 'Package',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [
            {
                property: 'entities',
                childTypes: [
                    'EdgeAnchor',
                    'UseCase',
                    'Subject',
                    'TextLabel',
                    'Note',
                    'PrimitiveType',
                    'Interface',
                    'Operation',
                    'Enumeration',
                    'DataType',
                    'Class',
                    'Actor',
                    'Terminate',
                    'StateMachine',
                    'Region',
                    'State',
                    'ShallowHistory',
                    'Join',
                    'InitialState',
                    'Fork',
                    'FinalState',
                    'ExitPoint',
                    'EntryPoint',
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
                    'NaryAssociation',
                    'InstanceSpecification',
                    'SendSignalAction',
                    'OpaqueAction',
                    'MergeNode',
                    'JoinNode',
                    'InitialNode',
                    'ForkNode',
                    'FlowFinalNode',
                    'DecisionNode',
                    'CentralBufferNode',
                    'ActivityPartition',
                    'ActivityFinalNode',
                    'AcceptEventAction',
                    'ActivityParameterNode',
                    'Activity'
                ]
            }
        ],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            },
            {
                property: 'entities',
                defaultValue: []
            }
        ]
    },
    ElementImport: {
        astType: 'ElementImport',
        kind: 'edge',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: false,
        unnamed: true,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    Dependency: {
        astType: 'Dependency',
        kind: 'edge',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    Abstraction: {
        astType: 'Abstraction',
        kind: 'edge',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    InformationFlow: {
        astType: 'InformationFlow',
        kind: 'edge',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    Manifestation: {
        astType: 'Manifestation',
        kind: 'edge',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    ExecutionEnvironment: {
        astType: 'ExecutionEnvironment',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [
            {
                property: 'nestedEnvironments',
                childTypes: ['ExecutionEnvironment']
            },
            {
                property: 'artifacts',
                childTypes: ['Artifact']
            },
            {
                property: 'deploymentSpecifications',
                childTypes: ['DeploymentSpecification']
            }
        ],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            },
            {
                property: 'nestedEnvironments',
                defaultValue: []
            },
            {
                property: 'artifacts',
                defaultValue: []
            },
            {
                property: 'deploymentSpecifications',
                defaultValue: []
            }
        ]
    },
    DeploymentSpecification: {
        astType: 'DeploymentSpecification',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [
            {
                property: 'properties',
                childTypes: ['Property']
            },
            {
                property: 'operations',
                childTypes: ['Operation']
            }
        ],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            },
            {
                property: 'properties',
                defaultValue: []
            },
            {
                property: 'operations',
                defaultValue: []
            }
        ]
    },
    Artifact: {
        astType: 'Artifact',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [
            {
                property: 'properties',
                childTypes: ['Property']
            },
            {
                property: 'operations',
                childTypes: ['Operation']
            },
            {
                property: 'nestedArtifacts',
                childTypes: ['Artifact']
            }
        ],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            },
            {
                property: 'properties',
                defaultValue: []
            },
            {
                property: 'operations',
                defaultValue: []
            },
            {
                property: 'nestedArtifacts',
                defaultValue: []
            }
        ]
    },
    Device: {
        astType: 'Device',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [
            {
                property: 'nodes',
                childTypes: ['DeploymentNode']
            },
            {
                property: 'executionEnvironments',
                childTypes: ['ExecutionEnvironment']
            },
            {
                property: 'deploymentSpecifications',
                childTypes: ['DeploymentSpecification']
            }
        ],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            },
            {
                property: 'nodes',
                defaultValue: []
            },
            {
                property: 'executionEnvironments',
                defaultValue: []
            },
            {
                property: 'deploymentSpecifications',
                defaultValue: []
            }
        ]
    },
    DeploymentNode: {
        astType: 'DeploymentNode',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [
            {
                property: 'nestedNodes',
                childTypes: ['DeploymentNode']
            },
            {
                property: 'artifacts',
                childTypes: ['Artifact']
            },
            {
                property: 'devices',
                childTypes: ['Device']
            },
            {
                property: 'deploymentSpecifications',
                childTypes: ['DeploymentSpecification']
            },
            {
                property: 'executionEnvironments',
                childTypes: ['ExecutionEnvironment']
            }
        ],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            },
            {
                property: 'nestedNodes',
                defaultValue: []
            },
            {
                property: 'artifacts',
                defaultValue: []
            },
            {
                property: 'devices',
                defaultValue: []
            },
            {
                property: 'deploymentSpecifications',
                defaultValue: []
            },
            {
                property: 'executionEnvironments',
                defaultValue: []
            }
        ]
    },
    DeploymentPackage: {
        astType: 'DeploymentPackage',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [
            {
                property: 'entities',
                childTypes: [
                    'EdgeAnchor',
                    'UseCase',
                    'Subject',
                    'TextLabel',
                    'Note',
                    'PrimitiveType',
                    'Interface',
                    'Operation',
                    'Enumeration',
                    'DataType',
                    'Class',
                    'Actor',
                    'Terminate',
                    'StateMachine',
                    'Region',
                    'State',
                    'ShallowHistory',
                    'Join',
                    'InitialState',
                    'Fork',
                    'FinalState',
                    'ExitPoint',
                    'EntryPoint',
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
                    'NaryAssociation',
                    'InstanceSpecification',
                    'SendSignalAction',
                    'OpaqueAction',
                    'MergeNode',
                    'JoinNode',
                    'InitialNode',
                    'ForkNode',
                    'FlowFinalNode',
                    'DecisionNode',
                    'CentralBufferNode',
                    'ActivityPartition',
                    'ActivityFinalNode',
                    'AcceptEventAction',
                    'ActivityParameterNode',
                    'Activity'
                ]
            }
        ],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            },
            {
                property: 'entities',
                defaultValue: []
            }
        ]
    },
    DeploymentModel: {
        astType: 'DeploymentModel',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [
            {
                property: 'entities',
                childTypes: [
                    'EdgeAnchor',
                    'UseCase',
                    'Subject',
                    'TextLabel',
                    'Note',
                    'PrimitiveType',
                    'Interface',
                    'Operation',
                    'Enumeration',
                    'DataType',
                    'Class',
                    'Actor',
                    'Terminate',
                    'StateMachine',
                    'Region',
                    'State',
                    'ShallowHistory',
                    'Join',
                    'InitialState',
                    'Fork',
                    'FinalState',
                    'ExitPoint',
                    'EntryPoint',
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
                    'NaryAssociation',
                    'InstanceSpecification',
                    'SendSignalAction',
                    'OpaqueAction',
                    'MergeNode',
                    'JoinNode',
                    'InitialNode',
                    'ForkNode',
                    'FlowFinalNode',
                    'DecisionNode',
                    'CentralBufferNode',
                    'ActivityPartition',
                    'ActivityFinalNode',
                    'AcceptEventAction',
                    'ActivityParameterNode',
                    'Activity'
                ]
            }
        ],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            },
            {
                property: 'entities',
                defaultValue: []
            }
        ]
    },
    Deployment: {
        astType: 'Deployment',
        kind: 'edge',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    CommunicationPath: {
        astType: 'CommunicationPath',
        kind: 'edge',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    Message: {
        astType: 'Message',
        kind: 'edge',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    Lifeline: {
        astType: 'Lifeline',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    Interaction: {
        astType: 'Interaction',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [
            {
                property: 'lifelines',
                childTypes: ['Lifeline']
            },
            {
                property: 'messages',
                childTypes: ['Message']
            }
        ],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            },
            {
                property: 'lifelines',
                defaultValue: []
            },
            {
                property: 'messages',
                defaultValue: []
            }
        ]
    },
    Substitution: {
        astType: 'Substitution',
        kind: 'edge',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    Slot: {
        astType: 'Slot',
        kind: 'unbounded',
        noBounds: true,
        owned: true,
        floating: false,
        shape: {
            repositionable: false,
            resizable: false,
            deletable: true
        },
        contains: [
            {
                property: 'values',
                childTypes: ['LiteralSpecification']
            }
        ],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'values',
                defaultValue: []
            }
        ]
    },
    LiteralSpecification: {
        astType: 'LiteralSpecification',
        kind: 'unbounded',
        noBounds: true,
        owned: true,
        floating: false,
        shape: {
            repositionable: false,
            resizable: false,
            deletable: true
        },
        contains: [],
        optionalName: false,
        unnamed: false,
        defaults: []
    },
    Realization: {
        astType: 'Realization',
        kind: 'edge',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    NaryAssociation: {
        astType: 'NaryAssociation',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        defaultSize: {
            width: 40,
            height: 40
        },
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    InterfaceRealization: {
        astType: 'InterfaceRealization',
        kind: 'edge',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    InstanceSpecification: {
        astType: 'InstanceSpecification',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [
            {
                property: 'slots',
                childTypes: ['Slot']
            }
        ],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            },
            {
                property: 'slots',
                defaultValue: []
            }
        ]
    },
    Composition: {
        astType: 'Association',
        kind: 'edge',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'targetAggregation',
                defaultValue: 'COMPOSITE'
            },
            {
                property: 'sourceAggregation',
                defaultValue: 'NONE'
            },
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    Aggregation: {
        astType: 'Association',
        kind: 'edge',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'targetAggregation',
                defaultValue: 'SHARED'
            },
            {
                property: 'sourceAggregation',
                defaultValue: 'NONE'
            },
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    SendSignalAction: {
        astType: 'SendSignalAction',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        defaultSize: {
            width: 140,
            height: 60
        },
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    OutputPin: {
        astType: 'OutputPin',
        kind: 'unbounded',
        noBounds: true,
        owned: true,
        floating: false,
        shape: {
            repositionable: false,
            resizable: false,
            deletable: true
        },
        contains: [],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    OpaqueAction: {
        astType: 'OpaqueAction',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        defaultSize: {
            width: 80,
            height: 60
        },
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [
            {
                property: 'inputPins',
                childTypes: ['InputPin']
            },
            {
                property: 'outputPins',
                childTypes: ['OutputPin']
            }
        ],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            },
            {
                property: 'inputPins',
                defaultValue: []
            },
            {
                property: 'outputPins',
                defaultValue: []
            }
        ]
    },
    InputPin: {
        astType: 'InputPin',
        kind: 'unbounded',
        noBounds: true,
        owned: true,
        floating: false,
        shape: {
            repositionable: false,
            resizable: false,
            deletable: true
        },
        contains: [],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    MergeNode: {
        astType: 'MergeNode',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        defaultSize: {
            width: 40,
            height: 40
        },
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    JoinNode: {
        astType: 'JoinNode',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        defaultSize: {
            width: 120,
            height: 10
        },
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    InitialNode: {
        astType: 'InitialNode',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        defaultSize: {
            width: 30,
            height: 30
        },
        shape: {
            repositionable: true,
            resizable: false,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    ForkNode: {
        astType: 'ForkNode',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        defaultSize: {
            width: 120,
            height: 10
        },
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    FlowFinalNode: {
        astType: 'FlowFinalNode',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        defaultSize: {
            width: 30,
            height: 30
        },
        shape: {
            repositionable: true,
            resizable: false,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    DecisionNode: {
        astType: 'DecisionNode',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        defaultSize: {
            width: 40,
            height: 40
        },
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    ControlFlow: {
        astType: 'ControlFlow',
        kind: 'edge',
        noBounds: false,
        owned: false,
        floating: false,
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            },
            {
                property: 'weight',
                defaultValue: 0
            }
        ]
    },
    CentralBufferNode: {
        astType: 'CentralBufferNode',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        defaultSize: {
            width: 80,
            height: 60
        },
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    ActivityPartition: {
        astType: 'ActivityPartition',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        defaultSize: {
            width: 600,
            height: 300
        },
        opensWith: {
            property: 'subpartitions',
            count: 2
        },
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [
            {
                property: 'subpartitions',
                childTypes: ['ActivityPartition']
            },
            {
                property: 'nodes',
                childTypes: [
                    'OpaqueAction',
                    'AcceptEventAction',
                    'SendSignalAction',
                    'InitialNode',
                    'DecisionNode',
                    'MergeNode',
                    'JoinNode',
                    'ForkNode',
                    'ActivityFinalNode',
                    'FlowFinalNode',
                    'CentralBufferNode'
                ]
            }
        ],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            },
            {
                property: 'orientation',
                defaultValue: 'HORIZONTAL'
            },
            {
                property: 'subpartitions',
                defaultValue: []
            },
            {
                property: 'nodes',
                defaultValue: []
            }
        ]
    },
    ActivityFinalNode: {
        astType: 'ActivityFinalNode',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        defaultSize: {
            width: 30,
            height: 30
        },
        shape: {
            repositionable: true,
            resizable: false,
            deletable: true
        },
        contains: [],
        optionalName: true,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    AcceptEventAction: {
        astType: 'AcceptEventAction',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        defaultSize: {
            width: 140,
            height: 60
        },
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    ActivityParameterNode: {
        astType: 'ActivityParameterNode',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        defaultSize: {
            width: 120,
            height: 50
        },
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            }
        ]
    },
    Activity: {
        astType: 'Activity',
        kind: 'node',
        noBounds: false,
        owned: false,
        floating: false,
        defaultSize: {
            width: 600,
            height: 400
        },
        shape: {
            repositionable: true,
            resizable: true,
            deletable: true
        },
        contains: [
            {
                property: 'parameters',
                childTypes: ['Property']
            },
            {
                property: 'nodes',
                childTypes: [
                    'OpaqueAction',
                    'AcceptEventAction',
                    'SendSignalAction',
                    'InitialNode',
                    'DecisionNode',
                    'MergeNode',
                    'JoinNode',
                    'ForkNode',
                    'ActivityFinalNode',
                    'FlowFinalNode',
                    'CentralBufferNode'
                ]
            }
        ],
        optionalName: false,
        unnamed: false,
        defaults: [
            {
                property: 'visibility',
                defaultValue: 'NONE'
            },
            {
                property: 'parameters',
                defaultValue: []
            },
            {
                property: 'nodes',
                defaultValue: []
            }
        ]
    }
};

/** The elements an element type id names by its template rather than its AST type - see `elementKeyOf`. */
const templateElements: Record<string, string> = {
    composition: 'Composition',
    aggregation: 'Aggregation'
};

/**
 * The AST type an element type id names: the last segment of `<representation>__[<template>__]<AstType>`.
 * A bare AST type is returned as it is.
 */
export function astTypeOf(typeIdOrAstType: string): string {
    const segments = typeIdOrAstType.split('__');
    return segments[segments.length - 1];
}

/**
 * The element an element type id or an AST type stands for. An id with a template names the element it
 * was made from there - `class__aggregation__Association` is an `Aggregation`, stored as an `Association`.
 */
export function elementKeyOf(typeIdOrAstType: string): string {
    const segments = typeIdOrAstType.split('__');
    const template = segments.length >= 3 ? templateElements[segments[segments.length - 2]] : undefined;
    return template ?? segments[segments.length - 1];
}

export function getElementMetadata(typeIdOrAstType: string): ElementMetadata | undefined {
    return elementMetadata[elementKeyOf(typeIdOrAstType)];
}

/** The AST type a new element of this type id is stored as - an alias as the type it aliases. */
export function storedAstTypeOf(typeIdOrAstType: string): string {
    return getElementMetadata(typeIdOrAstType)?.astType ?? astTypeOf(typeIdOrAstType);
}

/** The values a new element of this type is created with - fresh ones on every call, so they can be changed. */
export function getDefaultProperties(typeIdOrAstType: string): ElementDefault[] {
    return (getElementMetadata(typeIdOrAstType)?.defaults ?? []).map(entry => ({
        ...entry,
        defaultValue: structuredClone(entry.defaultValue)
    }));
}

/** Whether the element stores no `bounds` of its own. */
export function isNoBounds(typeIdOrAstType: string): boolean {
    return getElementMetadata(typeIdOrAstType)?.noBounds ?? false;
}

/** Whether clearing this element's name can be stored, by removing the property altogether. */
export function hasOptionalName(typeIdOrAstType: string): boolean {
    return getElementMetadata(typeIdOrAstType)?.optionalName ?? false;
}

/** Whether the element carries no name at all - a note, which is the text it holds. */
export function hasNoName(typeIdOrAstType: string): boolean {
    return getElementMetadata(typeIdOrAstType)?.unnamed ?? false;
}

/** Whether an element of this type can only be created inside an owner, never on the canvas by itself. */
export function isOwnedElementType(typeIdOrAstType: string): boolean {
    return getElementMetadata(typeIdOrAstType)?.owned ?? false;
}

/** Whether an element of this type is never written inside another element. */
export function isFloatingType(typeIdOrAstType: string): boolean {
    return getElementMetadata(typeIdOrAstType)?.floating ?? false;
}

/** The size a new node of this type opens at. */
export function getDefaultSize(typeIdOrAstType: string): ElementSize {
    return getElementMetadata(typeIdOrAstType)?.defaultSize ?? DEFAULT_NODE_SIZE;
}

/** The property of `containerType` a child of `childType` is written into, if the container holds such children. */
export function getContainmentProperty(containerType: string, childType: string): string | undefined {
    const child = astTypeOf(childType);
    return getElementMetadata(containerType)?.contains.find(entry => entry.childTypes.includes(child))?.property;
}
