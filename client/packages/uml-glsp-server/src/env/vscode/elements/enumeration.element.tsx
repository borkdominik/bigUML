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
import type { Enumeration } from '@borkdominik-biguml/uml-model-server/grammar';
import { type Dimension, type Point } from '@eclipse-glsp/protocol';
import { GNode, type GModelElement } from '@eclipse-glsp/server';
import type { ElementContext } from './core/element-context.js';
import { CompartmentHeader, SectionCompartment } from './core/index.js';
import { GEnumerationLiteralNodeElement } from './enumeration-literal.element.js';

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

export function createEnumerationElement(ctx: ElementContext<Enumeration>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);

    const valuesSection =
        ctx.node.values?.length > 0 ? (
            <SectionCompartment id={ctx.node.__id + '_literal_component'}>
                {ctx.node.values.map(v => (
                    <GEnumerationLiteralNodeElement node={v} />
                ))}
            </SectionCompartment>
        ) : null;

    return (
        <GEnumerationNodeElement node={ctx.node} position={position} size={size}>
            {valuesSection}
        </GEnumerationNodeElement>
    );
}
