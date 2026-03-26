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

import { type GModelElement } from '@eclipse-glsp/graph';
import { DefaultTypes } from '@eclipse-glsp/server';
import { DefaultMcpModelSerializer } from '@eclipse-glsp/server-mcp';
import { type GLabel } from '@eclipse-glsp/sprotty';
import { injectable } from 'inversify';
import { ClassDiagramEdgeTypes, ClassDiagramNodeTypes, CommonModelTypes } from '../../../common/index.js';

// TODO create via code generation (out of scope)
// since the generated keys are the result of code generation, it likely makes sense to include this
// component in that generation process, but that is outside my scope

/**
 * As compared to the {@link DefaultMcpModelSerializer}, this is a specific implementation and we
 * know not only the structure of our graph but also each relevant attribute. This enables us to
 * order them semantically so the produced serialization makes more sense if read with semantics
 * mind. As LLMs (i.e., the MCP clients) work semantically, this is superior to a random ordering.
 * Furthermore, including only the relevant information without redundancies decreases context size.
 */
@injectable()
export class UmlMcpModelSerializer extends DefaultMcpModelSerializer {
    override prepareElement(element: GModelElement): Record<string, Record<string, any>[]> {
        const elements = this.flattenStructure(element);

        // Define the order of keys
        const result: Record<string, Record<string, any>[]> = {
            [DefaultTypes.GRAPH]: [],
            // Node types
            [ClassDiagramNodeTypes.PACKAGE]: [],
            [ClassDiagramNodeTypes.INTERFACE]: [],
            // CLASS and ABSTRACT_CLASS have the same type in practise
            [ClassDiagramNodeTypes.CLASS]: [],
            [ClassDiagramNodeTypes.PROPERTY]: [],
            [ClassDiagramNodeTypes.OPERATION]: [],
            [ClassDiagramNodeTypes.ENUMERATION]: [],
            [ClassDiagramNodeTypes.ENUMERATION_LITERAL]: [],
            [ClassDiagramNodeTypes.DATA_TYPE]: [],
            [ClassDiagramNodeTypes.PRIMITIVE_TYPE]: [],
            [ClassDiagramNodeTypes.INSTANCE_SPECIFICATION]: [],
            [ClassDiagramNodeTypes.SLOT]: [],
            // Edge types
            [ClassDiagramEdgeTypes.ABSTRACTION]: [],
            [ClassDiagramEdgeTypes.AGGREGATION]: [],
            [ClassDiagramEdgeTypes.ASSOCIATION]: [],
            [ClassDiagramEdgeTypes.COMPOSITION]: [],
            [ClassDiagramEdgeTypes.DEPENDENCY]: [],
            [ClassDiagramEdgeTypes.GENERALIZATION]: [],
            [ClassDiagramEdgeTypes.INTERFACE_REALIZATION]: [],
            [ClassDiagramEdgeTypes.PACKAGE_IMPORT]: [],
            [ClassDiagramEdgeTypes.PACKAGE_MERGE]: [],
            [ClassDiagramEdgeTypes.REALIZATION]: [],
            [ClassDiagramEdgeTypes.SUBSTITUTION]: [],
            [ClassDiagramEdgeTypes.USAGE]: []
        };
        elements.forEach(element => {
            this.combinePositionAndSize(element);

            const adjustedElement = this.adjustElement(element);
            if (!adjustedElement) {
                return;
            }

            result[element.type].push(adjustedElement);
        });

        // Remove all unused keys to keep the output small and relevant
        Object.keys(result).forEach(key => {
            if (!result[key].length) {
                delete result[key];
            }
        });

        return result;
    }

    private adjustElement(element: Record<string, any>): Record<string, any> | undefined {
        switch (element.type) {
            case DefaultTypes.GRAPH: {
                return {
                    id: element.id,
                    isRoot: true
                };
            }
            case ClassDiagramNodeTypes.PACKAGE:
            case ClassDiagramNodeTypes.ENUMERATION:
            case ClassDiagramNodeTypes.DATA_TYPE:
            case ClassDiagramNodeTypes.PRIMITIVE_TYPE:
            case ClassDiagramNodeTypes.INSTANCE_SPECIFICATION: {
                const label = (element as GModelElement).children
                    .find(child => child.type === DefaultTypes.COMPARTMENT_HEADER)
                    ?.children.find(child => child.type === CommonModelTypes.LABEL_NAME) as GLabel | undefined;

                return {
                    id: element.id,
                    parentId: element.parentId,
                    name: label?.text ?? '',
                    position: element.position,
                    size: element.size,
                    bounds: element.bounds
                };
            }
            case ClassDiagramNodeTypes.INTERFACE:
            case ClassDiagramNodeTypes.CLASS: {
                const label = (element as GModelElement).children
                    .find(child => child.type === DefaultTypes.COMPARTMENT_HEADER)
                    ?.children.find(child => child.type === CommonModelTypes.LABEL_NAME) as GLabel | undefined;

                return {
                    id: element.id,
                    parentId: element.parentId,
                    name: label?.text ?? '',
                    isAbstract: element.isAbstract,
                    position: element.position,
                    size: element.size,
                    bounds: element.bounds
                };
            }
            case ClassDiagramNodeTypes.ENUMERATION_LITERAL: {
                const label = (element as GModelElement).children.find(child => child.type === CommonModelTypes.LABEL_NAME) as
                    | GLabel
                    | undefined;

                return {
                    id: element.id,
                    parentId: element.parent.parent.id,
                    name: label?.text ?? '',
                    position: element.position,
                    size: element.size,
                    bounds: element.bounds
                };
            }
            case ClassDiagramNodeTypes.PROPERTY: {
                return {
                    id: element.id,
                    parentId: element.parent.parent.id,
                    name: element.name,
                    propertyType: element.propertyType,
                    visibility: element.visibility,
                    position: element.position,
                    size: element.size,
                    bounds: element.bounds
                };
            }
            case ClassDiagramNodeTypes.OPERATION: {
                const parameterList = (element.parameterList as { key: string; type: string }[])
                    .map(param => `${param.key}:${param.type}`)
                    .join(', ');
                return {
                    id: element.id,
                    parentId: element.parent.parent.id,
                    name: element.name,
                    returnType: element.returnType,
                    visibility: element.visibility,
                    parameterList,
                    position: element.position,
                    size: element.size,
                    bounds: element.bounds
                };
            }
            case ClassDiagramNodeTypes.SLOT: {
                return {
                    id: element.id,
                    parentId: element.parent.parent.id,
                    position: element.position,
                    size: element.size,
                    bounds: element.bounds
                };
            }
            case ClassDiagramEdgeTypes.ABSTRACTION:
            case ClassDiagramEdgeTypes.AGGREGATION:
            case ClassDiagramEdgeTypes.ASSOCIATION:
            case ClassDiagramEdgeTypes.COMPOSITION:
            case ClassDiagramEdgeTypes.DEPENDENCY:
            case ClassDiagramEdgeTypes.GENERALIZATION:
            case ClassDiagramEdgeTypes.INTERFACE_REALIZATION:
            case ClassDiagramEdgeTypes.PACKAGE_IMPORT:
            case ClassDiagramEdgeTypes.PACKAGE_MERGE:
            case ClassDiagramEdgeTypes.REALIZATION:
            case ClassDiagramEdgeTypes.SUBSTITUTION:
            case ClassDiagramEdgeTypes.USAGE: {
                return {
                    id: element.id,
                    parentId: element.parentId,
                    sourceId: element.sourceId,
                    targetId: element.targetId
                };
            }
            default:
                return undefined;
        }
    }
}
