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
import type { InstanceSpecification } from '@borkdominik-biguml/uml-model-server/grammar';
import { type Dimension, type Point } from '@eclipse-glsp/protocol';
import { GNode, type GModelElement } from '@eclipse-glsp/server';
import type { ElementContext } from './core/element-context.js';
import { CompartmentHeader, SectionCompartment } from './core/index.js';
import { GSlotNodeElement } from './slot.element.js';

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

export function createInstanceSpecificationElement(
    ctx: ElementContext<InstanceSpecification>
): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);

    const slotsSection =
        ctx.node.slots?.length > 0 ? (
            <SectionCompartment id={ctx.node.__id + '_count_context_1'} dividerText='Slots'>
                {ctx.node.slots.map(s => (
                    <GSlotNodeElement node={s} />
                ))}
            </SectionCompartment>
        ) : null;

    return (
        <GInstanceSpecificationNodeElement node={ctx.node} position={position} size={size}>
            {slotsSection}
        </GInstanceSpecificationNodeElement>
    );
}
