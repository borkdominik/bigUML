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
import type { Interface } from '@borkdominik-biguml/uml-model-server/grammar';
import { type Dimension, type Point } from '@eclipse-glsp/protocol';
import { GNode, type GModelElement } from '@eclipse-glsp/server';
import { CompartmentHeader } from './shared-components.js';

export class GInterfaceNode extends GNode {
    override type = ClassDiagramNodeTypes.INTERFACE;
    override layout = 'vbox';
    name: string = 'UNDEFINED CLASS NAME';
    isAbstract: boolean = false;
}

export interface GInterfaceNodeElementProps {
    node: Interface;
    position?: Point;
    size?: Dimension;
    children?: GlspNode;
}

export function GInterfaceNodeElement(props: GInterfaceNodeElementProps): GModelElement {
    const { node, position, size, children } = props;
    const id = node.__id;

    const interfaceNode = new GInterfaceNode();
    interfaceNode.id = id;
    interfaceNode.name = node.name;
    interfaceNode.isAbstract = false;
    interfaceNode.cssClasses = ['uml-node'];
    interfaceNode.children = [];

    if (position) {
        interfaceNode.position = position;
    }
    if (size) {
        interfaceNode.size = size;
        interfaceNode.layoutOptions = { prefWidth: size.width, prefHeight: size.height };
    }

    const header = <CompartmentHeader id={id} name={node.name} />;
    header.parent = interfaceNode;
    interfaceNode.children.push(header);

    for (const child of normalizeChildren(children)) {
        child.parent = interfaceNode;
        interfaceNode.children.push(child);
    }

    return interfaceNode;
}
