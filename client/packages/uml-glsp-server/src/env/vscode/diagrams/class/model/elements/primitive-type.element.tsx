/**********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { PrimitiveType } from '@borkdominik-biguml/model-server/grammar';
import { type Dimension, type Point } from '@eclipse-glsp/protocol';
import { GNode, type GModelElement } from '@eclipse-glsp/server';
import { ModelTypes } from '../model-types.js';
import { CompartmentHeader } from './shared-components.js';

export class GPrimitiveTypeNode extends GNode {
    override type = ModelTypes.PRIMITIVE_TYPE;
    override layout = 'vbox';
    name: string = 'UNDEFINED DataType NAME';
}

export interface GPrimitiveTypeNodeElementProps {
    node: PrimitiveType;
    position?: Point;
    size?: Dimension;
}

export function GPrimitiveTypeNodeElement(props: GPrimitiveTypeNodeElementProps): GModelElement {
    const { node, position, size } = props;
    const id = node.__id;

    const primNode = new GPrimitiveTypeNode();
    primNode.id = id;
    primNode.name = node.name;
    primNode.cssClasses = ['uml-node'];
    primNode.children = [];

    if (position) {
        primNode.position = position;
    }
    if (size) {
        primNode.size = size;
        primNode.layoutOptions = { prefWidth: size.width, prefHeight: size.height };
    }

    const header = <CompartmentHeader id={id} name={node.name} stereotype='PrimitiveType' />;
    header.parent = primNode;
    primNode.children.push(header);

    return primNode;
}
