/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { GNodeElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { Subject } from '@borkdominik-biguml/uml-model-server/grammar';
import type { GModelElement } from '@eclipse-glsp/server';
import { FrameNameTag, FreeformCompartment } from './core/index.js';
import type { BaseElementProps, ElementContext } from './core/element-context.js';

export interface GSubjectNodeElementProps extends BaseElementProps {
    node: Subject;
    freeformChildren?: GModelElement[];
}

export function GSubjectNodeElement(props: GSubjectNodeElementProps): GModelElement {
    const { node, position, size, type, freeformChildren } = props;

    return (
        <GNodeElement
            id={node.__id}
            type={type}
            position={position}
            size={size}
            cssClasses={['uml-node', 'uml-subject-node']}
            layout='vbox'
            layoutOptions={{ hAlign: 'left', ...(size ? { prefWidth: size.width, prefHeight: size.height } : {}) }}
        >
            <FrameNameTag id={node.__id} name={node.name} />
            {freeformChildren && <FreeformCompartment ownerId={node.__id}>{freeformChildren}</FreeformCompartment>}
        </GNodeElement>
    );
}

export function createSubjectElement(ctx: ElementContext<Subject>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);

    // A subject draws the use cases it holds inside its own compartment, the way a package draws what
    // it holds - so they move with it, and it grows to keep them in.
    const freeformChildren = (ctx.node.useCases ?? []).map(useCase => ctx.renderNode(useCase)).filter(Boolean) as GModelElement[];

    return (
        <GSubjectNodeElement
            node={ctx.node}
            position={position}
            size={size}
            type={ctx.elementType}
            freeformChildren={freeformChildren.length > 0 ? freeformChildren : undefined}
        />
    );
}
