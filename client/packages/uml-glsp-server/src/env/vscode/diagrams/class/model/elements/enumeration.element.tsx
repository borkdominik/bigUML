/**********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { Enumeration } from '@borkdominik-biguml/model-server/grammar';
import type { GlspNode } from '../../../../../jsx/index.js';
import { normalizeChildren } from '../../../../../jsx/index.js';
import { ClassDiagramNodeTypes } from '@borkdominik-biguml/uml-glsp-server';
import { type Dimension, type Point } from '@eclipse-glsp/protocol';
import { GNode, type GModelElement } from '@eclipse-glsp/server';
import { CompartmentHeader } from './shared-components.js';

export class GEnumerationNode extends GNode {
    override type = ClassDiagramNodeTypes.ENUMERATION;
    override layout = 'vbox';
    name: string = 'UNDEFINED ENUMERATION NAME';
}

export interface GEnumerationNodeElementProps {
    node: Enumeration;
    position?: Point;
    size?: Dimension;
    children?: GlspNode;
}

export function GEnumerationNodeElement(props: GEnumerationNodeElementProps): GModelElement {
    const { node, position, size, children } = props;
    const id = node.__id;

    const enumNode = new GEnumerationNode();
    enumNode.id = id;
    enumNode.name = node.name;
    enumNode.cssClasses = ['uml-node'];
    enumNode.children = [];

    if (position) {
        enumNode.position = position;
    }
    if (size) {
        enumNode.size = size;
        enumNode.layoutOptions = { prefWidth: size.width, prefHeight: size.height };
    }

    const header = <CompartmentHeader id={id} name={node.name} stereotype='enumeration' stereotypeCssClasses={['uml-font-italic']} />;
    header.parent = enumNode;
    enumNode.children.push(header);

    for (const child of normalizeChildren(children)) {
        child.parent = enumNode;
        enumNode.children.push(child);
    }

    return enumNode;
}
