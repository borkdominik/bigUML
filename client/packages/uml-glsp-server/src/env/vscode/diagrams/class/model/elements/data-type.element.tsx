/**********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { DataType } from '@borkdominik-biguml/model-server/grammar';
import type { GlspNode } from '@borkdominik-biguml/uml-glsp-jsx';
import { normalizeChildren } from '@borkdominik-biguml/uml-glsp-jsx';
import { type Dimension, type Point } from '@eclipse-glsp/protocol';
import { GNode, type GModelElement } from '@eclipse-glsp/server';
import { ModelTypes } from '../model-types.js';
import { CompartmentHeader } from './shared-components.js';

export class GDataTypeNode extends GNode {
    override type = ModelTypes.DATA_TYPE;
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
