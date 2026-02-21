/**********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { InstanceSpecification } from '@borkdominik-biguml/model-server/grammar';
import type { GlspNode } from '@borkdominik-biguml/uml-glsp-jsx';
import { normalizeChildren } from '@borkdominik-biguml/uml-glsp-jsx';
import { ClassDiagramNodeTypes } from '@borkdominik-biguml/uml-glsp-server';
import { type Dimension, type Point } from '@eclipse-glsp/protocol';
import { GNode, type GModelElement } from '@eclipse-glsp/server';
import { CompartmentHeader } from './shared-components.js';

export class GInstanceSpecificationNode extends GNode {
    override type = ClassDiagramNodeTypes.INSTANCE_SPECIFICATION;
    override layout = 'vbox';
    name: string = 'UNDEFINED CLASS NAME';
}

export interface GInstanceSpecificationNodeElementProps {
    node: InstanceSpecification;
    position?: Point;
    size?: Dimension;
    children?: GlspNode;
}

export function GInstanceSpecificationNodeElement(props: GInstanceSpecificationNodeElementProps): GModelElement {
    const { node, position, size, children } = props;
    const id = node.__id;

    const instNode = new GInstanceSpecificationNode();
    instNode.id = id;
    instNode.name = node.name;
    instNode.cssClasses = ['uml-node'];
    instNode.children = [];

    if (position) {
        instNode.position = position;
    }
    if (size) {
        instNode.size = size;
        instNode.layoutOptions = { prefWidth: size.width, prefHeight: size.height };
    }

    const header = <CompartmentHeader id={id} name={node.name} />;
    header.parent = instNode;
    instNode.children.push(header);

    for (const child of normalizeChildren(children)) {
        child.parent = instNode;
        instNode.children.push(child);
    }

    return instNode;
}
