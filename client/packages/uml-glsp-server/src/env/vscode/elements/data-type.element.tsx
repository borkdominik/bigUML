/**********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { ClassDiagramNodeTypes } from '@borkdominik-biguml/uml-glsp-server';
import type { GlspNode } from '@borkdominik-biguml/uml-glsp-server/jsx';
import { normalizeChildren } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { DataType } from '@borkdominik-biguml/uml-model-server/grammar';
import { type Dimension, type Point } from '@eclipse-glsp/protocol';
import { GNode, type GModelElement } from '@eclipse-glsp/server';
import type { ElementContext } from './core/element-context.js';
import { CompartmentHeader, SectionCompartment } from './core/index.js';
import { GOperationNodeElement } from './operation.element.js';
import { GPropertyNodeElement } from './property.element.js';

export class GDataTypeNode extends GNode {
    override type = ClassDiagramNodeTypes.DATA_TYPE;
    override layout = 'vbox';
    name: string = 'UNDEFINED DataType NAME';
}

export interface GDataTypeNodeElementProps {
    node: DataType;
    position?: Point;
    size?: Dimension;
    children?: GlspNode;
}

export function GDataTypeNodeElement(props: GDataTypeNodeElementProps): GModelElement {
    const { node, position, size, children } = props;
    const id = node.__id;

    const dataTypeNode = new GDataTypeNode();
    dataTypeNode.id = id;
    dataTypeNode.name = node.name;
    dataTypeNode.cssClasses = ['uml-node'];
    dataTypeNode.children = [];

    if (position) {
        dataTypeNode.position = position;
    }
    if (size) {
        dataTypeNode.size = size;
        dataTypeNode.layoutOptions = { prefWidth: size.width, prefHeight: size.height };
    }

    const header = <CompartmentHeader id={id} name={node.name} stereotype='DataType' />;
    header.parent = dataTypeNode;
    dataTypeNode.children.push(header);

    for (const child of normalizeChildren(children)) {
        child.parent = dataTypeNode;
        dataTypeNode.children.push(child);
    }

    return dataTypeNode;
}

export function createDataTypeElement(ctx: ElementContext<DataType>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);

    const propertiesSection =
        ctx.node.properties?.length > 0 ? (
            <SectionCompartment id={ctx.node.__id + '_count_context_1'} dividerText='Attributes'>
                {ctx.node.properties.map(p => (
                    <GPropertyNodeElement node={p} />
                ))}
            </SectionCompartment>
        ) : null;

    const operationsSection =
        ctx.node.operations?.length > 0 ? (
            <SectionCompartment id={ctx.node.__id + '_count_context_3'} dividerText='Methods'>
                {ctx.node.operations.map(o => (
                    <GOperationNodeElement node={o} />
                ))}
            </SectionCompartment>
        ) : null;

    return (
        <GDataTypeNodeElement node={ctx.node} position={position} size={size}>
            {propertiesSection}
            {operationsSection}
        </GDataTypeNodeElement>
    );
}
