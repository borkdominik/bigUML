/**********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { Class } from '@borkdominik-biguml/model-server/grammar';
import type { GlspNode } from '@borkdominik-biguml/uml-glsp-jsx';
import { normalizeChildren } from '@borkdominik-biguml/uml-glsp-jsx';
import { type Dimension, type Point } from '@eclipse-glsp/protocol';
import { GNode, type GModelElement } from '@eclipse-glsp/server';
import { ModelTypes } from '../model-types.js';
import { CompartmentHeader } from './shared-components.js';

export class GClassNode extends GNode {
    override type = ModelTypes.CLASS;
    override layout = 'vbox';
    name: string = 'UNDEFINED CLASS NAME';
    isAbstract: boolean = false;
}

export interface GClassNodeElementProps {
    node: Class;
    position?: Point;
    size?: Dimension;
    children?: GlspNode;
}

export function GClassNodeElement(props: GClassNodeElementProps): GModelElement {
    const { node, position, size, children } = props;
    const id = node.__id;

    const classNode = new GClassNode();
    classNode.id = id;
    classNode.name = node.name;
    classNode.isAbstract = node.isAbstract;
    classNode.cssClasses = ['uml-node'];
    classNode.children = [];

    if (position) {
        classNode.position = position;
    }
    if (size) {
        classNode.size = size;
        classNode.layoutOptions = { prefWidth: size.width, prefHeight: size.height };
    }

    // Header
    const header = <CompartmentHeader id={id} name={node.name} isAbstract={node.isAbstract} />;
    header.parent = classNode;
    classNode.children.push(header);

    // Children (properties/operations compartments injected from factory)
    for (const child of normalizeChildren(children)) {
        child.parent = classNode;
        classNode.children.push(child);
    }

    return classNode;
}
