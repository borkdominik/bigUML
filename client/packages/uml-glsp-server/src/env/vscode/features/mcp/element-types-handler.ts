/********************************************************************************
 * Copyright (c) 2026 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import {
    createResourceToolResult,
    ElementTypesMcpResourceHandler,
    type GLSPMcpServer,
    objectArrayToMarkdownTable,
    type ResourceHandlerResult
} from '@eclipse-glsp/server-mcp';
import { injectable } from 'inversify';
import * as z from 'zod/v4';
import { ClassDiagramEdgeTypes, ClassDiagramNodeTypes } from '../../../common/index.js';

const UML_NODE_ELEMENT_TYPES: {
    id: string;
    label: string;
    description: string;
    possibleMembers: string[];
    isDataType: boolean;
}[] = [
    {
        id: ClassDiagramNodeTypes.INTERFACE,
        label: 'Interface',
        description: 'A UML interface defining a contract',
        possibleMembers: [ClassDiagramNodeTypes.PROPERTY, ClassDiagramNodeTypes.OPERATION],
        isDataType: true
    },
    {
        id: ClassDiagramNodeTypes.ABSTRACT_CLASS,
        label: 'Abstract Class',
        description: 'An abstract class (cannot be instantiated)',
        possibleMembers: [ClassDiagramNodeTypes.PROPERTY, ClassDiagramNodeTypes.OPERATION],
        isDataType: true
    },
    {
        id: ClassDiagramNodeTypes.CLASS,
        label: 'Class',
        description: 'A standard UML class with properties and operations',
        possibleMembers: [ClassDiagramNodeTypes.PROPERTY, ClassDiagramNodeTypes.OPERATION],
        isDataType: true
    },
    {
        id: ClassDiagramNodeTypes.ENUMERATION,
        label: 'Enumeration',
        description: 'An enumeration type (fixed set of values)',
        possibleMembers: [ClassDiagramNodeTypes.ENUMERATION_LITERAL],
        isDataType: true
    },
    {
        id: ClassDiagramNodeTypes.DATA_TYPE,
        label: 'Data Type',
        description: 'A data type (structured value type)',
        possibleMembers: [],
        isDataType: true
    },
    {
        id: ClassDiagramNodeTypes.PRIMITIVE_TYPE,
        label: 'Primitive Type',
        description: 'A primitive type (e.g., String, Integer)',
        possibleMembers: [],
        isDataType: true
    }
];
const UML_MEMBER_ELEMENT_TYPES: {
    id: string;
    label: string;
    description: string;
}[] = [
    {
        id: ClassDiagramNodeTypes.ENUMERATION_LITERAL,
        label: 'Enumeration Literal',
        description: 'A literal value within an enumeration'
    },
    {
        id: ClassDiagramNodeTypes.PROPERTY,
        label: 'Property',
        description: 'An attribute/field of a class or interface'
    },
    {
        id: ClassDiagramNodeTypes.OPERATION,
        label: 'Operation',
        description: 'A method/function of a class or interface'
    }
];
const UML_EDGE_ELEMENT_TYPES: {
    id: string;
    label: string;
    description: string;
    sourceTypes: string[];
    targetTypes: string[];
}[] = [
    {
        id: ClassDiagramEdgeTypes.ASSOCIATION,
        label: 'Association',
        description: 'A general relationship between two classes',
        sourceTypes: [
            ClassDiagramNodeTypes.INTERFACE,
            ClassDiagramNodeTypes.ABSTRACT_CLASS,
            ClassDiagramNodeTypes.CLASS,
            ClassDiagramNodeTypes.ENUMERATION,
            ClassDiagramNodeTypes.DATA_TYPE,
            ClassDiagramNodeTypes.PRIMITIVE_TYPE
        ],
        targetTypes: [
            ClassDiagramNodeTypes.INTERFACE,
            ClassDiagramNodeTypes.ABSTRACT_CLASS,
            ClassDiagramNodeTypes.CLASS,
            ClassDiagramNodeTypes.ENUMERATION,
            ClassDiagramNodeTypes.DATA_TYPE,
            ClassDiagramNodeTypes.PRIMITIVE_TYPE
        ]
    },
    {
        id: ClassDiagramEdgeTypes.AGGREGATION,
        label: 'Aggregation',
        description: 'Aggregation — "has-a" (weak ownership, hollow diamond)',
        sourceTypes: [ClassDiagramNodeTypes.ABSTRACT_CLASS, ClassDiagramNodeTypes.CLASS],
        targetTypes: [ClassDiagramNodeTypes.ABSTRACT_CLASS, ClassDiagramNodeTypes.CLASS]
    },
    {
        id: ClassDiagramEdgeTypes.COMPOSITION,
        label: 'Composition',
        description: 'Composition — "owns-a" (strong ownership, filled diamond)',
        sourceTypes: [ClassDiagramNodeTypes.ABSTRACT_CLASS, ClassDiagramNodeTypes.CLASS],
        targetTypes: [ClassDiagramNodeTypes.ABSTRACT_CLASS, ClassDiagramNodeTypes.CLASS]
    },
    {
        id: ClassDiagramEdgeTypes.GENERALIZATION,
        label: 'Generalization',
        description: 'Inheritance — "is-a" (child extends parent)',
        sourceTypes: [ClassDiagramNodeTypes.INTERFACE, ClassDiagramNodeTypes.ABSTRACT_CLASS, ClassDiagramNodeTypes.CLASS],
        targetTypes: [ClassDiagramNodeTypes.INTERFACE, ClassDiagramNodeTypes.ABSTRACT_CLASS, ClassDiagramNodeTypes.CLASS]
    },
    {
        id: ClassDiagramEdgeTypes.INTERFACE_REALIZATION,
        label: 'Interface Realization',
        description: 'A class implements an interface',
        sourceTypes: [ClassDiagramNodeTypes.ABSTRACT_CLASS, ClassDiagramNodeTypes.CLASS],
        targetTypes: [ClassDiagramNodeTypes.INTERFACE]
    },
    {
        id: ClassDiagramEdgeTypes.REALIZATION,
        label: 'Realization',
        description: 'A realization between a specification and its implementation',
        sourceTypes: [ClassDiagramNodeTypes.ABSTRACT_CLASS, ClassDiagramNodeTypes.CLASS],
        targetTypes: [ClassDiagramNodeTypes.INTERFACE, ClassDiagramNodeTypes.ABSTRACT_CLASS, ClassDiagramNodeTypes.DATA_TYPE]
    },
    {
        id: ClassDiagramEdgeTypes.ABSTRACTION,
        label: 'Abstraction',
        description: 'Maps a more concrete element to a more abstract one',
        sourceTypes: [ClassDiagramNodeTypes.ABSTRACT_CLASS, ClassDiagramNodeTypes.CLASS],
        targetTypes: [ClassDiagramNodeTypes.INTERFACE, ClassDiagramNodeTypes.ABSTRACT_CLASS]
    },
    {
        id: ClassDiagramEdgeTypes.SUBSTITUTION,
        label: 'Substitution',
        description: 'One class can substitute for another',
        sourceTypes: [ClassDiagramNodeTypes.CLASS],
        targetTypes: [ClassDiagramNodeTypes.CLASS]
    },
    {
        id: ClassDiagramEdgeTypes.DEPENDENCY,
        label: 'Dependency',
        description: 'One element depends on another',
        sourceTypes: [
            ClassDiagramNodeTypes.INTERFACE,
            ClassDiagramNodeTypes.ABSTRACT_CLASS,
            ClassDiagramNodeTypes.CLASS,
            ClassDiagramNodeTypes.ENUMERATION,
            ClassDiagramNodeTypes.DATA_TYPE,
            ClassDiagramNodeTypes.PRIMITIVE_TYPE
        ],
        targetTypes: [
            ClassDiagramNodeTypes.INTERFACE,
            ClassDiagramNodeTypes.ABSTRACT_CLASS,
            ClassDiagramNodeTypes.CLASS,
            ClassDiagramNodeTypes.ENUMERATION,
            ClassDiagramNodeTypes.DATA_TYPE,
            ClassDiagramNodeTypes.PRIMITIVE_TYPE
        ]
    },
    {
        id: ClassDiagramEdgeTypes.USAGE,
        label: 'Usage',
        description: 'A type of dependency — one element uses another',
        sourceTypes: [ClassDiagramNodeTypes.INTERFACE, ClassDiagramNodeTypes.ABSTRACT_CLASS, ClassDiagramNodeTypes.CLASS],
        targetTypes: [
            ClassDiagramNodeTypes.INTERFACE,
            ClassDiagramNodeTypes.ABSTRACT_CLASS,
            ClassDiagramNodeTypes.CLASS,
            ClassDiagramNodeTypes.DATA_TYPE
        ]
    }
];

const UML_ELEMENT_TYPES_STRING = [
    '# Creatable element types for diagram type "uml-diagram"',
    '## Node Types (top-level containers)',
    objectArrayToMarkdownTable(UML_NODE_ELEMENT_TYPES),
    '## Member Types (nested inside nodes)',
    objectArrayToMarkdownTable(UML_MEMBER_ELEMENT_TYPES),
    '## Edge Types (relations)',
    objectArrayToMarkdownTable(UML_EDGE_ELEMENT_TYPES)
].join('\n');

/**
 * The default {@link ElementTypesMcpResourceHandler} extracts a list of operations generically from
 * the `OperationHandlerRegistry`, because it can't know the details of a specific GLSP implementation.
 * This is naturally quite limited in expression and relies on semantically meaningful model types to be
 * able to inform an MCP client reliably.
 *
 * However, when overriding this for a specific implementation, we don't have those limitations. Rather,
 * since the available element types do not change dynamically, we can simply provide a statically generated
 * string.
 */
@injectable()
export class UmlElementTypesMcpResourceHandler extends ElementTypesMcpResourceHandler {
    override registerTool(server: GLSPMcpServer): void {
        server.registerTool(
            'element-types',
            {
                title: 'Creatable Element Types',
                description:
                    'List all element types (nodes and edges) that can be created for a specific diagram type. ' +
                    'Use this to discover valid elementTypeId values for creation tools.',
                inputSchema: {
                    diagramType: z.string().describe('Diagram type whose elements should be discovered')
                }
            },
            async params => createResourceToolResult(await this.handle(params))
        );
    }

    override async handle({ diagramType }: { diagramType?: string }): Promise<ResourceHandlerResult> {
        this.logger.info(`'element-types' invoked for diagram type '${diagramType}'`);

        // In this specifc GLSP implementation, only 'uml-diagram' is valid
        if (diagramType !== 'uml-diagram') {
            return {
                content: {
                    uri: `glsp://types/${diagramType}/elements`,
                    mimeType: 'text/plain',
                    text: 'Invalid diagram type.'
                },
                isError: true
            };
        }

        return {
            content: {
                uri: `glsp://types/${diagramType}/elements`,
                mimeType: 'text/markdown',
                text: UML_ELEMENT_TYPES_STRING
            },
            isError: false
        };
    }
}
